#!/bin/bash

# CodeRabbit Workspace Cleanup - Remove Duplicate Directories
echo "🧹 CodeRabbit Workspace Cleanup Starting..."
echo "=========================================="

# Remove duplicate project directories that are causing TypeScript confusion
echo "🗑️  Removing duplicate project directories..."

# Remove pipeline_repo (duplicate)
if [ -d "pipeline_repo" ]; then
    echo "Removing pipeline_repo directory..."
    rm -rf pipeline_repo
fi

# Remove client directory (duplicate)
if [ -d "client" ]; then
    echo "Removing client directory..."
    rm -rf client
fi

# Remove modules directory (duplicate)
if [ -d "modules" ]; then
    echo "Removing modules directory..."
    rm -rf modules
fi

# Remove pages directory (duplicate - we have src/pages)
if [ -d "pages" ]; then
    echo "Removing pages directory..."
    rm -rf pages
fi

# Remove store directory (duplicate - we have src/store)
if [ -d "store" ]; then
    echo "Removing store directory..."
    rm -rf store
fi

# Remove services directory (duplicate - we have src/services)
if [ -d "services" ]; then
    echo "Removing services directory..."
    rm -rf services
fi

# Remove shared directory (duplicate)
if [ -d "shared" ]; then
    echo "Removing shared directory..."
    rm -rf shared
fi

# Remove any other duplicate directories
echo "🔍 Checking for other duplicate directories..."
for dir in contexts hooks types utils data components agents; do
    if [ -d "$dir" ] && [ -d "src/$dir" ]; then
        echo "Removing duplicate $dir directory..."
        rm -rf "$dir"
    fi
done

# Remove backup and temporary files
echo "🗑️  Cleaning up backup and temporary files..."
find . -name "*.backup.*" -delete 2>/dev/null || true
find . -name "*.old" -delete 2>/dev/null || true
find . -name "*.bak" -delete 2>/dev/null || true

# Remove any .git folders that might be in subdirectories
find . -name ".git" -type d -not -path "./.git" -exec rm -rf {} + 2>/dev/null || true

echo "✅ Workspace cleanup completed!"

# Check TypeScript errors after cleanup
echo "📊 Checking TypeScript errors after cleanup..."
ERRORS=$(npm run type-check 2>&1 | grep "error TS" | wc -l)
echo "TypeScript errors remaining: $ERRORS"

echo "🎉 CodeRabbit Workspace Cleanup Complete!"
echo "Ready for clean development environment!"
