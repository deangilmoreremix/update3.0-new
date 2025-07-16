import React, { useState } from 'react';
import { Brain, Zap, Star, Send } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { intelligentModelSelector, AITask, CustomerProfile } from '../services/ai/intelligentModelSelector';
import AIModelSelector from '../components/shared/AIModelSelector';
import CustomerProfileAI from '../components/shared/CustomerProfileAI';

const AIModelDemo: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedTask, setSelectedTask] = useState<AITask>({
    type: 'content-generation',
    complexity: 'medium',
    urgency: 'medium',
    context: 'demo'
  });
  const [result, setResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>({
    id: 'demo-customer',
    name: 'Sarah Johnson',
    industry: 'Technology',
    preferences: {
      communicationStyle: 'professional',
      responseLength: 'detailed',
      tone: 'authoritative'
    },
    history: {
      previousInteractions: 47,
      successfulTasks: ['email-composer', 'content-generator', 'deal-analyzer'],
      preferredModels: ['gpt-4o', 'gemini-2.5-pro']
    },
    aiScore: 85
  });

  const handleRunDemo = async () => {
    setIsProcessing(true);
    setResult('');
    
    try {
      const taskWithProfile = {
        ...selectedTask,
        customerProfile
      };
      
      const response = await intelligentModelSelector.executeTask(
        taskWithProfile,
        `Generate a professional ${selectedTask.type} example for a ${selectedTask.complexity} complexity, ${selectedTask.urgency} urgency task in the ${customerProfile.industry} industry.`
      );
      
      setResult(response);
    } catch (error) {
      console.error('Demo execution error:', error);
      setResult('Error: Unable to execute AI task demo');
    } finally {
      setIsProcessing(false);
    }
  };

  const taskTypes = [
    { value: 'content-generation', label: 'Content Generation' },
    { value: 'analysis', label: 'Analysis' },
    { value: 'conversation', label: 'Conversation' },
    { value: 'code', label: 'Code Generation' },
    { value: 'research', label: 'Research' },
    { value: 'reasoning', label: 'Reasoning' },
    { value: 'creative', label: 'Creative' },
    { value: 'structured-data', label: 'Structured Data' }
  ];

  const complexityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'bg-blue-500' },
    { value: 'medium', label: 'Medium', color: 'bg-orange-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' }
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Intelligent AI Model Selection Demo
        </h1>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Experience how our system intelligently selects between Gemini, Gemma, and OpenAI models based on task requirements and customer profiles
        </p>
      </div>

      {/* Demo Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Configuration */}
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Task Configuration
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Task Type
              </label>
              <select
                value={selectedTask.type}
                onChange={(e) => setSelectedTask({...selectedTask, type: e.target.value as any})}
                className={`w-full p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                {taskTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Complexity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {complexityLevels.map(level => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedTask({...selectedTask, complexity: level.value as any})}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTask.complexity === level.value
                        ? `${level.color} text-white`
                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Urgency
              </label>
              <div className="grid grid-cols-3 gap-2">
                {urgencyLevels.map(level => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedTask({...selectedTask, urgency: level.value as any})}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTask.urgency === level.value
                        ? `${level.color} text-white`
                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRunDemo}
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Run AI Model Demo</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* AI Model Selector */}
        <div>
          <AIModelSelector
            taskType={selectedTask.type}
            complexity={selectedTask.complexity}
            urgency={selectedTask.urgency}
            customerProfile={customerProfile}
            showRecommendations={true}
          />
        </div>

        {/* Customer Profile */}
        <div>
          <CustomerProfileAI
            customerId="demo-customer"
            onProfileUpdate={setCustomerProfile}
            showRecommendations={true}
          />
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AI Model Response
          </h2>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <pre className={`whitespace-pre-wrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {result}
            </pre>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          How Intelligent Model Selection Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              OpenAI Models
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Best for complex reasoning, structured data, and high-accuracy tasks
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Gemini Models
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Optimal for content generation, research, and multimodal tasks
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Gemma Models
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Efficient for conversation and specialized tasks with privacy focus
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelDemo;