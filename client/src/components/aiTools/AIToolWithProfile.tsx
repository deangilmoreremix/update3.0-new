import React, { useState, useEffect } from 'react';
import { User, Brain, Clock, Target } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { edgeFunctionService } from '../../services/edgeFunctionService';
import { intelligentModelSelector, CustomerProfile } from '../../services/ai/intelligentModelSelector';
import CustomerProfileAI from '../shared/CustomerProfileAI';

interface AIToolWithProfileProps {
  toolName: string;
  toolIcon: React.ComponentType<any>;
  toolDescription: string;
  taskType: 'content-generation' | 'analysis' | 'conversation' | 'code' | 'research' | 'reasoning' | 'creative' | 'structured-data';
  complexity: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  customerId?: string;
  children: React.ReactNode;
  onModelSelected?: (model: string) => void;
}

const AIToolWithProfile: React.FC<AIToolWithProfileProps> = ({
  toolName,
  toolIcon: ToolIcon,
  toolDescription,
  taskType,
  complexity,
  urgency,
  customerId = 'default-customer',
  children,
  onModelSelected
}) => {
  const { isDark } = useTheme();
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [recommendedModel, setRecommendedModel] = useState<string>('');
  const [modelReasoning, setModelReasoning] = useState<string>('');
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadCustomerProfile();
  }, [customerId]);

  const loadCustomerProfile = async () => {
    try {
      // Mock customer profile (in real app, this would be fetched from API)
      const mockProfile: CustomerProfile = {
        id: customerId,
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
      };
      
      setCustomerProfile(mockProfile);
      
      // Get recommended model for this task
      const task = {
        type: taskType,
        complexity,
        urgency,
        context: toolName,
        customerProfile: mockProfile
      };
      
      const selectedModel = intelligentModelSelector.selectOptimalModel(task);
      setRecommendedModel(selectedModel.model);
      setModelReasoning(generateModelReasoning(selectedModel, task));
      
      onModelSelected?.(selectedModel.model);
    } catch (error) {
      console.error('Error loading customer profile:', error);
    }
  };

  const generateModelReasoning = (model: any, task: any) => {
    const reasons = [];
    
    if (model.optimalFor.includes(task.type)) {
      reasons.push(`Optimized for ${task.type}`);
    }
    
    if (task.complexity === 'high' && model.accuracy >= 8) {
      reasons.push('High accuracy for complex tasks');
    }
    
    if (task.urgency === 'high' && model.speed >= 8) {
      reasons.push('Fast response for urgent requests');
    }
    
    if (task.customerProfile?.history.preferredModels.includes(model.model)) {
      reasons.push('Customer preference based on history');
    }
    
    return reasons.join(', ') || 'Best overall match for task requirements';
  };

  const handleAIRequest = async (prompt: string, data: unknown = {}) => {
    if (!customerProfile) return null;
    
    setIsProcessing(true);
    try {
      const result = await edgeFunctionService.callAIFunction(
        toolName.toLowerCase().replace(/\s+/g, '-'),
        {
          prompt,
          ...data
        },
        {
          customerProfile,
          taskType,
          complexity,
          urgency
        }
      );
      
      return result;
    } catch (error) {
      console.error('AI request failed:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-blue-500';
      case 'medium': return 'text-orange-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getProviderColor = (model: string) => {
    if (model.includes('gpt')) return 'text-green-500';
    if (model.includes('gemini')) return 'text-blue-500';
    if (model.includes('gemma')) return 'text-purple-500';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* AI Tool Header with Model Selection */}
      <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <ToolIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {toolName}
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {toolDescription}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowProfilePanel(!showProfilePanel)}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <User className="w-5 h-5" />
          </button>
        </div>

        {/* AI Model Information */}
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-blue-500" />
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                AI Model Selection
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Target className={getComplexityColor(complexity)} />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {complexity}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className={getUrgencyColor(urgency)} />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {urgency}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${getProviderColor(recommendedModel)} ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {recommendedModel || 'Selecting optimal model...'}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                {modelReasoning}
              </p>
            </div>
            {isProcessing && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Processing...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Profile Panel */}
      {showProfilePanel && customerProfile && (
        <CustomerProfileAI
          customerId={customerId}
          onProfileUpdate={setCustomerProfile}
          showRecommendations={true}
        />
      )}

      {/* AI Tool Content */}
      <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              customerProfile,
              handleAIRequest,
              isProcessing,
              recommendedModel
            } as unknown);
          }
          return child;
        })}
      </div>
    </div>
  );
};

export default AIToolWithProfile;