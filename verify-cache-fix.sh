#!/bin/bash

# 🔧 Cache Issue Verification Script

echo "🚀 Checking Cache Configuration Status..."
echo

# Check if cache headers are properly set in netlify.toml
echo "📋 1. Netlify Cache Headers:"
if grep -q "Cache-Control.*max-age=0.*must-revalidate" netlify.toml; then
    echo "   ✅ HTML cache headers: Configured (no cache)"
else
    echo "   ❌ HTML cache headers: Missing"
fi

if grep -q "Cache-Control.*max-age=31536000.*immutable" netlify.toml; then
    echo "   ✅ Asset cache headers: Configured (long cache)"
else
    echo "   ❌ Asset cache headers: Missing"
fi

echo

# Check if cache-clearing scripts exist
echo "📋 2. Package.json Cache Scripts:"
if grep -q "clean-cache" package.json; then
    echo "   ✅ clean-cache script: Available"
else
    echo "   ❌ clean-cache script: Missing"
fi

if grep -q "cache-bust" package.json; then
    echo "   ✅ cache-bust script: Available"
else
    echo "   ❌ cache-bust script: Missing"
fi

echo

# Check build output
echo "📋 3. Build Verification:"
if [ -d "dist" ]; then
    echo "   ✅ Build directory exists"
    if [ -f "dist/index.html" ]; then
        echo "   ✅ index.html generated"
    else
        echo "   ❌ index.html missing"
    fi
    
    asset_count=$(find dist/assets -name "*.js" -o -name "*.css" 2>/dev/null | wc -l)
    echo "   📊 Asset files: $asset_count found"
else
    echo "   ❌ Build directory missing - run 'npm run build'"
fi

echo

# Check for cache directories that should be cleaned
echo "📋 4. Cache Directory Status:"
if [ -d "node_modules/.vite" ]; then
    echo "   ⚠️  Vite cache exists (run 'npm run clean-cache' to clear)"
else
    echo "   ✅ Vite cache: Clean"
fi

if [ -d ".vite" ]; then
    echo "   ⚠️  Root .vite cache exists (should be cleaned)"
else
    echo "   ✅ Root .vite cache: Clean"
fi

echo

# Git status check
echo "📋 5. Git Status:"
git_status=$(git status --porcelain)
if [ -z "$git_status" ]; then
    echo "   ✅ Working tree clean - all changes committed"
else
    echo "   ⚠️  Uncommitted changes:"
    echo "$git_status" | sed 's/^/      /'
fi

echo

# Quick commands reference
echo "🔧 Quick Fix Commands:"
echo "   Clear caches:     npm run clean-cache"
echo "   Rebuild:          npm run rebuild"
echo "   Nuclear option:   npm run cache-bust"
echo "   Test locally:     npm run preview"
echo "   Hard browser refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)"

echo
echo "🌐 Testing Your Deployment:"
echo "   1. Open your Netlify site in incognito/private mode"
echo "   2. Check browser DevTools Network tab for cache status"
echo "   3. Verify HTML shows 'no-cache' and assets show 'immutable'"
echo "   4. Test navigation between pages"

echo
echo "✅ Cache configuration complete! Your deployment should now handle caching properly."
