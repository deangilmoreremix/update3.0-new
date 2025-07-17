#!/bin/bash

echo "🧹 Smart CRM ESLint Auto-Fix Script"
echo "==================================="
echo ""

# Count initial problems
echo "📊 Counting initial problems..."
initial_count=$(npm run lint 2>&1 | grep -o '[0-9]* problems' | head -1 | grep -o '[0-9]*' || echo "0")
echo "   Initial problems: $initial_count"
echo ""

# Run ESLint auto-fix
echo "🔧 Running ESLint auto-fix..."
npm run lint -- --fix --quiet

# Count remaining problems
echo ""
echo "📊 Counting remaining problems..."
remaining_count=$(npm run lint 2>&1 | grep -o '[0-9]* problems' | head -1 | grep -o '[0-9]*' || echo "0")
echo "   Remaining problems: $remaining_count"

if [ "$initial_count" -gt 0 ] && [ "$remaining_count" -lt "$initial_count" ]; then
    fixed_count=$((initial_count - remaining_count))
    echo "   ✅ Fixed: $fixed_count problems"
else
    echo "   ⚠️  No auto-fixable problems found"
fi

echo ""
echo "🎯 Most Common Remaining Issues:"
echo "   1. Unused imports/variables (manual removal needed)"
echo "   2. TypeScript 'any' types (proper typing needed)"
echo "   3. React Hooks dependency arrays (manual review needed)"
echo ""

# Show summary of remaining errors by type
echo "📋 Error Summary (Top 10 most common):"
npm run lint 2>&1 | grep -o '@typescript-eslint/[^[:space:]]*' | sort | uniq -c | sort -nr | head -10 | sed 's/^/   /'

echo ""
echo "💡 Next Steps:"
echo "   1. Remove unused imports manually"
echo "   2. Replace 'any' types with proper TypeScript types"
echo "   3. Fix React Hooks dependency arrays"
echo "   4. Remove unused variables and functions"
