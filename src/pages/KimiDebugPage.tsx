import React, { useState } from 'react';
import { Bug, Code, Zap, Brain, CheckCircle, AlertTriangle } from 'lucide-react';
import { KimiDebugInterface } from '../components/debug/KimiDebugInterface';
import { useKimiDebug } from '../hooks/useKimiDebug';

const KimiDebugPage: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const { debugError, explainCode, suggestImprovements, isAnalyzing, serviceAvailable } = useKimiDebug();

  // Demo code samples
  const demoSamples = {
    errorCode: `function fetchUserData(userId) {
  const user = users.find(u => u.id === userId);
  return user.profile.name; // Error: Cannot read property 'profile' of undefined
}`,
    performanceCode: `function inefficientFilter(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[i].category === data[j].category) {
        result.push(data[i]);
      }
    }
  }
  return result;
}`,
    reactComponent: `function UserProfile({ userId }) {
  const [user, setUser] = useState();
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // Missing dependency: userId
  
  return <div>{user.name}</div>; // Error: user might be undefined
}`,
    complexCode: `const processData = (items) => {
  return items
    .filter(item => item.status === 'active')
    .map(item => ({
      ...item,
      processed: true,
      timestamp: Date.now()
    }))
    .reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
};`
  };

  const handleDemoAnalysis = async (type: string, code: string, error?: string) => {
    setActiveDemo(type);
    
    if (error) {
      await debugError(error, code);
    } else {
      await explainCode(code);
    }
  };

  const demoFeatures = [
    {
      icon: Bug,
      title: 'Error Analysis',
      description: 'Analyze JavaScript/TypeScript errors with AI-powered insights',
      color: 'red',
      demo: () => handleDemoAnalysis('error', demoSamples.errorCode, 'Cannot read property "profile" of undefined')
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Get suggestions for improving code performance and efficiency',
      color: 'yellow',
      demo: () => handleDemoAnalysis('performance', demoSamples.performanceCode)
    },
    {
      icon: Code,
      title: 'Code Explanation',
      description: 'Understand complex code sections with detailed explanations',
      color: 'blue',
      demo: () => handleDemoAnalysis('explanation', demoSamples.complexCode)
    },
    {
      icon: Brain,
      title: 'React Debugging',
      description: 'Specialized debugging for React components and hooks',
      color: 'purple',
      demo: () => handleDemoAnalysis('react', demoSamples.reactComponent, 'React Hook useEffect has a missing dependency')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kimi AI Debug Assistant</h1>
              <p className="text-gray-600">Intelligent debugging powered by Kimi-K2 AI model</p>
            </div>
            <div className="ml-auto">
              {serviceAvailable === null ? (
                <div className="flex items-center text-gray-500">
                  <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full mr-2" />
                  Checking...
                </div>
              ) : serviceAvailable ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Service Available
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Service Unavailable
                </div>
              )}
            </div>
          </div>
          
          {!serviceAvailable && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <h3 className="font-medium text-yellow-800">API Configuration Required</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Add your Kimi API key to environment variables: <code className="bg-yellow-100 px-1 rounded">VITE_KIMI_API_KEY</code>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Features Demo */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Debugging Features</h2>
            
            <div className="grid gap-4">
              {demoFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={feature.demo}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center`}>
                      <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                    </div>
                    <button
                      disabled={!serviceAvailable || isAnalyzing}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        serviceAvailable && !isAnalyzing
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Try Demo'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Code Samples */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Demo Code Samples</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Error-prone Code:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    <code>{demoSamples.errorCode}</code>
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Issue:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    <code>{demoSamples.performanceCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Interface */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <KimiDebugInterface />
          </div>
        </div>

        {/* Integration Examples */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Integration Examples</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">React Hook Usage</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`import { useKimiDebug } from './hooks/useKimiDebug';

function MyComponent() {
  const { debugError, explainCode } = useKimiDebug();
  
  const handleError = async (error) => {
    const analysis = await debugError(error);
    console.log(analysis);
  };
  
  return <div>...</div>;
}`}</code>
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Error Boundary</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`import { KimiErrorBoundary } from './hooks/useKimiDebug';

function App() {
  return (
    <KimiErrorBoundary>
      <YourApp />
    </KimiErrorBoundary>
  );
}`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-2">Advanced Analysis</h3>
            <p className="text-blue-700 text-sm">
              Leverages Kimi-K2's 65.8% accuracy on SWE-bench coding tasks for precise error analysis
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="font-medium text-purple-900 mb-2">Context Awareness</h3>
            <p className="text-purple-700 text-sm">
              128K context window allows analysis of large codebases and complex debugging scenarios
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-medium text-green-900 mb-2">Tool Integration</h3>
            <p className="text-green-700 text-sm">
              Native tool-calling capabilities enable specialized debugging functions and analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KimiDebugPage;
