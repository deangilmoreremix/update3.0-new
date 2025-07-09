import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from '../storage';

// Google OAuth Strategy
export const setupGoogleAuth = () => {
  // Only setup Google OAuth if credentials are provided
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
    return;
  }

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract user information from Google profile
      const googleUser = {
        id: profile.id,
        email: profile.emails?.[0]?.value || '',
        firstName: profile.name?.givenName || '',
        lastName: profile.name?.familyName || '',
        profileImage: profile.photos?.[0]?.value || '',
        provider: 'google',
        providerAccountId: profile.id
      };

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(googleUser.email);
      
      if (existingUser) {
        // Update existing user with Google info if needed
        const updatedUser = await storage.updateUser(existingUser.id, {
          profileImage: googleUser.profileImage || existingUser.profileImage,
          provider: 'google',
          providerAccountId: googleUser.providerAccountId
        });
        return done(null, updatedUser);
      } else {
        // Create new user
        const newUser = await storage.createUser({
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          profileImage: googleUser.profileImage,
          provider: 'google',
          providerAccountId: googleUser.providerAccountId,
          isActive: true,
          subscriptionPlan: 'free',
          role: 'user'
        });
        return done(null, newUser);
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));
};

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});