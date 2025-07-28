#!/bin/bash

# Smart CRM - Quick Deploy to Netlify Script
# Run this script to prepare for deployment

echo "🚀 Smart CRM - Deployment Preparation"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

echo "📋 Step 1: Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "📊 Build Statistics:"
echo "==================="
ls -lh dist/

echo ""
echo "🔍 Step 2: Checking required files..."

# Check for required files
if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml found"
else
    echo "❌ netlify.toml missing"
fi

if [ -f "dist/index.html" ]; then
    echo "✅ Built files found in dist/"
else
    echo "❌ Build output missing"
fi

echo ""
echo "📝 Step 3: Environment Variables Needed"
echo "======================================="
echo "Before deploying, configure these in Netlify:"
echo ""
echo "REQUIRED:"
echo "  VITE_SUPABASE_URL=your_supabase_url"
echo "  VITE_SUPABASE_ANON_KEY=your_supabase_key"
echo "  VITE_OPENAI_API_KEY=your_openai_key"
echo ""
echo "OPTIONAL:"
echo "  VITE_GEMINI_API_KEY=your_gemini_key"
echo "  VITE_ELEVENLABS_API_KEY=your_elevenlabs_key"
echo "  VITE_COMPOSIO_API_KEY=your_composio_key"

echo ""
echo "🎯 Deployment Options:"
echo "====================="
echo ""
echo "Option A - Drag & Drop Deploy:"
echo "1. Go to https://app.netlify.com/drop"
echo "2. Drag the 'dist' folder to the deploy area"
echo "3. Configure environment variables in site settings"
echo ""
echo "Option B - Git Integration:"
echo "1. Push this code to GitHub"
echo "2. Connect repo to Netlify"
echo "3. Set build command: 'npm ci && npm run build'"
echo "4. Set publish directory: 'dist'"
echo "5. Configure environment variables"
echo ""

echo "✅ Your Smart CRM is ready to deploy!"
echo ""
echo "📚 Need help? Check:"
echo "  - DEPLOYMENT_CHECKLIST.md"
echo "  - SUPABASE_SETUP.md"
echo "  - netlify.toml (deployment config)"
