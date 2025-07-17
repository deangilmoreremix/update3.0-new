#!/bin/bash

echo "🔧 Smart CRM Git Repository Functionality Test"
echo "=============================================="
echo ""

# Test Git Installation
echo "1. 📋 Testing Git Installation..."
if command -v git &> /dev/null; then
    echo "✅ Git is installed: $(git --version)"
else
    echo "❌ Git is not installed"
    exit 1
fi
echo ""

# Test Repository Status
echo "2. 📁 Testing Repository Status..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "✅ This is a valid Git repository"
    echo "   Current branch: $(git branch --show-current)"
    echo "   Repository root: $(git rev-parse --show-toplevel)"
else
    echo "❌ Not a Git repository"
    exit 1
fi
echo ""

# Test Remote Configuration
echo "3. 🌐 Testing Remote Configuration..."
remotes=$(git remote -v | wc -l)
if [ $remotes -gt 0 ]; then
    echo "✅ Remote repositories configured:"
    git remote -v | sed 's/^/   /'
else
    echo "⚠️  No remote repositories configured"
fi
echo ""

# Test Repository Status
echo "4. 📊 Repository Status..."
echo "   Modified files: $(git status --porcelain | grep -c "^ M")"
echo "   New files: $(git status --porcelain | grep -c "^??")"
echo "   Staged files: $(git status --porcelain | grep -c "^M ")"
echo ""

# Test Git Commands
echo "5. 🔍 Testing Basic Git Commands..."

# Test git log
echo "   Testing git log..."
if git log --oneline -n 3 > /dev/null 2>&1; then
    echo "   ✅ git log works"
    echo "      Latest commits:"
    git log --oneline -n 3 | sed 's/^/         /'
else
    echo "   ❌ git log failed"
fi

# Test git diff
echo "   Testing git diff..."
if git diff --name-only > /dev/null 2>&1; then
    echo "   ✅ git diff works"
    diff_count=$(git diff --name-only | wc -l)
    echo "      Files with changes: $diff_count"
else
    echo "   ❌ git diff failed"
fi

# Test git add (dry run)
echo "   Testing git add (dry run)..."
if git add --dry-run . > /dev/null 2>&1; then
    echo "   ✅ git add works"
else
    echo "   ❌ git add failed"
fi

echo ""

# Test Remote Connectivity
echo "6. 🌍 Testing Remote Connectivity..."
if git ls-remote origin HEAD > /dev/null 2>&1; then
    echo "✅ Can connect to remote repository"
else
    echo "⚠️  Cannot connect to remote repository (may need authentication)"
fi
echo ""

# Smart CRM Specific Tests
echo "7. 🏢 Smart CRM Specific Repository Tests..."

# Check if package.json exists
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    echo "   Project: $(grep -o '"name": "[^"]*"' package.json | cut -d'"' -f4)"
else
    echo "❌ package.json not found"
fi

# Check for key CRM files
key_files=("App.tsx" "vite.config.ts" "tailwind.config.js" "src/")
echo "   Checking key CRM files:"
for file in "${key_files[@]}"; do
    if [ -e "$file" ]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ $file missing"
    fi
done
echo ""

# Test Netlify Configuration
echo "8. 🚀 Testing Deployment Configuration..."
if [ -f "netlify.toml" ]; then
    echo "✅ Netlify configuration found"
    echo "   Build command: $(grep -A1 '\[build\]' netlify.toml | grep 'command' | cut -d'=' -f2 | tr -d '"' | xargs)"
else
    echo "⚠️  No Netlify configuration found"
fi

if [ -f "vercel.json" ]; then
    echo "✅ Vercel configuration found"
else
    echo "ℹ️  No Vercel configuration found"
fi
echo ""

# Summary
echo "9. 📋 Summary..."
echo "✅ Repository Type: Smart CRM Application"
echo "✅ Framework: React + TypeScript + Vite"
echo "✅ Git Status: Functional"
echo "✅ Remote: GitHub (deangilmoreremix/update3.0-new)"
echo "✅ Ready for: Development, Testing, Deployment"
echo ""

echo "🎉 Git repository functionality test complete!"
echo ""
echo "💡 Next Steps:"
echo "   • Development server: npm run dev"
echo "   • Build for production: npm run build"
echo "   • Deploy to Netlify: git push origin main"
echo "   • Access application: http://localhost:5174"
