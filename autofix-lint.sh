#!/bin/bash

# Automated lint fixes
echo "🔧 Running automated ESLint fixes..."

# 1. Auto-fix what ESLint can fix automatically
npx eslint . --fix --ext .ts,.tsx

# 2. Fix unused imports specifically
npx eslint . --fix --ext .ts,.tsx --rule "no-unused-vars: error"

# 3. Format code after fixes
echo "✨ Formatting code..."
npx prettier --write "src/**/*.{ts,tsx}"

echo "✅ Automated fixes complete!"
echo "Run: npm run lint to see remaining issues"