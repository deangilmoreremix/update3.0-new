import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users, type User, type InsertUser } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const SALT_ROUNDS = 12;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  userType?: 'user' | 'admin' | 'super_admin';
  adminCode?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  message?: string;
  error?: string;
}

export class AuthService {
  // Hash password before storing
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Verify password against hash
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate JWT token
  private generateToken(user: Omit<User, 'password'>): string {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  // Verify JWT token
  public verifyToken(token: string): unknown {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Remove password from user object for response
  private sanitizeUser(user: User): Omit<User, 'password'> {
    if (!user) {
      throw new Error('User is required for sanitization');
    }
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const { email, password, fullName, firstName, lastName, userType, adminCode } = data;

      // Validation
      if (!email || !password) {
        return {
          success: false,
          error: 'Email and password are required'
        };
      }

      // Check for super admin code and limit to 3 specific emails
      if (userType === 'super_admin') {
        if (adminCode !== 'SUPER_ADMIN_2024') {
          return {
            success: false,
            error: 'Invalid super admin code'
          };
        }
        
        // Only allow 3 specific emails to be super admin
        const allowedSuperAdminEmails = [
          'admin@test.com',
          'admin2@test.com', 
          'admin3@test.com'
        ];
        
        if (!allowedSuperAdminEmails.includes(email)) {
          return {
            success: false,
            error: 'Super admin access is restricted to authorized users only'
          };
        }
      }

      // Check if user already exists
      const existingUserResult = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingUserResult.length > 0) {
        return {
          success: false,
          error: 'User already exists with this email'
        };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Determine user role and privileges
      const isAdmin = email.includes('admin') || userType === 'super_admin' || userType === 'admin';
      const role = userType === 'super_admin' ? 'super_admin' : 
                   userType === 'admin' ? 'admin' : 'user';

      // Create user object
      const newUser: InsertUser = {
        email,
        password: hashedPassword,
        fullName: fullName || `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0],
        firstName: firstName || null,
        lastName: lastName || null,
        role,
        isAdmin,
        accountStatus: 'active',
        emailVerified: false,
        authProvider: 'email',
        subscriptionPlan: isAdmin ? 'enterprise' : 'professional',
        subscriptionStatus: 'free', // Start with free, can upgrade later
        paymentStatus: 'none'
      };

      // Insert user into database
      const [createdUser] = await db
        .insert(users)
        .values(newUser)
        .returning();

      // Generate token
      const sanitizedUser = this.sanitizeUser(createdUser);
      const token = this.generateToken(sanitizedUser);

      return {
        success: true,
        user: sanitizedUser,
        token,
        message: 'Registration successful'
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.'
      };
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;
      console.log('Login attempt for:', email);

      // Validation
      if (!email || !password) {
        return {
          success: false,
          error: 'Email and password are required'
        };
      }

      // Find user by email
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      
      console.log('User query result:', userResult.length);
      const user = userResult[0];

      if (!user) {
        console.log('No user found with email:', email);
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      console.log('Found user:', user.id, 'with role:', user.role);

      // Check account status
      if (user.accountStatus !== 'active') {
        console.log('Account inactive for user:', email);
        return {
          success: false,
          error: 'Account is suspended or inactive'
        };
      }

      // Verify password
      if (!user.password) {
        console.log('No password set for user:', email);
        return {
          success: false,
          error: 'Password authentication not available for this account'
        };
      }

      console.log('Verifying password...');
      const isPasswordValid = await this.verifyPassword(password, user.password);
      console.log('Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('Invalid password for user:', email);
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Update last login
      await db
        .update(users)
        .set({ 
          lastLoginAt: new Date(),
          loginAttempts: 0 // Reset login attempts on successful login
        })
        .where(eq(users.id, user.id));

      // Generate token
      const sanitizedUser = this.sanitizeUser(user);
      const token = this.generateToken(sanitizedUser);

      return {
        success: true,
        user: sanitizedUser,
        token,
        message: 'Login successful'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    try {
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      
      const user = userResult[0];
      return user ? this.sanitizeUser(user) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    try {
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      
      const user = userResult[0];
      return user ? this.sanitizeUser(user) : null;
    } catch (error) {
      console.error('Get user by email error:', error);
      return null;
    }
  }

  // Update user
  async updateUser(userId: string, updates: Partial<InsertUser>): Promise<Omit<User, 'password'> | null> {
    try {
      // Hash password if provided
      if (updates.password) {
        updates.password = await this.hashPassword(updates.password);
      }

      const [updatedUser] = await db
        .update(users)
        .set({ 
          ...updates, 
          updatedAt: new Date() 
        })
        .where(eq(users.id, userId))
        .returning();

      return updatedUser ? this.sanitizeUser(updatedUser) : null;
    } catch (error) {
      console.error('Update user error:', error);
      return null;
    }
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      // Get user with current password
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      
      const user = userResult[0];

      if (!user || !user.password) {
        return {
          success: false,
          error: 'User not found or password authentication not available'
        };
      }

      // Verify current password
      const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          error: 'Current password is incorrect'
        };
      }

      // Hash new password and update
      const hashedNewPassword = await this.hashPassword(newPassword);
      const [updatedUser] = await db
        .update(users)
        .set({ 
          password: hashedNewPassword,
          updatedAt: new Date() 
        })
        .where(eq(users.id, userId))
        .returning();

      return {
        success: true,
        user: this.sanitizeUser(updatedUser),
        message: 'Password changed successfully'
      };

    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: 'Failed to change password'
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();