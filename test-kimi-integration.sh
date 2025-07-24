#!/bin/bash
echo "🧪 Testing Kimi AI Integration..."

cd pipeline_repo

echo "📋 Checking if node_modules exists..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed, running npm install..."
    npm install
fi

echo "🔍 Testing basic Kimi AI functionality..."
if [ -f "src/services/kimiAI.ts" ]; then
    echo "✅ Kimi AI service found"
else
    echo "❌ Kimi AI service not found"
fi

echo "🛠️ Available npm scripts:"
npm run | grep kimi

echo "🎯 Test complete!"
echo ""
echo "To use Kimi AI GitHub Agent:"
echo "1. cd pipeline_repo"
echo "2. npm run kimi:ask 'Your question here'"
echo "3. npm run kimi:analyze ../src/App.tsx"
echo "4. npm run kimi:commit"
