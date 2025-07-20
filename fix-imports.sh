#!/bin/bash

# Fix chart imports across all components
echo "🔧 Updating chart imports to use safe components..."

# Replace unsafe recharts imports with safe imports
find src/ -name "*.tsx" -type f -exec sed -i 's/import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from '\''recharts'\'';/import { SafeLineChart as LineChart, SafeLine as Line, SafeBarChart as BarChart, SafeBar as Bar, SafeXAxis as XAxis, SafeYAxis as YAxis, SafeCartesianGrid as CartesianGrid, SafeTooltip as Tooltip, SafeResponsiveContainer as ResponsiveContainer } from '\''..\/charts\/SafeCharts'\'';/g' {} \;

# Replace common recharts patterns
find src/ -name "*.tsx" -type f -exec sed -i 's/from '\''recharts'\''/from '\''..\/charts\/SafeCharts'\''/g' {} \;

# Replace useVideoCall imports with useSafeVideoCall
find src/ -name "*.tsx" -type f -exec sed -i 's/import { useVideoCall } from/import { useSafeVideoCall as useVideoCall } from/g' {} \;
find src/ -name "*.tsx" -type f -exec sed -i 's/..\/contexts\/VideoCallContext/..\/hooks\/useSafeVideoCall/g' {} \;

echo "✅ Chart import updates complete"
