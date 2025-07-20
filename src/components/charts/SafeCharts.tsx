import React, { Suspense, lazy, ComponentType, ReactNode } from 'react';

// Chart loading fallback component
const ChartLoader = ({ height = 200 }: { height?: number }) => (
  <div 
    className="w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
    style={{ height: `${height}px` }}
  >
    <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
  </div>
);

// Error boundary for chart components
class ChartErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Chart rendering error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ChartLoader />;
    }
    return this.props.children;
  }
}

// Lazy load recharts components with proper error handling
const createLazyChart = (componentName: string) => 
  lazy(async () => {
    try {
      const module = await import('recharts');
      return { default: (module as any)[componentName] };
    } catch (error) {
      console.warn(`Failed to load ${componentName}:`, error);
      // Return a fallback component
      return {
        default: (props: any) => (
          <div className="w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span className="text-gray-500">Chart unavailable</span>
          </div>
        )
      };
    }
  });

// Safe chart components with lazy loading
export const SafeLineChart = createLazyChart('LineChart');
export const SafeBarChart = createLazyChart('BarChart');
export const SafePieChart = createLazyChart('PieChart');
export const SafeAreaChart = createLazyChart('AreaChart');

// Utility components
export const SafeXAxis = createLazyChart('XAxis');
export const SafeYAxis = createLazyChart('YAxis');
export const SafeCartesianGrid = createLazyChart('CartesianGrid');
export const SafeTooltip = createLazyChart('Tooltip');
export const SafeResponsiveContainer = createLazyChart('ResponsiveContainer');
export const SafeLegend = createLazyChart('Legend');
export const SafeLine = createLazyChart('Line');
export const SafeBar = createLazyChart('Bar');
export const SafePie = createLazyChart('Pie');
export const SafeCell = createLazyChart('Cell');
export const SafeArea = createLazyChart('Area');

// High-order component to wrap any chart with error boundary and suspense
export const withChartWrapper = <P extends object>(
  ChartComponent: ComponentType<P>,
  fallbackHeight = 200
) => {
  const WrappedChart = (props: P) => (
    <ChartErrorBoundary fallback={<ChartLoader height={fallbackHeight} />}>
      <Suspense fallback={<ChartLoader height={fallbackHeight} />}>
        <ChartComponent {...props} />
      </Suspense>
    </ChartErrorBoundary>
  );
  
  WrappedChart.displayName = `withChartWrapper(${ChartComponent.displayName || ChartComponent.name})`;
  return WrappedChart;
};

// Pre-wrapped common chart combinations
export const SafeChart = {
  LineChart: withChartWrapper(SafeLineChart),
  BarChart: withChartWrapper(SafeBarChart),
  PieChart: withChartWrapper(SafePieChart),
  AreaChart: withChartWrapper(SafeAreaChart),
  ResponsiveContainer: withChartWrapper(SafeResponsiveContainer),
};
