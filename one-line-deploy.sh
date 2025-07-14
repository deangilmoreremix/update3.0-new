#!/bin/bash
# One-line deployment - paste this into your Smart CRM repository

# Create backup and download enhanced components
git checkout -b backup-$(date +%Y%m%d-%H%M%S) && git checkout main && git checkout -b enhanced-deploy && mkdir -p pages && curl -sSL https://raw.githubusercontent.com/deangilmoreremix/update3.0-new/main/pages/DashboardEnhanced.tsx > pages/DashboardEnhanced.tsx && curl -sSL https://raw.githubusercontent.com/deangilmoreremix/update3.0-new/main/pages/PipelineEnhanced.tsx > pages/PipelineEnhanced.tsx && curl -sSL https://raw.githubusercontent.com/deangilmoreremix/update3.0-new/main/pages/ContactsEnhanced.tsx > pages/ContactsEnhanced.tsx && npm install react-beautiful-dnd zustand framer-motion recharts @types/react-beautiful-dnd && echo "✅ Enhanced components ready! Update App.tsx imports and run 'npm run dev'"
