import React, { useState } from 'react';
import { X, Key, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useApiStore } from '../../store/apiStore';
import { ModernButton } from '../ui/ModernButton';
import { GlassCard } from '../ui/GlassCard';

interface ApiConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConfigurationModal: React.FC<ApiConfigurationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { apiKeys, setOpenAiKey, setGeminiKey } = useApiStore();
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [tempOpenAIKey, setTempOpenAIKey] = useState(apiKeys.openai);
  const [tempGeminiKey, setTempGeminiKey] = useState(apiKeys.gemini);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    openai?: 'valid' | 'invalid' | 'testing';
    gemini?: 'valid' | 'invalid' | 'testing';
  }>({});

  if (!isOpen) return null;

  const validateOpenAIKey = async (key: string) => {
    if (!key.trim()) return false;
    
    setValidationStatus(prev => ({ ...prev, openai: 'testing' }));
    
    try {
      // Test API key with a simple request
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
      
      const isValid = response.ok;
      setValidationStatus(prev => ({ ...prev, openai: isValid ? 'valid' : 'invalid' }));
      return isValid;
    } catch (error) {
      setValidationStatus(prev => ({ ...prev, openai: 'invalid' }));
      return false;
    }
  };

  const validateGeminiKey = async (key: string) => {
    if (!key.trim()) return false;
    
    setValidationStatus(prev => ({ ...prev, gemini: 'testing' }));
    
    try {
      // Test Gemini API key
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      const isValid = response.ok;
      setValidationStatus(prev => ({ ...prev, gemini: isValid ? 'valid' : 'invalid' }));
      return isValid;
    } catch (error) {
      setValidationStatus(prev => ({ ...prev, gemini: 'invalid' }));
      return false;
    }
  };

  const handleSave = async () => {
    setIsValidating(true);
    
    let openaiValid = true;
    let geminiValid = true;
    
    if (tempOpenAIKey.trim()) {
      openaiValid = await validateOpenAIKey(tempOpenAIKey);
    }
    
    if (tempGeminiKey.trim()) {
      geminiValid = await validateGeminiKey(tempGeminiKey);
    }
    
    if (openaiValid || geminiValid) {
      setOpenAiKey(tempOpenAIKey);
      setGeminiKey(tempGeminiKey);
      
      // Reload the page to refresh API connections
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    
    setIsValidating(false);
  };

  const getStatusIcon = (status?: 'valid' | 'invalid' | 'testing') => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'testing':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Key className="w-6 h-6 mr-2 text-blue-600" />
            AI API Configuration
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Setup Instructions</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Configure your AI API keys to enable contact enrichment, business analysis, and other AI features.
                </p>
              </div>
            </div>
          </div>

          {/* OpenAI Configuration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={showOpenAIKey ? 'text' : 'password'}
                value={tempOpenAIKey}
                onChange={(e) => setTempOpenAIKey(e.target.value)}
                placeholder="sk-proj-... or sk-..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {getStatusIcon(validationStatus.openai)}
                <button
                  type="button"
                  onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {showOpenAIKey ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Get your API key from{' '}
              <a 
                href="https://platform.openai.com/account/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                OpenAI Platform
              </a>
            </p>
          </div>

          {/* Gemini Configuration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Gemini API Key (Optional)
            </label>
            <div className="relative">
              <input
                type={showGeminiKey ? 'text' : 'password'}
                value={tempGeminiKey}
                onChange={(e) => setTempGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {getStatusIcon(validationStatus.gemini)}
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {showGeminiKey ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Get your API key from{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <ModernButton
            variant="ghost"
            onClick={onClose}
            disabled={isValidating}
          >
            Cancel
          </ModernButton>
          <ModernButton
            variant="primary"
            onClick={handleSave}
            loading={isValidating}
            disabled={!tempOpenAIKey.trim() && !tempGeminiKey.trim()}
          >
            Save & Test API Keys
          </ModernButton>
        </div>
      </GlassCard>
    </div>
  );
};

export default ApiConfigurationModal;