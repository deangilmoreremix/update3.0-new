import React, { memo, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Deal } from '../../types';

interface VirtualDealListProps {
  deals: Deal[];
  selectedDealId?: string;
  onDealSelect?: (deal: Deal) => void;
  onDealAnalyze?: (deal: Deal) => void;
  height?: number;
  width?: number | string;
  itemHeight?: number;
  className?: string;
}

interface ListItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    deals: Deal[];
    selectedDealId?: string;
    onDealSelect?: (deal: Deal) => void;
    onDealAnalyze?: (deal: Deal) => void;
  };
}

// Memoized Virtual Deal List Item Renderer
const VirtualDealItem = memo<ListItemProps>(({ index, style, data }) => {
  const deal = data.deals[index];
  
  if (!deal) {
    return (
      <div style={style} className="p-4">
        <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
      </div>
    );
  }

  const handleClick = () => {
    data.onDealSelect?.(deal);
  };

  const handleAnalyze = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onDealAnalyze?.(deal);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageBadgeColor = (stage: string) => {
    const colors: Record<string, string> = {
      'qualification': 'bg-blue-100 text-blue-700',
      'initial': 'bg-purple-100 text-purple-700',
      'proposal': 'bg-indigo-100 text-indigo-700',
      'negotiation': 'bg-orange-100 text-orange-700',
      'closed-won': 'bg-green-100 text-green-700',
      'closed-lost': 'bg-red-100 text-red-700'
    };
    return colors[stage] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityBadgeColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-red-100 text-red-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-green-100 text-green-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const isSelected = deal.id === data.selectedDealId;

  return (
    <div style={style} className="px-4 py-2">
      <div
        onClick={handleClick}
        className={`
          bg-white rounded-lg shadow-sm border transition-all hover:shadow-md cursor-pointer p-4
          ${isSelected 
            ? 'border-blue-500 bg-blue-50 shadow-md' 
            : 'border-gray-200 hover:border-blue-300'
          }
        `}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">{deal.title}</h3>
            
            <div className="flex flex-wrap gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${getStageBadgeColor(deal.stage)}`}>
                {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1).replace('-', ' ')}
              </span>
              
              <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadgeColor(deal.priority || '')}`}>
                🚩 {deal.priority || 'Normal'}
              </span>
            </div>
            
            <div className="mt-3 space-y-1">
              <div className="flex items-center text-sm">
                <span className="text-gray-400 mr-2">💰</span>
                <span className="text-gray-800 font-medium">{formatCurrency(deal.value)}</span>
              </div>
              
              {deal.expectedCloseDate && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-400 mr-2">�</span>
                  <span className="text-gray-600">
                    {new Date(deal.expectedCloseDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              {deal.contactId && (
                <div className="flex items-center text-sm">
                  <span className="text-gray-400 mr-2">�</span>
                  <span className="text-gray-600 truncate">Contact ID: {deal.contactId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-end space-y-2 ml-4">
            {data.onDealAnalyze && (
              <button
                onClick={handleAnalyze}
                className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
                title="Analyze deal with AI"
              >
                🧠 Analyze
              </button>
            )}

            {/* Win Probability Display */}
            <div className="text-right">
              <div className="text-xs text-gray-500">Win Probability</div>
              <div className={`text-sm font-semibold ${
                (deal.probability || 0) >= 70 ? 'text-green-600' :
                (deal.probability || 0) >= 40 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {deal.probability || 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
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
                deal.stage === 'negotiation' ? 'bg-orange-500' :
                deal.stage === 'proposal' ? 'bg-indigo-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.max(deal.probability || 0, 10)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualDealItem.displayName = 'VirtualDealItem';

// Virtual Deal List Component with React Window
const VirtualDealList = memo<VirtualDealListProps>(({
  deals,
  selectedDealId,
  onDealSelect,
  onDealAnalyze,
  height = 600,
  width = '100%',
  itemHeight = 160,
  className = ''
}) => {
  // Memoized data for virtual list
  const listData = useMemo(() => ({
    deals,
    selectedDealId,
    onDealSelect,
    onDealAnalyze
  }), [deals, selectedDealId, onDealSelect, onDealAnalyze]);

  // Memoized item key getter for better performance
  const getItemKey = useCallback((index: number) => {
    return deals[index]?.id || index;
  }, [deals]);

  if (deals.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600">No deals found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      <List
        height={height}
        width={width}
        itemCount={deals.length}
        itemSize={itemHeight}
        itemData={listData}
        itemKey={getItemKey}
        overscanCount={3} // Render 3 extra items for smooth scrolling
      >
        {VirtualDealItem}
      </List>
    </div>
  );
});

VirtualDealList.displayName = 'VirtualDealList';

export default VirtualDealList;
