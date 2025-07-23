#!/bin/bash
echo "Stopping any running dev servers..."
pkill -f "npm run dev" || true
pkill -f "vite" || true

echo "Clearing node_modules/.vite cache..."
rm -rf node_modules/.vite

echo "Running clean build..."
npm run build

echo "Build completed!"
