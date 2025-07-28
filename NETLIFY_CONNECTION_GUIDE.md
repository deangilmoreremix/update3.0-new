# Netlify Connection Guide for smart-crm.videoremix.io

## 🔗 Connect Repository to Netlify

### Step 1: Access Netlify Dashboard
1. Go to https://app.netlify.com
2. Find your site: `smart-crm.videoremix.io`
3. Click on the site name

### Step 2: Configure Git Integration
**Site Settings → Build & Deploy → Continuous Deployment**

**Repository Configuration:**
```
Repository: https://github.com/deangilmoreremix/update3.0-new
Branch: main
```

**Build Settings:**
```
Build Command: npm ci && npm run build
Publish Directory: dist
Node Version: 22
```

### Step 3: Environment Variables
**Site Settings → Environment Variables**

Add these required variables:
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

Optional variables:
```bash
VITE_GEMINI_API_KEY=your_gemini_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
VITE_COMPOSIO_API_KEY=your_composio_key
```

### Step 4: Deploy
Once connected, Netlify will automatically:
1. Pull from the `main` branch
2. Run `npm ci && npm run build`
3. Deploy the `dist` folder
4. Your site will be live at https://smart-crm.videoremix.io

## 🚀 Current Status
- ✅ Code is ready on `main` branch
- ✅ Build errors fixed ("Cannot access 'ce' before initialization")
- ✅ Kimi AI features removed (cleaner codebase)
- ✅ Deployment documentation added
- ✅ Build system working perfectly

## 📱 What Will Be Deployed
Your Smart CRM with:
- Landing page
- Dashboard with analytics
- Contact management
- AI Tools (if API keys configured)
- Task management
- Appointment scheduling
- Settings and preferences
- Responsive design (mobile-friendly)
- Dark/light theme toggle

## 🔄 Future Updates
After initial setup, any push to `main` branch will automatically deploy to your site.
