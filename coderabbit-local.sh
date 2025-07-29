#!/bin/bash

# CodeRabbit Local Development Integration
# This script provides real-time code quality feedback during development

echo "🤖 Starting CodeRabbit Local Integration..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display CodeRabbit-style suggestions
show_suggestions() {
    echo -e "${BLUE}🔍 CodeRabbit Suggestions:${NC}"
    echo "  📝 Run 'npm run type-check' to see TypeScript issues"
    echo "  🧹 Run 'npm run lint:fix' to auto-fix ESLint issues"
    echo "  🏗️  Run 'npm run build' to check build status"
    echo "  🧪 Run 'npm test' to verify tests"
    echo ""
}

# Function to run quick quality checks
run_quick_check() {
    echo -e "${YELLOW}⚡ Running Quick Quality Check...${NC}"
    
    # TypeScript check
    echo "🔍 Checking TypeScript..."
    TS_ERRORS=$(npm run type-check 2>&1 | grep -c "error TS" || echo "0")
    if [ "$TS_ERRORS" -eq 0 ]; then
        echo -e "  ✅ TypeScript: ${GREEN}No errors${NC}"
    else
        echo -e "  ❌ TypeScript: ${RED}$TS_ERRORS errors found${NC}"
    fi
    
    # ESLint check
    echo "🧹 Checking ESLint..."
    ESLINT_OUTPUT=$(npm run lint 2>&1 || true)
    ESLINT_ERRORS=$(echo "$ESLINT_OUTPUT" | grep -c "error" || echo "0")
    if [ "$ESLINT_ERRORS" -eq 0 ]; then
        echo -e "  ✅ ESLint: ${GREEN}No errors${NC}"
    else
        echo -e "  ❌ ESLint: ${RED}$ESLINT_ERRORS errors found${NC}"
    fi
    
    # Build check
    echo "🏗️  Checking build..."
    if npm run build >/dev/null 2>&1; then
        echo -e "  ✅ Build: ${GREEN}Success${NC}"
    else
        echo -e "  ❌ Build: ${RED}Failed${NC}"
    fi
    
    echo ""
}

# Function to watch for file changes and provide suggestions
watch_files() {
    echo -e "${BLUE}👀 Watching for file changes...${NC}"
    echo "  - TypeScript/JavaScript files in src/"
    echo "  - Press Ctrl+C to stop"
    echo ""
    
    # Use fswatch if available, otherwise fall back to a simple loop
    if command -v fswatch >/dev/null 2>&1; then
        fswatch -o src/ | while read f; do
            echo -e "${YELLOW}📝 Files changed, running quick check...${NC}"
            run_quick_check
        done
    else
        echo "📝 Install 'fswatch' for automatic file watching: brew install fswatch (macOS) or apt-get install inotify-tools (Linux)"
        echo "For now, run 'npm run coderabbit:check' manually after changes"
    fi
}

# Function to display development ports and CodeRabbit info
show_ports_and_info() {
    echo -e "${GREEN}🚀 Development Environment Ready!${NC}"
    echo "=========================================="
    echo "📱 Local Development:"
    echo "  🌐 App URL: http://localhost:5174"
    echo "  📊 Dev Server: Running on port 5174"
    echo ""
    echo "🤖 CodeRabbit Integration:"
    echo "  📋 Local Check: npm run coderabbit:check"
    echo "  🔧 Auto Fix: npm run lint:fix"
    echo "  📝 Type Check: npm run type-check"
    echo "  🏗️  Build: npm run build"
    echo ""
    echo "📊 Code Quality Dashboard:"
    echo "  • TypeScript Errors: Run type-check to see current count"
    echo "  • ESLint Issues: Run lint to see current count"
    echo "  • Build Status: Run build to verify"
    echo ""
    echo "💡 Quick Tips:"
    echo "  • Save files to trigger auto-reload"
    echo "  • CodeRabbit will review all PRs automatically"
    echo "  • Use 'git commit' to run pre-commit checks"
    echo "=========================================="
}

# Main execution
case "$1" in
    "check")
        run_quick_check
        ;;
    "watch")
        show_ports_and_info
        run_quick_check
        watch_files
        ;;
    "info")
        show_ports_and_info
        ;;
    *)
        show_ports_and_info
        show_suggestions
        echo -e "${BLUE}Usage:${NC}"
        echo "  ./coderabbit-local.sh check   - Run quick quality check"
        echo "  ./coderabbit-local.sh watch   - Start file watcher"
        echo "  ./coderabbit-local.sh info    - Show ports and info"
        ;;
esac
