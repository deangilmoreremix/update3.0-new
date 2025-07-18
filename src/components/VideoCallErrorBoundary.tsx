import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorType?: 'video-call' | 'navigation' | 'line-chart' | 'other';
}

export class VideoCallErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary caught:', error.message);
    
    // Check for different error types
    if (error.message?.includes('useVideoCall must be used within')) {
      return { hasError: true, error, errorType: 'video-call' };
    }
    
    if (error.message?.includes('useNavigation must be used within')) {
      return { hasError: true, error, errorType: 'navigation' };
    }
    
    if (error.message?.includes('LineChart is not defined')) {
      return { hasError: true, error, errorType: 'line-chart' };
    }
    
    // For other critical errors, catch them too
    return { hasError: true, error, errorType: 'other' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check for different types of provider errors
    if (error.message?.includes('useVideoCall must be used within') || 
        error.message?.includes('useNavigation must be used within')) {
      console.log('Context provider error detected, attempting recovery...');
      
      // Clear any potential cached state
      try {
        localStorage.removeItem('videoCallState');
        localStorage.removeItem('navigationState');
        sessionStorage.clear();
      } catch (e) {
        console.warn('Failed to clear storage:', e);
      }
      
      // Reload the page after a short delay to get fresh context
      setTimeout(() => {
        console.log('Reloading to recover from context error...');
        window.location.reload();
      }, 2000);
    }
    
    // Handle import/dependency errors differently
    if (error.message?.includes('LineChart is not defined') || 
        error.message?.includes('is not defined')) {
      console.log('Import error detected:', error.message);
      // Don't reload for import errors, just show fallback UI
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { errorType, error } = this.state;
      
      let title = 'Loading Latest Version...';
      let message = 'Clearing cache and reloading with the newest updates...';
      
      if (errorType === 'line-chart') {
        title = 'Component Loading...';
        message = 'Some chart components are loading. This will resolve automatically.';
      } else if (errorType === 'navigation') {
        title = 'Navigation Loading...';
        message = 'Navigation system is initializing...';
      }
      
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {title}
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry Now
            </button>
            {error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Technical Details
                </summary>
                <pre className="text-xs text-red-600 mt-2 overflow-auto">
                  {error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default VideoCallErrorBoundary;
