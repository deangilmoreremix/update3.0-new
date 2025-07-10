import React, { useState, useEffect } from 'react';
import { Brain, Zap, Star, Settings, TrendingUp, Clock, Shield, Target, Activity } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { intelligentModelSelector, ModelCapability, CustomerProfile, AITask } from '../../services/ai/intelligentModelSelector';

interface AIModelSelectorProps {
  taskType: 'content-generation' | 'analysis' | 'conversation' | 'code' | 'research' | 'reasoning' | 'creative' | 'structured-data';
  complexity: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  customerProfile?: CustomerProfile;
  onModelSelected?: (model: ModelCapability) => void;
  showRecommendations?: boolean;
  compact?: boolean;
}

const AIModelSelector: React.FC<AIModelSelectorProps> = ({
  taskType,
  complexity,
  urgency,
  customerProfile,
  onModelSelected,
  showRecommendations = true,
  compact = false
}) => {
  const { isDark } = useTheme();
  const [selectedModel, setSelectedModel] = useState<ModelCapability | null>(null);
  const [availableModels, setAvailableModels] = useState<ModelCapability[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    selectOptimalModel();
  }, [taskType, complexity, urgency, customerProfile]);

  const selectOptimalModel = async () => {
    setIsSelecting(true);
    try {
      const task: AITask = {
        type: taskType,
        complexity,
        urgency,
        context: 'ai-tool',
        customerProfile,
        requiresRealTime: urgency === 'high',
        needsStructuredOutput: taskType === 'structured-data'
      };

      const optimalModel = intelligentModelSelector.selectOptimalModel(task);
      setSelectedModel(optimalModel);
      
      // Get all available models for comparison
      const allModels = intelligentModelSelector.getModelRecommendations(customerProfile || {
        id: 'default',
        name: 'Default User',
        industry: 'General',
        preferences: {
          communicationStyle: 'professional',
          responseLength: 'detailed',
          tone: 'professional'
        },
        history: {
          previousInteractions: 0,
          successfulTasks: [],
          preferredModels: []
        },
        aiScore: 50
      });
      
      setAvailableModels(allModels);
      onModelSelected?.(optimalModel);
    } catch (error) {
      console.error('Error selecting model:', error);
    } finally {
      setIsSelecting(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return <Brain className="w-4 h-4" />;
      case 'gemini': return <Zap className="w-4 h-4" />;
      case 'gemma': return <Star className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai': return 'text-green-500';
      case 'gemini': return 'text-blue-500';
      case 'gemma': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (compact) {
    return (
      <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        {isSelecting ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Selecting optimal model...
            </span>
          </div>
        ) : selectedModel ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={getProviderColor(selectedModel.provider)}>
                {getProviderIcon(selectedModel.provider)}
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {selectedModel.model}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedModel.speed}/10
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-gray-400" />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedModel.accuracy}/10
                </span>
              </div>
            </div>
          </div>
        ) : (
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No model selected
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Model Selection
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Intelligent model selection for optimal performance
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs text-white ${getComplexityColor(complexity)}`}>
            {complexity}
          </div>
          <div className={`px-2 py-1 rounded-full text-xs text-white ${getUrgencyColor(urgency)}`}>
            {urgency}
          </div>
        </div>
      </div>

      {/* Task Information */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Task Type
          </span>
          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {taskType.replace('-', ' ')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Requirements
          </span>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-blue-500" />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {complexity} complexity, {urgency} urgency
            </span>
          </div>
        </div>
      </div>

      {/* Selected Model */}
      {selectedModel && (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={getProviderColor(selectedModel.provider)}>
                {getProviderIcon(selectedModel.provider)}
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Selected Model
              </span>
            </div>
            <div className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">
              Optimal
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Model
              </span>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {selectedModel.model}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Provider
              </span>
              <span className={`text-sm font-medium ${getProviderColor(selectedModel.provider)}`}>
                {selectedModel.provider}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Performance
              </span>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Speed: {selectedModel.speed}/10
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-gray-400" />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Accuracy: {selectedModel.accuracy}/10
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-gray-400" />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Cost: {selectedModel.costEfficiency}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Recommendations */}
      {showRecommendations && availableModels.length > 0 && (
        <div>
          <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
            Alternative Models
          </h4>
          <div className="space-y-2">
            {availableModels.slice(0, 3).map((model, index) => (
              <div
                key={model.model}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  selectedModel?.model === model.model
                    ? isDark ? 'bg-blue-900/50 border border-blue-500' : 'bg-blue-50 border border-blue-200'
                    : isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={getProviderColor(model.provider)}>
                    {getProviderIcon(model.provider)}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {model.model}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {model.provider}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Activity className="w-3 h-3 text-gray-400" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {model.accuracy}/10
                    </span>
                  </div>
                  {index === 0 && selectedModel?.model === model.model && (
                    <div className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      Selected
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIModelSelector;