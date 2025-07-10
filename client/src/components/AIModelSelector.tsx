import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Brain, ChevronDown, Check } from 'lucide-react';

interface AIModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  className?: string;
}

const AIModelSelector: React.FC<AIModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  className = ''
}) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const models = [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      description: 'Most capable model for complex tasks',
      cost: 'High',
      speed: 'Fast'
    },
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      provider: 'Google AI',
      description: 'Optimized for speed and efficiency',
      cost: 'Medium',
      speed: 'Very Fast'
    },
    {
      id: 'claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      description: 'Fast and cost-effective',
      cost: 'Low',
      speed: 'Fast'
    },
    {
      id: 'gemma-2-27b',
      name: 'Gemma 2 27B',
      provider: 'Google',
      description: 'Open source, locally hosted',
      cost: 'Free',
      speed: 'Medium'
    }
  ];

  const selectedModelData = models.find(m => m.id === selectedModel) || models[0];

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'High':
        return isDark ? 'text-red-400' : 'text-red-600';
      case 'Medium':
        return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'Low':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'Free':
        return isDark ? 'text-blue-400' : 'text-blue-600';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full p-3 rounded-lg border transition-all duration-200 flex items-center justify-between
          ${isDark 
            ? 'bg-white/10 border-white/20 hover:bg-white/20' 
            : 'bg-white border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        <div className="flex items-center space-x-3">
          <Brain className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <div className="text-left">
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedModelData.name}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {selectedModelData.provider} • {selectedModelData.speed}
            </p>
          </div>
        </div>
        
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`} />
      </button>

      {isOpen && (
        <div className={`
          absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-lg z-50 max-h-64 overflow-y-auto
          ${isDark ? 'bg-gray-800 border-white/20' : 'bg-white border-gray-200'}
        `}>
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
              className={`
                w-full p-3 text-left transition-colors border-b last:border-b-0
                ${isDark 
                  ? 'hover:bg-white/10 border-white/10' 
                  : 'hover:bg-gray-50 border-gray-100'
                }
                ${selectedModel === model.id 
                  ? (isDark ? 'bg-blue-500/20' : 'bg-blue-50') 
                  : ''
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {model.name}
                    </p>
                    {selectedModel === model.id && (
                      <Check className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    )}
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    {model.description}
                  </p>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                      {model.provider}
                    </span>
                    <span className={getCostColor(model.cost)}>
                      {model.cost} cost
                    </span>
                    <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                      {model.speed}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIModelSelector;