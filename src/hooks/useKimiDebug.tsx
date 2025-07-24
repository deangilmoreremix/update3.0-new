import { useState, useCallback, useEffect } from 'react';
import { kimiDebugService } from '../services/kimiDebugService';

interface DebugAnalysis {
  analysis: string;
  suggestions: string[];
  severity: 'low' | 'medium' | 'high';
}

interface UseKimiDebugOptions {
  autoAnalyzeErrors?: boolean;
  enableConsoleCapture?: boolean;
}

export const useKimiDebug = (options: UseKimiDebugOptions = {}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<DebugAnalysis | null>(null);
  const [errorHistory, setErrorHistory] = useState<Array<{
    error: string;
    timestamp: Date;
    context?: string;
  }>>([]);

  // Debug a specific error with Kimi AI
  const debugError = useCallback(async (
    error: string | Error,
    codeContext?: string,
    filePath?: string
  ): Promise<DebugAnalysis | null> => {
    setIsAnalyzing(true);
    
    try {
      const errorMessage = error instanceof Error ? error.message : error;
      const stackTrace = error instanceof Error ? error.stack : undefined;
      
      const analysis = await kimiDebugService.analyzeError(
        errorMessage,
        stackTrace,
        codeContext
      );
      
      setLastAnalysis(analysis);
      
      // Add to error history
      setErrorHistory(prev => [
        {
          error: errorMessage,
          timestamp: new Date(),
          context: codeContext || filePath
        },
        ...prev.slice(0, 9) // Keep last 10 errors
      ]);
      
      return analysis;
    } catch (err) {
      console.error('Failed to analyze error with Kimi:', err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Debug code performance issues
  const debugPerformance = useCallback(async (
    code: string,
    performanceMetrics?: string
  ): Promise<string | null> => {
    setIsAnalyzing(true);
    
    try {
      const response = await kimiDebugService.debugWithKimi(
        'Performance Analysis Request',
        code,
        undefined,
        undefined
      );
      
      return response;
    } catch (err) {
      console.error('Failed to analyze performance with Kimi:', err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Get code explanation
  const explainCode = useCallback(async (
    code: string,
    language = 'typescript'
  ): Promise<string | null> => {
    setIsAnalyzing(true);
    
    try {
      const response = await kimiDebugService.debugWithKimi(
        `Please explain this ${language} code:`,
        code
      );
      
      return response;
    } catch (err) {
      console.error('Failed to explain code with Kimi:', err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Suggest code improvements
  const suggestImprovements = useCallback(async (
    code: string,
    context?: string
  ): Promise<string | null> => {
    setIsAnalyzing(true);
    
    try {
      const prompt = context 
        ? `Suggest improvements for this code (Context: ${context}):`
        : 'Suggest improvements for this code:';
        
      const response = await kimiDebugService.debugWithKimi(prompt, code);
      return response;
    } catch (err) {
      console.error('Failed to get suggestions from Kimi:', err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Hook for automatic error handling
  useEffect(() => {
    if (!options.autoAnalyzeErrors) return;

    const originalConsoleError = console.error;
    
    if (options.enableConsoleCapture) {
      console.error = (...args) => {
        originalConsoleError(...args);
        
        // Analyze console errors automatically
        const errorMessage = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        debugError(errorMessage);
      };
    }

    return () => {
      if (options.enableConsoleCapture) {
        console.error = originalConsoleError;
      }
    };
  }, [options.autoAnalyzeErrors, options.enableConsoleCapture, debugError]);

  // Clear error history
  const clearHistory = useCallback(() => {
    setErrorHistory([]);
    setLastAnalysis(null);
  }, []);

  // Get debug suggestions for React components
  const debugReactComponent = useCallback(async (
    componentCode: string,
    error?: string,
    props?: Record<string, any>
  ): Promise<string | null> => {
    setIsAnalyzing(true);
    
    try {
      let prompt = 'Debug this React component:';
      let context = componentCode;
      
      if (error) {
        prompt += `\n\nError: ${error}`;
      }
      
      if (props) {
        context += `\n\nProps: ${JSON.stringify(props, null, 2)}`;
      }
      
      const response = await kimiDebugService.debugWithKimi(prompt, context);
      return response;
    } catch (err) {
      console.error('Failed to debug React component with Kimi:', err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Check if Kimi service is available
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null);
  
  useEffect(() => {
    kimiDebugService.checkApiHealth().then(setServiceAvailable);
  }, []);

  return {
    // Analysis functions
    debugError,
    debugPerformance,
    explainCode,
    suggestImprovements,
    debugReactComponent,
    
    // State
    isAnalyzing,
    lastAnalysis,
    errorHistory,
    serviceAvailable,
    
    // Utilities
    clearHistory
  };
};

// HOC for automatic component debugging
export const withKimiDebug = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const { debugReactComponent } = useKimiDebug();
    
    useEffect(() => {
      // Capture component errors in development
      if (process.env.NODE_ENV === 'development') {
        const componentName = Component.displayName || Component.name || 'Anonymous';
        
        // You could add error boundary logic here
        console.log(`Component ${componentName} rendered with Kimi debugging enabled`);
      }
    }, []);
    
    return <Component {...props} ref={ref} />;
  });
};

// Error boundary with Kimi integration
interface KimiErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  analysis?: DebugAnalysis;
}

export class KimiErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  KimiErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): KimiErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Kimi Error Boundary caught an error:', error, errorInfo);
    
    try {
      const analysis = await kimiDebugService.analyzeError(
        error.message,
        error.stack,
        `Component Stack: ${errorInfo.componentStack}`
      );
      
      this.setState({ analysis });
    } catch (err) {
      console.error('Failed to analyze error with Kimi:', err);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bug className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 text-sm">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
            
            {this.state.analysis && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-blue-900 mb-2">AI Analysis</h3>
                <p className="text-blue-800 text-sm">{this.state.analysis.analysis}</p>
                
                {this.state.analysis.suggestions.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium text-blue-900 text-sm mb-1">Suggestions:</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      {this.state.analysis.suggestions.map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default useKimiDebug;
