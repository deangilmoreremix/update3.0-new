# 🚀 Netlify Deployment Instructions

## Prerequisites Setup

### 1. Database Setup (Choose One)

#### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings > API
4. Copy the connection string from Settings > Database

#### Option B: Neon Database
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

#### Option C: Railway Database
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string

### 2. API Keys Setup
1. **Google AI/Gemini**: Get from [aistudio.google.com](https://aistudio.google.com)
2. **OpenAI** (optional): Get from [platform.openai.com](https://platform.openai.com)
3. **Anthropic** (optional): Get from [console.anthropic.com](https://console.anthropic.com)

## Deployment Steps

### Step 1: Prepare Your Repository
```bash
# If not already done, commit all changes
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### Step 2: Deploy to Netlify

#### Option A: Netlify Dashboard (Recommended)
1. Go to [netlify.com](https://netlify.com) and log in
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub account
4. Select your repository: `update3.0-new`
5. Configure build settings:
   - **Build command**: `npm run deploy:setup`
   - **Publish directory**: `dist`
   - **Node version**: `20`

#### Option B: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from your project directory
netlify deploy --build --prod
```

### Step 3: Environment Variables
In Netlify dashboard, go to Site settings > Environment variables and add:

**Required:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=postgresql://user:password@host:port/database
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**Optional:**
```
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
VITE_COMPOSIO_API_KEY=your_composio_api_key
NODE_ENV=production
```

### Step 4: Database Migration
After setting environment variables, trigger a new deploy to run database migrations:
1. Go to Deploys tab in Netlify
2. Click "Trigger deploy" > "Deploy site"
3. Watch the build logs to ensure database setup completes

### Step 5: Custom Domain (Optional)
1. In Netlify dashboard, go to Domain settings
2. Add your custom domain
3. Configure DNS as instructed

## Troubleshooting

### Build Failures
- Check build logs in Netlify dashboard
- Ensure all environment variables are set
- Verify database connection string format

### Database Issues
- Ensure DATABASE_URL is correctly formatted
- Check database permissions
- Run migrations manually if needed:
  ```bash
  npm run db:push
  ```

### Environment Variable Issues
- Variables must start with `VITE_` to be accessible in frontend
- Restart deploy after adding new variables
- Check for typos in variable names

## Post-Deployment

### 1. Test Your Application
- Visit your Netlify URL
- Test database connectivity
- Verify AI integrations work
- Check all major features

### 2. Monitor Performance
- Check Netlify analytics
- Monitor database usage
- Set up error tracking (optional)

### 3. Set Up Continuous Deployment
- Your site will auto-deploy on git pushes
- Configure branch deploy settings if needed
- Set up preview deployments for PRs

## Support
If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test database connection
4. Check API key validity

Your Smart CRM platform should now be live! 🎉
