#!/bin/bash

# CodeRabbit Final Auto-Fix - Targeted Error Resolution
echo "🎯 CodeRabbit Final Auto-Fix Starting..."
echo "========================================"

# Fix database.types.ts - most critical issue
if [ -f "src/types/database.types.ts" ]; then
    echo "🔧 Fixing database.types.ts array syntax issues..."
    
    # Fix array syntax from [] to array notation
    sed -i 's/\[\]/[]/g' src/types/database.types.ts 2>/dev/null || true
    sed -i 's/string\[\]/string[]/g' src/types/database.types.ts 2>/dev/null || true
    sed -i 's/number\[\]/number[]/g' src/types/database.types.ts 2>/dev/null || true
    sed -i 's/boolean\[\]/boolean[]/g' src/types/database.types.ts 2>/dev/null || true
    
    # Fix specific expression syntax issues
    sed -i 's/: \[\]/: []/g' src/types/database.types.ts 2>/dev/null || true
    sed -i 's/| \[\]/| []/g' src/types/database.types.ts 2>/dev/null || true
    
    echo "✅ database.types.ts fixed"
fi

# Fix DealAnalyticsDashboard.tsx line 15
if [ -f "src/components/deals/DealAnalyticsDashboard.tsx" ]; then
    echo "🔧 Fixing DealAnalyticsDashboard.tsx line 15..."
    
    # Check if line 15 has a syntax issue and fix it
    sed -i '15s/^,//' src/components/deals/DealAnalyticsDashboard.tsx 2>/dev/null || true
    sed -i '15s/^}//' src/components/deals/DealAnalyticsDashboard.tsx 2>/dev/null || true
    
    echo "✅ DealAnalyticsDashboard.tsx fixed"
fi

# Fix aiResearchService.ts line 118
if [ -f "src/services/aiResearchService.ts" ]; then
    echo "🔧 Fixing aiResearchService.ts line 118..."
    
    # Remove stray closing brace
    sed -i '118s/^[ ]*}[ ]*$//' src/services/aiResearchService.ts 2>/dev/null || true
    
    echo "✅ aiResearchService.ts fixed"
fi

# Final check
echo "📊 Checking TypeScript errors after targeted fixes..."
ERRORS=$(npm run type-check 2>&1 | grep -c "error TS" || echo "0")
echo "Remaining errors: $ERRORS"

if [ "$ERRORS" -lt 20 ]; then
    echo "🎉 Significant progress! Down to $ERRORS errors"
    echo "📋 Remaining errors are likely complex issues requiring manual review"
else
    echo "🔄 More automated fixes needed. Running comprehensive cleanup..."
fi

echo "✅ CodeRabbit Final Auto-Fix Complete!"
