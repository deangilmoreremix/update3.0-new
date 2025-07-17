#!/bin/bash

# 🚀 Complete Database Setup & Migration Script
set -e

echo "🔧 Starting Complete Database Setup..."

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

# Check if environment variables are set
check_env_vars() {
    log_info "Checking environment variables..."
    
    if [ -z "$DATABASE_URL" ]; then
        log_error "DATABASE_URL is not set. Please configure your database connection."
        echo "Example: postgresql://user:password@host:port/database"
        exit 1
    fi
    
    if [ -z "$VITE_SUPABASE_URL" ]; then
        log_warning "VITE_SUPABASE_URL is not set. Supabase features may not work."
    fi
    
    if [ -z "$VITE_GEMINI_API_KEY" ]; then
        log_warning "VITE_GEMINI_API_KEY is not set. AI features may not work."
    fi
    
    log_success "Environment variables checked"
}

# Install dependencies if needed
install_dependencies() {
    log_info "Installing/updating dependencies..."
    
    # Check if drizzle-kit is installed
    if ! command -v drizzle-kit &> /dev/null; then
        log_info "Installing drizzle-kit..."
        npm install -g drizzle-kit
    fi
    
    # Install project dependencies
    npm install
    
    log_success "Dependencies installed"
}

# Generate database migrations
generate_migrations() {
    log_info "Generating database migrations..."
    
    if [ -f "drizzle.config.ts" ]; then
        npx drizzle-kit generate
        log_success "Database migrations generated"
    else
        log_error "drizzle.config.ts not found"
        exit 1
    fi
}

# Push schema to database
push_schema() {
    log_info "Pushing schema to database..."
    
    npx drizzle-kit push
    log_success "Schema pushed to database"
}

# Setup default tenant (if migration exists)
setup_default_tenant() {
    log_info "Setting up default tenant..."
    
    if [ -f "server/migrations/setupDefaultTenantSQL.ts" ]; then
        # This would need to be run via a Node.js script
        log_info "Default tenant migration file found"
        log_warning "Run default tenant setup manually after deployment"
    fi
    
    log_success "Default tenant setup prepared"
}

# Verify database connection
verify_connection() {
    log_info "Verifying database connection..."
    
    # This is a simple check - in production you'd want more robust verification
    if npx drizzle-kit introspect &> /dev/null; then
        log_success "Database connection verified"
    else
        log_warning "Could not verify database connection"
    fi
}

# Main execution
main() {
    echo "🚀 Complete Database Setup Script"
    echo "=================================="
    
    check_env_vars
    install_dependencies
    generate_migrations
    push_schema
    setup_default_tenant
    verify_connection
    
    echo ""
    log_success "🎉 Database setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Configure your API keys in .env"
    echo "2. Run 'npm run build' to create production build"
    echo "3. Deploy to Netlify"
    echo ""
}

# Run main function
main
