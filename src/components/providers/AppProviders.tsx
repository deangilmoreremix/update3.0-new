import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { DashboardLayoutProvider } from '../../contexts/DashboardLayoutContext';
import { VideoCallProvider } from '../../contexts/VideoCallContext';
import { AIToolsProvider } from '../AIToolsProvider';
import { ModalsProvider } from '../ModalsProvider';

// Loading fallback for the entire app
const AppLoader = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading CRM Dashboard...</p>
    </div>
  </div>
);

// Error boundary for context providers
class ContextErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Context Provider Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-red-800 mb-4">
              Application Error
            </h2>
            <p className="text-red-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Provider composition component
interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ContextErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <Suspense fallback={<AppLoader />}>
            <VideoCallProvider>
              <AIToolsProvider>
                <NavigationProvider>
                  <DashboardLayoutProvider>
                    <ModalsProvider>
                      {children}
                    </ModalsProvider>
                  </DashboardLayoutProvider>
                </NavigationProvider>
              </AIToolsProvider>
            </VideoCallProvider>
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </ContextErrorBoundary>
  );
};
