import React, { useState, useEffect } from 'react';
import { Brain, User, Settings, TrendingUp, Zap, Star, Activity, Target, Clock, Shield } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { intelligentModelSelector, CustomerProfile, ModelCapability } from '../../services/ai/intelligentModelSelector';

interface CustomerProfileAIProps {
  customerId: string;
  onProfileUpdate?: (profile: CustomerProfile) => void;
  showRecommendations?: boolean;
  compact?: boolean;
}

const CustomerProfileAI: React.FC<CustomerProfileAIProps> = ({
  customerId,
  onProfileUpdate,
  showRecommendations = true,
  compact = false
}) => {
  const { isDark } = useTheme();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [recommendations, setRecommendations] = useState<ModelCapability[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerProfile();
  }, [customerId]);

  const loadCustomerProfile = async () => {
    setLoading(true);
    try {
      // Simulate loading customer profile (in real app, this would fetch from API)
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
      
      setProfile(mockProfile);
      
      if (showRecommendations) {
        const modelRecs = intelligentModelSelector.getModelRecommendations(mockProfile);
        setRecommendations(modelRecs);
      }
    } catch (error) {
      console.error('Error loading customer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updates: Partial<CustomerProfile>) => {
    if (!profile) return;
    
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    onProfileUpdate?.(updatedProfile);
    
    // Update recommendations
    if (showRecommendations) {
      const modelRecs = intelligentModelSelector.getModelRecommendations(updatedProfile);
      setRecommendations(modelRecs);
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

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return <Brain className="w-4 h-4" />;
      case 'gemini': return <Zap className="w-4 h-4" />;
      case 'gemma': return <Star className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className={`${compact ? 'p-4' : 'p-6'} ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className={`${compact ? 'p-4' : 'p-6'} ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {profile.name}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {profile.industry}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Activity className="w-4 h-4 text-green-500" />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {profile.aiScore}
            </span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-blue-500" />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Interactions
            </span>
          </div>
          <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {profile.history.previousInteractions}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Success Rate
            </span>
          </div>
          <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {Math.round((profile.history.successfulTasks.length / profile.history.previousInteractions) * 100)}%
          </p>
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-4">
        <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          AI Preferences
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Communication
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {profile.preferences.communicationStyle}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Response Length
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {profile.preferences.responseLength}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Tone
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {profile.preferences.tone}
            </span>
          </div>
        </div>
      </div>

      {/* Model Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <div>
          <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Recommended AI Models
          </h4>
          <div className="space-y-2">
            {recommendations.map((model, index) => (
              <div
                key={model.model}
                className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex items-center space-x-2">
                  <div className={getProviderColor(model.provider)}>
                    {getProviderIcon(model.provider)}
                  </div>
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {model.model}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {model.speed}/10
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-gray-400" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {model.accuracy}/10
                    </span>
                  </div>
                  {index === 0 && (
                    <div className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      Best
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

export default CustomerProfileAI;