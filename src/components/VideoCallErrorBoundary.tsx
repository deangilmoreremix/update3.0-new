import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class VideoCallErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error for debugging
    console.error('VideoCall context error detected:', error, errorInfo);
    
    // Check if it's a VideoCall provider error
    if (error.message?.includes('useVideoCall must be used within')) {
      console.log('Attempting to recover from VideoCall context error...');
      
      // Clear any potential cached state
      try {
        localStorage.removeItem('videoCallState');
        sessionStorage.clear();
      } catch (e) {
        console.warn('Failed to clear storage:', e);
      }
      
      // Reload the page after a short delay to get fresh context
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Loading Latest Version...
            </h2>
            <p className="text-gray-600 mb-6">
              Clearing cache and reloading with the newest updates...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry Now
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Technical Details
                </summary>
                <pre className="text-xs text-red-600 mt-2 overflow-auto">
                  {this.state.error.message}
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
