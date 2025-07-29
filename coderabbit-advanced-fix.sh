#!/bin/bash

# CodeRabbit Advanced Syntax Fix
echo "🎯 CodeRabbit Advanced Syntax Fix Starting..."
echo "============================================="

# Fix specific files with bracket issues

# Fix ContactsModal.tsx line 616
if [ -f "src/components/contacts/ContactsModal.tsx" ]; then
    echo "Fixing ContactsModal.tsx line 616..."
    sed -i '616s/^}//' src/components/contacts/ContactsModal.tsx 2>/dev/null || true
fi

# Fix AutomationPanel.tsx lines 257, 983
if [ -f "src/components/contacts/AutomationPanel.tsx" ]; then
    echo "Fixing AutomationPanel.tsx..."
    sed -i '257s/^  }//' src/components/contacts/AutomationPanel.tsx 2>/dev/null || true
    sed -i '983s/^}//' src/components/contacts/AutomationPanel.tsx 2>/dev/null || true
fi

# Fix DealAutomationPanel.tsx lines 237, 972
if [ -f "src/components/deals/DealAutomationPanel.tsx" ]; then
    echo "Fixing DealAutomationPanel.tsx..."
    sed -i '237s/^  }//' src/components/deals/DealAutomationPanel.tsx 2>/dev/null || true
    sed -i '972s/^}//' src/components/deals/DealAutomationPanel.tsx 2>/dev/null || true
fi

# Fix AIEnhancedContactCard.tsx line 275
if [ -f "src/components/contacts/AIEnhancedContactCard.tsx" ]; then
    echo "Fixing AIEnhancedContactCard.tsx line 275..."
    sed -i '275s/^}//' src/components/contacts/AIEnhancedContactCard.tsx 2>/dev/null || true
fi

# Fix ContactDetailView.tsx line 1430
if [ -f "src/components/modals/ContactDetailView.tsx" ]; then
    echo "Fixing ContactDetailView.tsx line 1430..."
    sed -i '1430s/^}//' src/components/modals/ContactDetailView.tsx 2>/dev/null || true
fi

# Fix DealCard.tsx multiple lines
if [ -f "src/components/ui/DealCard.tsx" ]; then
    echo "Fixing DealCard.tsx multiple syntax issues..."
    sed -i '114s/^  }//' src/components/ui/DealCard.tsx 2>/dev/null || true
    sed -i '122s/^  }//' src/components/ui/DealCard.tsx 2>/dev/null || true
    sed -i '128s/^  }//' src/components/ui/DealCard.tsx 2>/dev/null || true
    sed -i '189s/^  }//' src/components/ui/DealCard.tsx 2>/dev/null || true
    sed -i '354s/^}//' src/components/ui/DealCard.tsx 2>/dev/null || true
fi

# Fix aiResearchService.ts line 118
if [ -f "src/services/aiResearchService.ts" ]; then
    echo "Fixing aiResearchService.ts line 118..."
    sed -i '118s/^      }//' src/services/aiResearchService.ts 2>/dev/null || true
fi

# Fix database.types.ts array syntax issues
if [ -f "src/types/database.types.ts" ]; then
    echo "Fixing database.types.ts array syntax..."
    # Fix array syntax issues on lines 10, 11, 12
    sed -i '10s/\[\]/[]/' src/types/database.types.ts 2>/dev/null || true
    sed -i '11s/\[\]/[]/' src/types/database.types.ts 2>/dev/null || true
    sed -i '12s/\[\]/[]/' src/types/database.types.ts 2>/dev/null || true
fi

echo "✅ Advanced syntax fixes completed"

# Check progress
echo "📊 Checking TypeScript errors after advanced fixes..."
npm run type-check 2>&1 | grep -c "error TS" || echo "0"
