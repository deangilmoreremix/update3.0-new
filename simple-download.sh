#!/bin/bash

# 🚀 Smart CRM Enhanced Components - Simple Download
# Run this in your actual Smart CRM repository

echo "🚀 Downloading Enhanced Components..."

# Create pages directory if it doesn't exist
mkdir -p pages

# Download the enhanced components
echo "📁 Downloading DashboardEnhanced.tsx..."
curl -sSL https://raw.githubusercontent.com/deangilmoreremix/update3.0-new/main/pages/DashboardEnhanced.tsx -o pages/DashboardEnhanced.tsx

echo "📁 Downloading PipelineEnhanced.tsx..."
curl -sSL https://raw.githubusercontent.com/deangilmoreremix/update3.0-new/main/pages/PipelineEnhanced.tsx -o pages/PipelineEnhanced.tsx

echo "📁 Downloading ContactsEnhanced.tsx..."
curl -sSL https://raw.githubusercontent.com/deangilmoreremix/update3.0-new/main/pages/ContactsEnhanced.tsx -o pages/ContactsEnhanced.tsx

echo "✅ Enhanced components downloaded!"
echo ""
echo "🔧 Next steps:"
echo "1. Install dependencies: npm install react-beautiful-dnd @types/react-beautiful-dnd zustand framer-motion"
echo "2. Update your App.tsx imports to use the enhanced components"
echo "   - import Dashboard from './pages/DashboardEnhanced';"
echo "   - import Pipeline from './pages/PipelineEnhanced';"
echo "   - import Contacts from './pages/ContactsEnhanced';"
echo "3. Run: npm run dev"
echo ""
echo "🎉 Your Smart CRM will now have enhanced components!"
