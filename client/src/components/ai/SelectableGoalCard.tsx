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
  ExternalLink,
  Check
} from 'lucide-react';

interface SelectableGoalCardProps {
  goal: AIGoal;
  isSelected: boolean;
  canSelect: boolean;
  onToggle: (goalId: string) => void;
}

const SelectableGoalCard: React.FC<SelectableGoalCardProps> = ({
  goal,
  isSelected,
  canSelect,
  onToggle
}) => {
  const getPriorityColor = (complexity: string) => {
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
    estimatedValue: parseInt(goal.roi.replace(/[^0-9]/g, '')) || 25000,
    timeToComplete: parseInt(goal.estimatedSetupTime.replace(/[^0-9]/g, '')) || 15,
    confidence: goal.priority === 'High' ? 95 : goal.priority === 'Medium' ? 85 : 75
  });

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-500 transform ${
        isHovered ? 'scale-105 z-10' : ''
      } ${isSelected ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-slate-900' : ''} ${
        !canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => (canSelect || isSelected) && onToggle(goal.id)}
    >
      {/* Main Goal Card */}
      <div className={`relative p-6 rounded-2xl border backdrop-blur-xl transition-all duration-500 overflow-hidden ${
        isSelected 
          ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-400 shadow-lg'
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

        {/* Selection Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
            <div className="h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-all duration-300" />
          </div>
        )}

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
            {isSelected && (
              <div className="p-2 bg-blue-500 rounded-full text-white shadow-lg animate-pulse">
                <Check className="w-4 h-4" />
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
              isSelected
                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                : canSelect
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (canSelect || isSelected) {
                onToggle(goal.id);
              }
            }}
          >
            {isSelected ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Selected
              </span>
            ) : canSelect ? (
              <span className="flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Select Goal
              </span>
            ) : (
              'Limit Reached'
            )}
          </button>

          {/* Secondary Actions */}
          <div className="flex gap-2">
            <button 
              className="flex-1 py-2 px-3 text-xs bg-white/80 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-3 h-3 inline mr-1" />
              Preview
            </button>
            <button 
              className="flex-1 py-2 px-3 text-xs bg-white/80 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3 inline mr-1" />
              Details
            </button>
          </div>
        </div>

        {/* Progress Indicator for Real Mode */}
        {isSelected && (
          <div className="relative z-10 mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: '100%' }}
              />
            </div>
            <div className="text-xs text-center text-gray-600 mt-1">Ready for Toolbar</div>
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
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        {isHovered && !isSelected && (
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent pointer-events-none rounded-xl" />
        )}

        {/* Selection Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent pointer-events-none rounded-xl" />
        )}

        {/* Sparkle Animation for Interactive Effects */}
        {(isHovered || isSelected) && (
          <div className="absolute top-4 right-4 animate-bounce">
            <Sparkles className={`h-5 w-5 ${isSelected ? 'text-blue-500' : 'text-purple-500'}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectableGoalCard;