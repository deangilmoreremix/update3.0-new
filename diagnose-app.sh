#!/bin/bash

echo "🔍 App Diagnostic Tool"
echo "====================="

echo "1. Checking if dev server is running..."
curl -s http://localhost:5174 > /dev/null && echo "✅ Server is responding" || echo "❌ Server not responding"

echo ""
echo "2. Checking for TypeScript errors..."
npm run type-check 2>/dev/null | grep -c "error TS" | awk '{if($1>0) print "⚠️  "$1" TypeScript errors found"; else print "✅ No TypeScript errors"}'

echo ""
echo "3. Checking for build errors..."
npm run build >/dev/null 2>&1 && echo "✅ Build successful" || echo "❌ Build failed"

echo ""
echo "4. Checking key files..."
[ -f "src/main.tsx" ] && echo "✅ main.tsx exists" || echo "❌ main.tsx missing"
[ -f "src/App.tsx" ] && echo "✅ App.tsx exists" || echo "❌ App.tsx missing"
[ -f "index.html" ] && echo "✅ index.html exists" || echo "❌ index.html missing"
[ -f "package.json" ] && echo "✅ package.json exists" || echo "❌ package.json missing"

echo ""
echo "5. Checking dependencies..."
npm list react react-dom --depth=0 2>/dev/null | grep -E "(react@|react-dom@)" || echo "⚠️  React dependencies check failed"

echo ""
echo "🔧 If the app is still blank, check browser console for errors."
