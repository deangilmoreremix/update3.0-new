import React, { useState, useEffect } from 'react';
import { AIGoal } from '../../data/aiGoals';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  Zap, 
  Play,
  Eye,
  CheckCircle,
  Loader,
  Star,
  Target,
  Shield,
  Brain,
  Activity,
  Bot,
  Settings,
  Sparkles,
  FileText,
  BarChart3,
  Lightbulb,
  DollarSign,
  Award,
  Network,
  ExternalLink
} from 'lucide-react';

interface InteractiveGoalCardProps {
  goal: AIGoal;
  onExecute: (goal: AIGoal) => void;
  isExecuting?: boolean;
  executionProgress?: number;
  realMode?: boolean;
}

const InteractiveGoalCard: React.FC<InteractiveGoalCardProps> = ({
  goal,
  onExecute,
  isExecuting = false,
  executionProgress = 0,
  realMode = false
}) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'green';
      case 'Intermediate': return 'yellow';
      case 'Advanced': return 'red';
      default: return 'gray';
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return <Zap className="h-4 w-4" />;
      case 'Intermediate': return <Target className="h-4 w-4" />;
      case 'Advanced': return <Star className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sales': return 'text-blue-400 bg-blue-500/20';
      case 'marketing': return 'text-purple-400 bg-purple-500/20';
      case 'relationship': return 'text-green-400 bg-green-500/20';
      case 'automation': return 'text-orange-400 bg-orange-500/20';
      case 'analytics': return 'text-teal-400 bg-teal-500/20';
      case 'content': return 'text-yellow-400 bg-yellow-500/20';
      case 'admin': return 'text-indigo-400 bg-indigo-500/20';
      case 'ai-native': return 'text-pink-400 bg-pink-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    estimatedValue: Math.floor(Math.random() * 50000) + 10000,
    timeToComplete: Math.floor(Math.random() * 30) + 5,
    confidence: Math.floor(Math.random() * 20) + 80
  });

  // Simulate live metrics updates
  useEffect(() => {
    if (isExecuting) {
      const interval = setInterval(() => {
        setLiveMetrics(prev => ({
          ...prev,
          estimatedValue: prev.estimatedValue + Math.floor(Math.random() * 1000),
          timeToComplete: Math.max(1, prev.timeToComplete - 1),
          confidence: Math.min(99, prev.confidence + Math.floor(Math.random() * 3))
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isExecuting]);

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-500 transform ${
        isHovered ? 'scale-105 z-10' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onExecute(goal)}
    >
      {/* Main Goal Card */}
      <div className={`relative p-6 rounded-2xl border backdrop-blur-xl transition-all duration-500 overflow-hidden ${
        isExecuting 
          ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-400 shadow-lg'
          : isHovered
          ? 'bg-gradient-to-br from-white to-blue-50 border-blue-400 shadow-xl'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-sm'
      }`}>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute inset-0 transition-all duration-1000 ${
            isHovered ? 'scale-110 rotate-1' : 'scale-100'
          }`} style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Header */}
        <div className="relative z-10 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                goal.complexity === 'Advanced' ? 'bg-red-100 text-red-700 border-red-300' :
                goal.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                goal.complexity === 'Simple' ? 'bg-green-100 text-green-700 border-green-300' :
                'bg-gray-100 text-gray-700 border-gray-300'
              }`}>
                {goal.complexity}
              </span>
              <div className="text-gray-600">{getComplexityIcon(goal.complexity)}</div>
            </div>
            {isExecuting && (
              <div className="p-2 bg-green-500 rounded-full text-white shadow-lg animate-pulse">
                <Loader className="w-4 h-4 animate-spin" />
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {goal.title}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {goal.description}
          </p>
        </div>

        {/* Live Metrics Dashboard */}
        <div className="relative z-10 mb-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-white/80 rounded-lg border border-gray-200/80">
              <div className="text-xs text-gray-500 mb-1">Category</div>
              <div className={`text-xs font-bold px-2 py-1 rounded-full ${getCategoryColor(goal.category)}`}>
                {goal.category}
              </div>
            </div>
            <div className="text-center p-2 bg-white/80 rounded-lg border border-gray-200/80">
              <div className="text-xs text-gray-500 mb-1">Time</div>
              <div className="text-xs font-bold text-blue-600">{goal.estimatedTime}</div>
            </div>
            <div className="text-center p-2 bg-white/80 rounded-lg border border-gray-200/80">
              <div className="text-xs text-gray-500 mb-1">Value</div>
              <div className="text-xs font-bold text-green-600">${liveMetrics.estimatedValue.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="relative z-10 space-y-3">
          {/* Primary Action Button */}
          <button 
            className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              isExecuting
                ? 'bg-green-600 text-white shadow-md cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (!isExecuting) {
                onExecute(goal);
              }
            }}
            disabled={isExecuting}
          >
            {isExecuting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Executing... {Math.round(executionProgress)}%
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Execute Goal
              </span>
            )}
          </button>

          {/* Secondary Actions */}
          <div className="flex gap-2">
            <button 
              className="flex-1 py-2 px-3 text-xs bg-white/80 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
            >
              <Eye className="w-3 h-3 inline mr-1" />
              {showDetails ? 'Hide' : 'Details'}
            </button>
            <button 
              className="flex-1 py-2 px-3 text-xs bg-white/80 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3 inline mr-1" />
              Learn More
            </button>
          </div>
        </div>

        {/* Progress Indicator for Execution */}
        {isExecuting && (
          <div className="relative z-10 mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${executionProgress}%` }}
              />
            </div>
            <div className="text-xs text-center text-gray-600 mt-1">
              {realMode ? 'Live Execution' : 'Demo Mode'} - {Math.round(executionProgress)}%
            </div>
          </div>
        )}

        {/* Enhanced Details Panel */}
        {showDetails && (
          <div className="relative z-10 mt-4 p-4 bg-white/90 rounded-lg border border-gray-200">
            <div className="space-y-3">
              {/* Goal Requirements */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-blue-600" />
                  Recommended For
                </h4>
                <div className="flex flex-wrap gap-1">
                  {goal.recommendedFor.map((type, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tool Mapping */}
              {goal.toolMapping && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Bot className="h-4 w-4 text-purple-600" />
                    Mapped Tool
                  </h4>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full border border-purple-200">
                    {goal.toolMapping}
                  </span>
                </div>
              )}

              {/* Live Metrics */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  Live Metrics
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-green-50 p-2 rounded border border-green-200">
                    <div className="text-green-600 font-medium">Confidence</div>
                    <div className="text-green-800">{liveMetrics.confidence}%</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <div className="text-blue-600 font-medium">Time Left</div>
                    <div className="text-blue-800">{liveMetrics.timeToComplete}m</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        {isHovered && !isExecuting && (
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent pointer-events-none rounded-xl" />
        )}

        {/* Execution Overlay */}
        {isExecuting && (
          <div className="absolute inset-0 bg-gradient-to-t from-green-600/5 to-transparent pointer-events-none rounded-xl" />
        )}

        {/* Sparkle Animation for Interactive Effects */}
        {(isHovered || isExecuting) && (
          <div className="absolute top-4 right-4 animate-bounce">
            <Sparkles className={`h-5 w-5 ${isExecuting ? 'text-green-500' : 'text-blue-500'}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveGoalCard;