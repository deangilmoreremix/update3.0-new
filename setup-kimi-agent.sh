#!/bin/bash

echo "🚀 Setting up Kimi AI GitHub Agent..."

# Navigate to the pipeline repo directory
cd pipeline_repo

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file with Kimi API key
echo "🔑 Setting up environment variables..."
cat > .env.kimi << EOF
# Kimi AI Configuration
KIMI_API_KEY=sk-dDBl3OhTNtprLJB4eurbDL5Vv5YDxkcr02h21mkNuBDIW2kT

# Kimi AI Models
KIMI_DEFAULT_MODEL=moonshot-v1-128k
KIMI_CODING_MODEL=moonshot-v1-128k
KIMI_DEBUG_MODEL=moonshot-v1-128k
KIMI_ANALYSIS_MODEL=moonshot-v1-32k

# Agent Configuration
KIMI_ENABLE_STREAMING=true
KIMI_MAX_RETRIES=3
KIMI_TIMEOUT=30000
EOF

# Build the TypeScript files
echo "🔨 Building TypeScript..."
npm run kimi:build

echo "✅ Setup complete!"
echo ""
echo "🎯 Available commands:"
echo "  npm run kimi:analyze <file>     - Analyze code file"
echo "  npm run kimi:debug '<error>'    - Debug error message"
echo "  npm run kimi:commit             - Generate commit message"
echo "  npm run kimi:review [pr-num]    - Review pull request"
echo "  npm run kimi:ask '<question>'   - Ask Kimi AI anything"
echo ""
echo "💡 Examples:"
echo "  npm run kimi:analyze ../src/App.tsx"
echo "  npm run kimi:debug 'TypeError: Cannot read property'"
echo "  npm run kimi:commit"
echo "  npm run kimi:ask 'How do I optimize React performance?'"
echo ""
echo "🔗 Kimi AI is now integrated as your GitHub agent!"
