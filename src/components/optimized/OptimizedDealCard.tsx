import React, { useState, memo, useCallback, useMemo } from 'react';
import { Deal } from '../../types';
import { 
  DollarSign, 
  Calendar, 
  User, 
  Building, 
  Flag,
  Brain,
  RefreshCw
} from 'lucide-react';

interface OptimizedDealCardProps {
  deal: Deal;
  onClick?: (deal: Deal) => void;
  onAnalyze?: (deal: Deal) => void;
  showAnalyzeButton?: boolean;
  isSelected?: boolean;
}

// Memoized helper functions for formatting
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date?: Date): string => {
  if (!date) return 'No date set';
  
  const today = new Date();
  const dueDate = new Date(date);
  
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} days`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else if (diffDays < 7) {
    return `Due in ${diffDays} days`;
  }
  
  return date.toLocaleDateString();
};

const getStageBadgeColor = (stage: string): string => {
  const colors: Record<string, string> = {
    'qualification': 'bg-blue-100 text-blue-700',
    'proposal': 'bg-indigo-100 text-indigo-700',
    'negotiation': 'bg-purple-100 text-purple-700',
    'closed-won': 'bg-green-100 text-green-700',
    'closed-lost': 'bg-red-100 text-red-700'
  };
  return colors[stage] || 'bg-gray-100 text-gray-700';
};

const getPriorityBadgeColor = (priority?: string): string => {
  const colors: Record<string, string> = {
    'high': 'bg-red-100 text-red-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'low': 'bg-green-100 text-green-700'
  };
  return colors[priority || ''] || 'bg-gray-100 text-gray-700';
};

const getStageName = (stage: string): string => {
  const names: Record<string, string> = {
    'qualification': 'Qualification',
    'proposal': 'Proposal',
    'negotiation': 'Negotiation',
    'closed-won': 'Closed Won',
    'closed-lost': 'Closed Lost'
  };
  return names[stage] || stage;
};

// Memoized Deal Card Component for Performance
const OptimizedDealCard = memo<OptimizedDealCardProps>(({
  deal,
  onClick,
  onAnalyze,
  showAnalyzeButton = true,
  isSelected = false
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Memoized formatted values
  const formattedValue = useMemo(() => formatCurrency(deal.value), [deal.value]);
  const formattedDate = useMemo(() => formatDate(deal.expectedCloseDate), [deal.expectedCloseDate]);
  const stageBadgeColor = useMemo(() => getStageBadgeColor(deal.stage), [deal.stage]);
  const priorityBadgeColor = useMemo(() => getPriorityBadgeColor(deal.priority), [deal.priority]);
  const stageName = useMemo(() => getStageName(deal.stage), [deal.stage]);

  // Memoized click handlers
  const handleCardClick = useCallback(() => {
    onClick?.(deal);
  }, [onClick, deal]);

  const handleAnalyzeClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnalyzing(true);
    
    try {
      await onAnalyze?.(deal);
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAnalyze, deal]);

  // Memoized date styling
  const dateStyle = useMemo(() => {
    if (!deal.expectedCloseDate) return 'text-gray-600';
    return deal.expectedCloseDate < new Date() ? 'text-red-600 font-medium' : 'text-gray-600';
  }, [deal.expectedCloseDate]);

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm border transition-all hover:shadow-md cursor-pointer p-4
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-blue-300'
        }
      `}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">{deal.title}</h3>
          
          <div className="flex flex-wrap gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${stageBadgeColor}`}>
              {stageName}
            </span>
            
            {deal.priority && (
              <span className={`text-xs px-2 py-0.5 rounded-full flex items-center ${priorityBadgeColor}`}>
                <Flag size={10} className="mr-1" />
                {deal.priority}
              </span>
            )}
          </div>
          
          <div className="mt-3 space-y-1">
            <div className="flex items-center text-sm">
              <Building size={16} className="text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 truncate">{deal.company}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <User size={16} className="text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 truncate">{deal.contact}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <DollarSign size={16} className="text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-800 font-medium">{formattedValue}</span>
            </div>
            
            {deal.expectedCloseDate && (
              <div className="flex items-center text-sm">
                <Calendar size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                <span className={dateStyle}>
                  {formattedDate}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-end space-y-2 ml-4">
          {showAnalyzeButton && onAnalyze && (
            <button
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing}
              className={`
                flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${isAnalyzing 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }
              `}
              title="Analyze deal with AI"
            >
              {isAnalyzing ? (
                <RefreshCw size={14} className="mr-1 animate-spin" />
              ) : (
                <Brain size={14} className="mr-1" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          )}

          {/* Win Probability Display */}
          {deal.probability !== undefined && (
            <div className="text-right">
              <div className="text-xs text-gray-500">Win Probability</div>
              <div className={`text-sm font-semibold ${
                deal.probability >= 70 ? 'text-green-600' :
                deal.probability >= 40 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {deal.probability}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar for Deal Stage */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Deal Progress</span>
          <span>{deal.probability || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              deal.stage === 'closed-won' ? 'bg-green-500' :
              deal.stage === 'closed-lost' ? 'bg-red-500' :
              deal.stage === 'negotiation' ? 'bg-purple-500' :
              deal.stage === 'proposal' ? 'bg-indigo-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.max(deal.probability || 0, 10)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
});

OptimizedDealCard.displayName = 'OptimizedDealCard';

export default OptimizedDealCard;
