#!/bin/bash

# 🚀 Simple Smart CRM Enhancement Deployment
# Fixes "command too long" issues with streamlined approach

set -e

echo "🚀 Simple Smart CRM Enhancement Deployment"
echo "========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${BLUE}ℹ️  $1${NC}"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# Check git repo
if ! git status >/dev/null 2>&1; then
    echo "❌ Run this from your Smart CRM git repository"
    exit 1
fi

log "Creating backup..."
BACKUP="backup-$(date +%Y%m%d-%H%M%S)"
git checkout -b "$BACKUP" >/dev/null 2>&1
git checkout main >/dev/null 2>&1 || git checkout master >/dev/null 2>&1
success "Backup: $BACKUP"

log "Creating deployment branch..."
git checkout -b enhancement-deploy >/dev/null 2>&1 || git checkout enhancement-deploy >/dev/null 2>&1

log "Adding enhanced repository..."
git remote remove enhanced >/dev/null 2>&1 || true
git remote add enhanced https://github.com/deangilmoreremix/update3.0-new.git
git fetch enhanced >/dev/null 2>&1
success "Enhanced repository connected"

log "Downloading enhanced components..."
mkdir -p pages/

# Download files individually to avoid command length issues
curl -sSL -o pages/DashboardEnhanced.tsx https://raw.githubusercontent.com/deangilmoreremix/update3.0-new/main/pages/DashboardEnhanced.tsx
curl -sSL -o pages/PipelineEnhanced.tsx https://raw.githubusercontent.com/deangilmoreremix/update3.0-new/main/pages/PipelineEnhanced.tsx  
curl -sSL -o pages/ContactsEnhanced.tsx https://raw.githubusercontent.com/deangilmoreremix/update3.0-new/main/pages/ContactsEnhanced.tsx
success "Enhanced components downloaded"

log "Installing dependencies..."
if command -v npm >/dev/null 2>&1; then
    npm install react-beautiful-dnd >/dev/null 2>&1
    npm install zustand >/dev/null 2>&1
    npm install framer-motion >/dev/null 2>&1
    npm install recharts >/dev/null 2>&1
    npm install @types/react-beautiful-dnd --save-dev >/dev/null 2>&1
    success "Dependencies installed"
else
    warn "npm not found - install manually: react-beautiful-dnd zustand framer-motion recharts"
fi

# Create simple integration guide
cat > INTEGRATION_STEPS.md << 'EOF'
# 🔧 Integration Steps

## 1. Update App.tsx
Add these imports:
```typescript
import Dashboard from './pages/DashboardEnhanced';
import Pipeline from './pages/PipelineEnhanced';  
import Contacts from './pages/ContactsEnhanced';
```

## 2. Test Components
```bash
npm run dev
```

## 3. Replace Mock Data
- Update API calls in each component
- Replace mock data with your data sources

## 4. Commit and Deploy
```bash
git add .
git commit -m "feat: Add enhanced components"
git checkout main
git merge enhancement-deploy
```

## 🎉 Features Added
- AI insights dashboard
- Drag-drop pipeline
- Advanced contact management
- Modern responsive UI
EOF

log "Committing changes..."
git add . >/dev/null 2>&1
git commit -m "feat: Add enhanced CRM components" >/dev/null 2>&1 || warn "No changes to commit"

echo
success "🎉 Deployment completed!"
echo
echo "📋 Next Steps:"
echo "1. Read INTEGRATION_STEPS.md"
echo "2. Update App.tsx imports"
echo "3. Test with 'npm run dev'"
echo "4. Replace mock data with your APIs"
echo
echo "📁 Backup: $BACKUP"
echo "📁 Current: enhancement-deploy"
