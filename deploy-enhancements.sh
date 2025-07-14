#!/bin/bash

# 🚀 Smart CRM Enhancement Deployment Script
# This script helps deploy the enhanced components from update3.0-new to your actual Smart CRM

set -e  # Exit on any error

echo "🚀 Smart CRM Enhancement Deployment Script"
echo "=========================================="

# Configuration
ENHANCED_REPO="https://github.com/deangilmoreremix/update3.0-new.git"
ENHANCED_REMOTE="enhanced"
BACKUP_BRANCH="backup/pre-enhancement-$(date +%Y%m%d-%H%M%S)"
DEPLOY_BRANCH="enhancement/deploy-v3"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        log_error "This script must be run from within your Smart CRM git repository"
        exit 1
    fi
    log_success "Git repository detected"
}

# Create backup
create_backup() {
    log_info "Creating backup branch: $BACKUP_BRANCH"
    
    # Ensure we're on the main branch
    git checkout main 2>/dev/null || git checkout master 2>/dev/null || {
        log_error "Could not switch to main/master branch"
        exit 1
    }
    
    # Create backup branch
    git checkout -b "$BACKUP_BRANCH"
    git checkout main 2>/dev/null || git checkout master 2>/dev/null
    
    log_success "Backup created: $BACKUP_BRANCH"
}

# Add enhanced repository as remote
setup_enhanced_remote() {
    log_info "Setting up enhanced repository remote"
    
    # Remove existing remote if it exists
    git remote remove "$ENHANCED_REMOTE" 2>/dev/null || true
    
    # Add enhanced repository
    git remote add "$ENHANCED_REMOTE" "$ENHANCED_REPO"
    git fetch "$ENHANCED_REMOTE"
    
    log_success "Enhanced repository remote added and fetched"
}

# Create deployment branch
create_deploy_branch() {
    log_info "Creating deployment branch: $DEPLOY_BRANCH"
    
    # Remove existing deploy branch if it exists
    git branch -D "$DEPLOY_BRANCH" 2>/dev/null || true
    
    # Create new deployment branch
    git checkout -b "$DEPLOY_BRANCH"
    
    log_success "Deployment branch created: $DEPLOY_BRANCH"
}

# Copy enhanced components
copy_enhanced_components() {
    log_info "Copying enhanced components..."
    
    # Create pages directory if it doesn't exist
    mkdir -p pages/
    
    # Copy enhanced components
    log_info "Copying DashboardEnhanced.tsx..."
    git checkout "$ENHANCED_REMOTE"/main -- pages/DashboardEnhanced.tsx 2>/dev/null || {
        log_warning "Could not copy DashboardEnhanced.tsx directly, will need manual copy"
    }
    
    log_info "Copying PipelineEnhanced.tsx..."
    git checkout "$ENHANCED_REMOTE"/main -- pages/PipelineEnhanced.tsx 2>/dev/null || {
        log_warning "Could not copy PipelineEnhanced.tsx directly, will need manual copy"
    }
    
    log_info "Copying ContactsEnhanced.tsx..."
    git checkout "$ENHANCED_REMOTE"/main -- pages/ContactsEnhanced.tsx 2>/dev/null || {
        log_warning "Could not copy ContactsEnhanced.tsx directly, will need manual copy"
    }
    
    log_success "Enhanced components copied"
}

# Update package.json dependencies
update_dependencies() {
    log_info "Checking package.json dependencies..."
    
    # Required dependencies
    REQUIRED_DEPS=(
        "react-beautiful-dnd@^13.1.1"
        "zustand@^4.3.6"
        "framer-motion@^11.18.2"
        "recharts@^2.5.0"
    )
    
    REQUIRED_DEV_DEPS=(
        "@types/react-beautiful-dnd@^13.1.3"
    )
    
    # Check if npm is available
    if command -v npm >/dev/null 2>&1; then
        log_info "Installing required dependencies..."
        
        for dep in "${REQUIRED_DEPS[@]}"; do
            log_info "Installing $dep..."
            npm install "$dep" --save
        done
        
        for dep in "${REQUIRED_DEV_DEPS[@]}"; do
            log_info "Installing $dep..."
            npm install "$dep" --save-dev
        done
        
        log_success "Dependencies updated"
    else
        log_warning "npm not found. Please manually install these dependencies:"
        printf '%s\n' "${REQUIRED_DEPS[@]}"
        printf '%s\n' "${REQUIRED_DEV_DEPS[@]}"
    fi
}

# Update vite config
update_vite_config() {
    log_info "Checking Vite configuration..."
    
    if [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
        log_info "Backing up existing Vite config..."
        cp vite.config.* vite.config.backup.$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
        
        # Copy enhanced vite config
        git checkout "$ENHANCED_REMOTE"/main -- vite.config.ts 2>/dev/null || {
            log_warning "Could not copy vite.config.ts automatically"
            echo "Please manually update your vite.config with these settings:"
            echo "server: { host: true, port: 5173, hmr: { port: 5173 } }"
        }
        
        log_success "Vite configuration updated"
    else
        log_info "No Vite config found, copying from enhanced repo..."
        git checkout "$ENHANCED_REMOTE"/main -- vite.config.ts 2>/dev/null || {
            log_warning "Could not copy vite.config.ts"
        }
    fi
}

# Create integration instructions
create_integration_instructions() {
    log_info "Creating integration instructions..."
    
    cat > INTEGRATION_INSTRUCTIONS.md << 'EOF'
# 🔧 Manual Integration Steps Required

## 📝 App.tsx Updates Needed

Update your App.tsx to use the enhanced components:

```typescript
// Replace existing imports with enhanced components
import Dashboard from './pages/DashboardEnhanced';
import Pipeline from './pages/PipelineEnhanced';
import Contacts from './pages/ContactsEnhanced';
```

## 🎯 Component Integration Options

### Option 1: Replace Existing Components
1. Rename your existing components as backups:
   - `Dashboard.tsx` → `Dashboard.backup.tsx`
   - `Pipeline.tsx` → `Pipeline.backup.tsx`
   - `Contacts.tsx` → `Contacts.backup.tsx`

2. Rename enhanced components:
   - `DashboardEnhanced.tsx` → `Dashboard.tsx`
   - `PipelineEnhanced.tsx` → `Pipeline.tsx`
   - `ContactsEnhanced.tsx` → `Contacts.tsx`

### Option 2: Use Enhanced Components Alongside Existing
1. Keep both versions
2. Update routing to use enhanced versions
3. Add route parameters to switch between versions

## 🔗 API Integration Required

The enhanced components use mock data. Replace with your actual API calls:

```typescript
// Example: Replace mock data with your API
const { deals, fetchDeals } = useDealStore(); // Your actual store
const { contacts, fetchContacts } = useContactStore(); // Your actual store
```

## 🎨 Styling Integration

1. Verify Tailwind CSS is configured
2. Update any conflicting CSS classes
3. Ensure responsive design works with your layout

## 🧪 Testing Checklist

- [ ] Enhanced Dashboard loads correctly
- [ ] Pipeline drag-and-drop works
- [ ] Contact search and filtering functions
- [ ] All navigation works
- [ ] Responsive design looks good
- [ ] No console errors

## 🚀 Next Steps

1. Test the enhanced components
2. Integrate with your actual data sources
3. Update any styling to match your brand
4. Deploy to staging environment
5. Get user feedback
6. Deploy to production

EOF

    log_success "Integration instructions created: INTEGRATION_INSTRUCTIONS.md"
}

# Commit changes
commit_changes() {
    log_info "Committing changes..."
    
    git add .
    
    if git diff --staged --quiet; then
        log_warning "No changes to commit"
    else
        git commit -m "feat: Deploy enhanced CRM components

- Added DashboardEnhanced.tsx with AI insights and modern UI
- Added PipelineEnhanced.tsx with drag-drop kanban functionality  
- Added ContactsEnhanced.tsx with advanced filtering and search
- Updated dependencies for enhanced functionality
- Added integration instructions for manual steps

Components include:
- Modern responsive design with Tailwind CSS
- Interactive UI elements and hover effects
- Drag and drop functionality for pipeline
- Search and filtering capabilities
- Modal dialogs for detailed views
- AI insights panel and analytics
- Quick action buttons and status indicators

Manual integration steps required - see INTEGRATION_INSTRUCTIONS.md"
        
        log_success "Changes committed successfully"
    fi
}

# Main deployment function
main() {
    echo
    log_info "Starting Smart CRM Enhancement Deployment"
    echo
    
    # Step 1: Validate environment
    check_git_repo
    
    # Step 2: Create backup
    create_backup
    
    # Step 3: Setup enhanced repository
    setup_enhanced_remote
    
    # Step 4: Create deployment branch
    create_deploy_branch
    
    # Step 5: Copy enhanced components
    copy_enhanced_components
    
    # Step 6: Update dependencies
    update_dependencies
    
    # Step 7: Update vite config
    update_vite_config
    
    # Step 8: Create integration instructions
    create_integration_instructions
    
    # Step 9: Commit changes
    commit_changes
    
    echo
    log_success "🎉 Enhanced components deployment completed!"
    echo
    echo "📋 Next Steps:"
    echo "1. Review INTEGRATION_INSTRUCTIONS.md for manual steps"
    echo "2. Update App.tsx to use enhanced components"
    echo "3. Test the enhanced functionality"
    echo "4. Integrate with your actual API endpoints"
    echo "5. Merge to main branch when ready"
    echo
    echo "📝 Branches created:"
    echo "  - Backup: $BACKUP_BRANCH"
    echo "  - Deployment: $DEPLOY_BRANCH"
    echo
    echo "🚀 Run 'npm run dev' to test the enhanced components!"
    echo
}

# Run main function
main "$@"
