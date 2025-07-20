import React, { Suspense, lazy } from 'react';

// Lazy load recharts components to prevent build-time issues
const LazyLineChart = lazy(() => 
  import('recharts').then(module => ({ default: module.LineChart }))
);
const LazyBarChart = lazy(() => 
  import('recharts').then(module => ({ default: module.BarChart }))
);
const LazyPieChart = lazy(() => 
  import('recharts').then(module => ({ default: module.PieChart }))
);

// Chart loading fallback
const ChartLoader = ({ height = 200 }: { height?: number }) => (
  <div 
    className="w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
    style={{ height: `${height}px` }}
  >
    <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
  </div>
);

// Safe wrapper for LineChart
export const SafeLineChart: React.FC<any> = (props) => (
  <Suspense fallback={<ChartLoader height={props.height || 200} />}>
    <LazyLineChart {...props} />
  </Suspense>
);

// Safe wrapper for BarChart
export const SafeBarChart: React.FC<any> = (props) => (
  <Suspense fallback={<ChartLoader height={props.height || 200} />}>
    <LazyBarChart {...props} />
  </Suspense>
);

// Safe wrapper for PieChart
export const SafePieChart: React.FC<any> = (props) => (
  <Suspense fallback={<ChartLoader height={props.height || 200} />}>
    <LazyPieChart {...props} />
  </Suspense>
);

// Export all other recharts components with lazy loading
export const ChartComponents = {
  Line: lazy(() => import('recharts').then(module => ({ default: module.Line }))),
  Bar: lazy(() => import('recharts').then(module => ({ default: module.Bar }))),
  XAxis: lazy(() => import('recharts').then(module => ({ default: module.XAxis }))),
  YAxis: lazy(() => import('recharts').then(module => ({ default: module.YAxis }))),
  CartesianGrid: lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid }))),
  Tooltip: lazy(() => import('recharts').then(module => ({ default: module.Tooltip }))),
  ResponsiveContainer: lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer }))),
  Legend: lazy(() => import('recharts').then(module => ({ default: module.Legend }))),
  Pie: lazy(() => import('recharts').then(module => ({ default: module.Pie }))),
  Cell: lazy(() => import('recharts').then(module => ({ default: module.Cell }))),
};

// Helper to wrap chart components safely
export const withChartWrapper = <T extends React.ComponentType<any>>(
  Component: T,
  fallbackHeight = 200
): React.FC<React.ComponentProps<T>> => {
  return (props) => (
    <Suspense fallback={<ChartLoader height={fallbackHeight} />}>
      <Component {...props} />
    </Suspense>
  );
};
