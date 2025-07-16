import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

// Extend Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: unknown;
      userId?: string;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: unknown;
  userId: string;
}

// JWT Authentication middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid authentication token'
      });
    }

    // Verify token
    const decoded = authService.verifyToken(token);
    
    // Get full user data
    const user = await authService.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found',
        message: 'Invalid authentication token'
      });
    }

    // Check if account is active
    if (user.accountStatus !== 'active') {
      return res.status(403).json({ 
        error: 'Account suspended',
        message: 'Your account has been suspended or deactivated'
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      error: 'Invalid token',
      message: 'Authentication failed'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = authService.verifyToken(token);
      const user = await authService.getUserById(decoded.userId);
      
      if (user && user.accountStatus === 'active') {
        req.user = user;
        req.userId = user.id;
      }
    }
    
    next();
  } catch (error) {
    // Don't fail on optional auth, just continue without user
    next();
  }
};

// Admin role middleware
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    });
  }

  if (!req.user.isAdmin && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ 
      error: 'Admin access required',
      message: 'You need admin privileges to access this resource'
    });
  }

  next();
};

// Super admin role middleware
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    });
  }

  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ 
      error: 'Super admin access required',
      message: 'You need super admin privileges to access this resource'
    });
  }

  next();
};