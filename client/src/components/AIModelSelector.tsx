import React, { useState } from 'react';
import { 
  Brain, 
  Zap, 
  DollarSign, 
  Clock, 
  Info, 
  ChevronDown,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  AI_MODELS, 
  getModelsByCategory, 
  MODEL_CATEGORIES,
  AI_MODEL_RECOMMENDATIONS,
  type AIModel,
  type AIModelRecommendation 
} from '../services/aiModels';

interface AIModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  useCase?: AIModelRecommendation;
  showPricing?: boolean;
  showCapabilities?: boolean;
  className?: string;
}

const AIModelSelector: React.FC<AIModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  useCase,
  showPricing = true,
  showCapabilities = true,
  className = ''
}) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('recommended');

  // Get recommended models for the use case
  const recommendedModels = useCase ? AI_MODEL_RECOMMENDATIONS[useCase] : [];
  
  // Get models by category
  const categoryModels = getModelsByCategory(selectedCategory);
  
  // Get currently selected model details
  const currentModel = AI_MODELS[selectedModel];

  const formatPrice = (price: number) => {
    return price < 1 ? `$${price}` : `$${price.toFixed(2)}`;
  };

  const getModelBadge = (model: AIModel) => {
    if (recommendedModels.includes(model.id)) {
      return { text: 'Recommended', color: 'bg-green-500/20 text-green-400' };
    }
    if (model.recommended) {
      return { text: 'Popular', color: 'bg-blue-500/20 text-blue-400' };
    }
    if (model.family === 'gemma') {
      return { text: 'Lightweight', color: 'bg-orange-500/20 text-orange-400' };
    }
    return null;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Current Selection */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
          isDark 
            ? 'bg-white/5 border-white/10 hover:border-white/20 text-white' 
            : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            currentModel?.family === 'gemini' 
              ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600')
              : (isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600')
          }`}>
            <Brain size={16} />
          </div>
          <div className="text-left">
            <p className="font-medium">{currentModel?.name || 'Select Model'}</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentModel?.family} • {currentModel?.version}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {showPricing && currentModel && (
            <div className="text-right">
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatPrice(currentModel.pricing.input)}/1M tokens
              </p>
            </div>
          )}
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-lg z-50 ${
          isDark 
            ? 'bg-gray-800 border-white/10' 
            : 'bg-white border-gray-200'
        }`}>
          {/* Category Tabs */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1">
              {Object.entries(MODEL_CATEGORIES).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    selectedCategory === key
                      ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600')
                      : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Model List */}
          <div className="max-h-80 overflow-y-auto">
            {categoryModels.map((model) => {
              const badge = getModelBadge(model);
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                    selectedModel === model.id ? 'bg-blue-50 dark:bg-blue-500/10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        model.family === 'gemini' 
                          ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600')
                          : model.family === 'gemma'
                          ? (isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600')
                          : (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600')
                      }`}>
                        <Brain size={14} />
                      </div>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {model.name}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {model.description}
                        </p>
                      </div>
                    </div>
                    
                    {badge && (
                      <span className={`px-2 py-1 text-xs rounded-full ${badge.color}`}>
                        {badge.text}
                      </span>
                    )}
                  </div>

                  {(showPricing || showCapabilities) && (
                    <div className="flex items-center justify-between text-xs">
                      {showPricing && (
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <DollarSign size={12} className={isDark ? 'text-green-400' : 'text-green-600'} />
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                              {formatPrice(model.pricing.input)}/1M
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={12} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                              {model.maxTokens.toLocaleString()} tokens
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {showCapabilities && (
                        <div className="flex space-x-1">
                          {model.capabilities.slice(0, 2).map((cap, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded text-xs ${
                                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Use Case Recommendations */}
          {useCase && recommendedModels.length > 0 && (
            <div className={`p-3 border-t ${isDark ? 'border-gray-700 bg-blue-500/5' : 'border-gray-200 bg-blue-50'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Info size={14} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                <span className={`text-xs font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  Recommended for {useCase.replace('_', ' ')}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {recommendedModels.slice(0, 3).map((modelId) => {
                  const model = AI_MODELS[modelId];
                  return (
                    <button
                      key={modelId}
                      onClick={() => {
                        onModelChange(modelId);
                        setIsOpen(false);
                      }}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        selectedModel === modelId
                          ? (isDark ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white')
                          : (isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200')
                      }`}
                    >
                      {model?.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIModelSelector;