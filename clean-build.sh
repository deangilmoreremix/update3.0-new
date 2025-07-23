#!/bin/bash
set -e

echo "=== Starting Clean Build Process ==="
echo "1. Stopping any running processes..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

echo "2. Cleaning cache and old builds..."
rm -rf dist 2>/dev/null || true
rm -rf node_modules/.vite 2>/dev/null || true

echo "3. Running production build..."
npm run build

if [ -d "dist" ]; then
    echo "✅ Build successful! dist directory created."
    echo "📁 Contents of dist:"
    ls -la dist/
else
    echo "❌ Build failed - no dist directory created."
    exit 1
fi

echo "=== Build Complete ==="
