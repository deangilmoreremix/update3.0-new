import React, { Suspense, ComponentType, ReactNode } from 'react';
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  Bar,
  Pie,
  Cell,
  Area
} from 'recharts';

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

// Export safe chart components (directly from recharts, wrapped in error boundaries)
export const SafeLineChart = withChartWrapper(LineChart);
export const SafeBarChart = withChartWrapper(BarChart);
export const SafePieChart = withChartWrapper(PieChart);
export const SafeAreaChart = withChartWrapper(AreaChart);

// Utility components
export const SafeXAxis = withChartWrapper(XAxis);
export const SafeYAxis = withChartWrapper(YAxis);
export const SafeCartesianGrid = withChartWrapper(CartesianGrid);
export const SafeTooltip = withChartWrapper(Tooltip);
export const SafeResponsiveContainer = withChartWrapper(ResponsiveContainer);
export const SafeLegend = withChartWrapper(Legend);
export const SafeLine = withChartWrapper(Line);
export const SafeBar = withChartWrapper(Bar);
export const SafePie = withChartWrapper(Pie);
export const SafeCell = withChartWrapper(Cell);
export const SafeArea = withChartWrapper(Area);

// Also export with original names for compatibility
export { SafeLineChart as LineChart };
export { SafeBarChart as BarChart };
export { SafePieChart as PieChart };
export { SafeAreaChart as AreaChart };
export { SafeXAxis as XAxis };
export { SafeYAxis as YAxis };
export { SafeCartesianGrid as CartesianGrid };
export { SafeTooltip as Tooltip };
export { SafeResponsiveContainer as ResponsiveContainer };
export { SafeLegend as Legend };
export { SafeLine as Line };
export { SafeBar as Bar };
export { SafePie as Pie };
export { SafeCell as Cell };
export { SafeArea as Area };
