#!/bin/bash

# 🚀 One-Command Smart CRM Enhancement Deployment
# Usage: curl -sSL https://raw.githubusercontent.com/deangilmoreremix/update3.0-new/main/quick-deploy.sh | bash

set -e

echo "🚀 Smart CRM Enhancement - Quick Deploy"
echo "======================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${BLUE}ℹ️  $1${NC}"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# Check if we're in a git repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "❌ This must be run from within your Smart CRM git repository"
    exit 1
fi

log "Creating backup branch..."
BACKUP_BRANCH="backup/pre-enhancement-$(date +%Y%m%d-%H%M%S)"
git checkout -b "$BACKUP_BRANCH" >/dev/null 2>&1
git checkout main >/dev/null 2>&1 || git checkout master >/dev/null 2>&1
success "Backup created: $BACKUP_BRANCH"

log "Setting up enhanced repository remote..."
git remote remove enhanced >/dev/null 2>&1 || true
git remote add enhanced https://github.com/deangilmoreremix/update3.0-new.git
git fetch enhanced >/dev/null 2>&1
success "Enhanced repository connected"

log "Creating deployment branch..."
git checkout -b enhancement/quick-deploy >/dev/null 2>&1 || git checkout enhancement/quick-deploy >/dev/null 2>&1

log "Copying enhanced components..."
mkdir -p pages/

# Download enhanced components directly
curl -sSL https://raw.githubusercontent.com/deangilmoreremix/update3.0-new/main/pages/DashboardEnhanced.tsx > pages/DashboardEnhanced.tsx
curl -sSL https://raw.githubusercontent.com/deangilmoreremix/update3.0-new/main/pages/PipelineEnhanced.tsx > pages/PipelineEnhanced.tsx  
curl -sSL https://raw.githubusercontent.com/deangilmoreremix/update3.0-new/main/pages/ContactsEnhanced.tsx > pages/ContactsEnhanced.tsx
success "Enhanced components downloaded"

log "Installing required dependencies..."
if command -v npm >/dev/null 2>&1; then
    npm install react-beautiful-dnd zustand framer-motion recharts >/dev/null 2>&1
    npm install @types/react-beautiful-dnd --save-dev >/dev/null 2>&1
    success "Dependencies installed"
else
    warn "npm not found - please manually install: react-beautiful-dnd zustand framer-motion recharts"
fi

# Create integration guide
cat > QUICK_INTEGRATION_GUIDE.md << 'EOF'
# 🔧 Quick Integration Guide

## ✅ What Was Deployed
- ✅ DashboardEnhanced.tsx - AI-powered dashboard
- ✅ PipelineEnhanced.tsx - Drag-drop pipeline  
- ✅ ContactsEnhanced.tsx - Advanced contact management
- ✅ Required dependencies installed

## 🎯 Next Steps (Required)

### 1. Update App.tsx
Add these imports to your App.tsx:
```typescript
import Dashboard from './pages/DashboardEnhanced';
import Pipeline from './pages/PipelineEnhanced';  
import Contacts from './pages/ContactsEnhanced';
```

### 2. Test the Components
```bash
npm run dev
```
Navigate to /dashboard, /pipeline, /contacts to test.

### 3. Replace Mock Data
The components use mock data. Replace with your API calls:
- Update deal fetching in PipelineEnhanced.tsx
- Update contact fetching in ContactsEnhanced.tsx
- Update metrics in DashboardEnhanced.tsx

### 4. Commit Changes
```bash
git add .
git commit -m "feat: Add enhanced CRM components"
git checkout main
git merge enhancement/quick-deploy
```

## 🎉 Features Added
- 🧠 AI insights and recommendations
- 🎨 Modern responsive UI with Tailwind CSS
- 📊 Real-time analytics and metrics
- 🔄 Drag-and-drop pipeline management
- 🔍 Advanced search and filtering
- 📱 Mobile-responsive design

## 🆘 Rollback if Needed
```bash
git checkout [BACKUP_BRANCH_NAME]
```
EOF

log "Committing changes..."
git add .
git commit -m "feat: Quick deploy enhanced CRM components

- Added DashboardEnhanced.tsx with AI insights
- Added PipelineEnhanced.tsx with drag-drop functionality
- Added ContactsEnhanced.tsx with advanced features
- Installed required dependencies
- Created integration guide

Manual steps required: Update App.tsx imports and replace mock data" >/dev/null 2>&1

echo
success "🎉 Enhanced components deployed successfully!"
echo
echo "📋 Next Steps:"
echo "1. Update App.tsx imports (see QUICK_INTEGRATION_GUIDE.md)"
echo "2. Run 'npm run dev' to test"
echo "3. Replace mock data with your API calls"
echo "4. Merge to main when ready"
echo
echo "📁 Backup branch: $BACKUP_BRANCH"
echo "📁 Current branch: enhancement/quick-deploy"
echo
echo "📖 See QUICK_INTEGRATION_GUIDE.md for detailed next steps"
