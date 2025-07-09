# Google OAuth Setup Guide

## Overview
This guide explains how to set up Google OAuth authentication for your Smart CRM application.

## Prerequisites
- Access to Google Cloud Console
- Admin access to your Smart CRM deployment

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "Smart CRM OAuth")
4. Click "Create"

### 1.2 Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" for user type
   - Fill in application name: "Smart CRM"
   - Add your email as developer contact
   - Save and continue through the steps
4. Select "Web application" as application type
5. Add authorized redirect URIs:
   - **Development**: `http://localhost:5000/auth/google/callback`
   - **Production**: `https://yourdomain.com/auth/google/callback`
   - **Replit**: `https://your-replit-app.replit.app/auth/google/callback`

### 1.4 Get Your Credentials
1. After creating the OAuth client, you'll see your:
   - **Client ID**: Starts with numbers and ends with `.apps.googleusercontent.com`
   - **Client Secret**: A random string

## Step 2: Configure Environment Variables

### 2.1 Add to .env file
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2.2 For Replit Deployment
1. Go to your Replit → "Secrets" tab
2. Add these secrets:
   - Key: `GOOGLE_CLIENT_ID`, Value: your client ID
   - Key: `GOOGLE_CLIENT_SECRET`, Value: your client secret

## Step 3: Testing the Integration

### 3.1 Development Testing
1. Start your development server: `npm run dev`
2. Go to `http://localhost:5000/login`
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected back to your app's dashboard

### 3.2 Production Testing
1. Deploy your app with the environment variables configured
2. Test the same flow on your production domain

## Step 4: OAuth Consent Screen Configuration

### 4.1 Required Information
- **App name**: Smart CRM
- **User support email**: Your email
- **Developer contact information**: Your email
- **App domain**: Your domain (optional)
- **Privacy policy**: Link to your privacy policy (optional)
- **Terms of service**: Link to your terms (optional)

### 4.2 Scopes
The app requests these scopes:
- `profile`: Access to user's basic profile information
- `email`: Access to user's email address

## Step 5: Production Considerations

### 5.1 Domain Verification
For production apps, you may need to:
1. Verify your domain in Google Search Console
2. Add your domain to the OAuth consent screen

### 5.2 App Review
If your app will be used by users outside your organization:
1. Complete the OAuth consent screen with all required information
2. Submit for Google's app review process
3. This can take several days to weeks

### 5.3 Security Best Practices
- Store client secrets securely
- Use HTTPS in production
- Regularly rotate client secrets
- Monitor OAuth usage in Google Cloud Console

## Troubleshooting

### Common Issues

1. **"OAuth2Strategy requires a clientID option"**
   - Solution: Ensure GOOGLE_CLIENT_ID is set in environment variables

2. **"redirect_uri_mismatch"**
   - Solution: Verify the redirect URI in Google Cloud Console matches exactly

3. **"access_denied"**
   - Solution: Check OAuth consent screen configuration

4. **"invalid_client"**
   - Solution: Verify client ID and secret are correct

### Debug Steps
1. Check server logs for OAuth errors
2. Verify environment variables are loaded
3. Test with a simple redirect URI first
4. Check Google Cloud Console for API quotas

## Current Implementation Status

✅ **Completed:**
- Google OAuth strategy implementation
- User authentication and profile sync
- Session management
- OAuth routes and callbacks
- SignIn page integration

🔄 **Ready for Configuration:**
- Environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
- Google Cloud Console setup
- Domain verification for production

## Support
If you encounter issues:
1. Check the server logs for detailed error messages
2. Verify all environment variables are correctly set
3. Ensure your Google Cloud project has the necessary APIs enabled
4. Test with a simple redirect URI first before adding production domains