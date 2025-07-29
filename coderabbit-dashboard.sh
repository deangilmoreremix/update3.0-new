#!/bin/bash

# CodeRabbit Live Dashboard
# Shows real-time code quality status alongside your dev server

clear

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

show_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                    🤖 CodeRabbit Live Dashboard                ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

show_ports() {
    echo -e "${CYAN}📱 Development Ports:${NC}"
    echo -e "  🌐 Main App: ${GREEN}http://localhost:5174${NC}"
    echo -e "  📊 Dev Server: ${GREEN}Port 5174${NC}"
    echo ""
}

show_quick_actions() {
    echo -e "${PURPLE}⚡ Quick Actions:${NC}"
    echo -e "  ${YELLOW}npm run coderabbit:check${NC}    - Run quality check"
    echo -e "  ${YELLOW}npm run lint:fix${NC}           - Auto-fix ESLint issues"
    echo -e "  ${YELLOW}npm run type-check${NC}         - Check TypeScript"
    echo -e "  ${YELLOW}npm run build${NC}              - Test build"
    echo ""
}

show_live_status() {
    echo -e "${CYAN}📊 Live Code Quality Status:${NC}"
    
    # TypeScript Status
    TS_ERRORS=$(npm run type-check 2>&1 | grep -c "error TS" 2>/dev/null || echo "0")
    if [ "$TS_ERRORS" -eq 0 ]; then
        echo -e "  TypeScript: ${GREEN}✅ No errors${NC}"
    else
        echo -e "  TypeScript: ${RED}❌ $TS_ERRORS errors${NC}"
    fi
    
    # Build Status
    echo -n "  Build Status: "
    if npm run build >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Passing${NC}"
    else
        echo -e "${RED}❌ Failing${NC}"
    fi
    
    # Dev Server Status
    if lsof -ti:5174 >/dev/null 2>&1; then
        echo -e "  Dev Server: ${GREEN}✅ Running on port 5174${NC}"
    else
        echo -e "  Dev Server: ${YELLOW}⚠️  Not running${NC}"
    fi
    
    echo ""
}

show_coderabbit_tips() {
    echo -e "${YELLOW}💡 CodeRabbit Tips:${NC}"
    echo "  • Save files to trigger auto-reload"
    echo "  • Create a PR to get full CodeRabbit AI review"
    echo "  • Fix TypeScript errors for better code quality"
    echo "  • Run lint:fix to auto-resolve style issues"
    echo ""
}

# Main loop
while true; do
    clear
    show_header
    show_ports
    show_live_status
    show_quick_actions
    show_coderabbit_tips
    
    echo -e "${BLUE}🔄 Auto-refreshing every 10 seconds... (Press Ctrl+C to stop)${NC}"
    echo "Last updated: $(date '+%H:%M:%S')"
    
    sleep 10
done
