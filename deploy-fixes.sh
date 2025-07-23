#!/bin/bash
echo "🚀 Deploying fixes to Netlify..."

# Add the critical files we've fixed
echo "📁 Adding modified files..."
git add src/components/aiTools/SubjectLineContent.tsx
git add src/pages/Appointments.tsx  
git add src/pages/SalesTools.tsx
git add BUILD_STATUS.md
git add NETLIFY_FIX_COMPLETE.md
git add build.sh
git add clean-build.sh
git add run-build.sh
git add type-check.sh

# Check what's staged
echo "📋 Files staged for commit:"
git status --staged

# Commit with descriptive message
echo "💾 Committing changes..."
git commit -m "fix: Critical Netlify deployment build errors resolved

🔧 Fixed Files:
- SubjectLineContent.tsx: Fixed incomplete function call
- Appointments.tsx: Resolved duplicate Link imports  
- SalesTools.tsx: Resolved duplicate Link imports
- Added build scripts and documentation

✅ All syntax errors resolved - Ready for deployment!"

# Push to trigger Netlify rebuild
echo "🌐 Pushing to trigger Netlify deployment..."
git push origin main

echo "✅ Changes pushed! Netlify should start building automatically."
echo "🔗 Check your Netlify dashboard for build progress."
