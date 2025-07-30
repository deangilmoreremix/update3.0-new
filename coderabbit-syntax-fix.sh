#!/bin/bash

echo "🎯 CodeRabbit Syntax Fix Starting..."
echo "===================================="

# Fix double question marks (??.) which is invalid syntax
echo "🔧 Fixing double question mark operators..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|??\.|\?.|g'

# Fix any remaining ??. patterns
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|??\.|?.|g'

echo "📊 Running build test after syntax fixes..."
npm run build > /dev/null 2>&1 && echo "✅ Build successful!" || echo "❌ Build failed, checking errors..."

echo "✅ CodeRabbit Syntax Fix Complete!"
