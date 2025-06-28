import React, { useState } from 'react';
import { Goal } from '@/types/goals';
import { 
  Play,
  Clock,
  TrendingUp,
  Users,
  Bot,
  Zap,
  Shield,
  Target,
  ChevronDown,
  ChevronUp,
  Star,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Activity
} from 'lucide-react';

interface InteractiveGoalCardProps {
  goal: Goal;
  onExecute: (goal: Goal) => void;
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'High':
        return 'from-red-500 to-red-600';
      case 'Medium':
        return 'from-yellow-500 to-yellow-600';
      case 'Low':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getComplexityColor = (complexity: string): string => {
    switch (complexity) {
      case 'Simple':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string): string => {
    const colorMap: { [key: string]: string } = {
      'Sales': 'bg-blue-100 text-blue-800',
      'Marketing': 'bg-purple-100 text-purple-800',
      'Relationship': 'bg-green-100 text-green-800',
      'Automation': 'bg-orange-100 text-orange-800',
      'Analytics': 'bg-teal-100 text-teal-800',
      'Content': 'bg-yellow-100 text-yellow-800',
      'Admin': 'bg-indigo-100 text-indigo-800',
      'AI-Native': 'bg-pink-100 text-pink-800'
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div 
      className={`relative bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 ${
        isHovering ? 'shadow-lg' : 'shadow-sm'
      } ${isExecuting ? 'ring-2 ring-blue-500' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Progress Bar (when executing) */}
      {isExecuting && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${executionProgress}%` }}
          />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                {goal.category}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                goal.priority === 'High' ? 'bg-red-100 text-red-700' :
                goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {goal.priority}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {goal.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3">
              {goal.description}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{goal.estimatedSetupTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Bot className="h-4 w-4" />
            <span>{goal.agentsRequired.length} agents</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span className="text-green-600 font-medium">{goal.roi}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span className={`font-medium ${getComplexityColor(goal.complexity)}`}>
              {goal.complexity}
            </span>
          </div>
        </div>

        {/* Business Impact Preview */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-blue-900 mb-1">Business Impact</div>
              <div className="text-sm text-blue-800 line-clamp-2">
                {goal.businessImpact}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 mb-4 animate-fadeIn">
            {/* Real World Example */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Real World Example
              </h4>
              <p className="text-sm text-gray-700">{goal.realWorldExample}</p>
            </div>

            {/* Required Agents */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                AI Agents Required
              </h4>
              <div className="flex flex-wrap gap-2">
                {goal.agentsRequired.map((agent, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {agent}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools Needed */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                Tools & Integrations
              </h4>
              <div className="flex flex-wrap gap-2">
                {goal.toolsNeeded.map((tool, index) => (
                  <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            {goal.prerequisite && goal.prerequisite.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  Prerequisites
                </h4>
                <ul className="space-y-1">
                  {goal.prerequisite.map((req, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success Metrics */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                Success Metrics
              </h4>
              <div className="space-y-2">
                {goal.successMetrics.map((metric, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show Details
              </>
            )}
          </button>

          <button
            onClick={() => onExecute(goal)}
            disabled={isExecuting}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              isExecuting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : realMode
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
            }`}
          >
            {isExecuting ? (
              <>
                <Activity className="h-4 w-4 animate-spin" />
                {Math.round(executionProgress)}%
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {realMode ? 'Execute Goal' : 'Start Demo'}
              </>
            )}
          </button>
        </div>

        {/* Execution Status */}
        {isExecuting && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Activity className="h-4 w-4 animate-spin" />
              <span className="font-medium">
                {realMode ? 'Executing real goal...' : 'Running demo simulation...'}
              </span>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              AI agents are working on your goal. Check the execution modal for details.
            </div>
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      {isHovering && !isExecuting && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />
      )}

      {/* Priority Indicator */}
      <div className={`absolute top-0 right-0 w-3 h-3 bg-gradient-to-br ${getPriorityColor(goal.priority)} rounded-bl-lg`} />
    </div>
  );
};

export default InteractiveGoalCard;