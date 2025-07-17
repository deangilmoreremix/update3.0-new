import React, { memo, useMemo, useCallback, useState } from 'react';
import { Search, Filter, SortAsc, SortDesc, Plus, DollarSign } from 'lucide-react';
import OptimizedDealCard from './OptimizedDealCard';
import { Deal } from '../../types';

interface OptimizedDealListProps {
  deals: Deal[];
  selectedDealId?: string;
  onDealSelect?: (deal: Deal) => void;
  onDealAnalyze?: (deal: Deal) => void;
  onDealAdd?: () => void;
  isLoading?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

type SortField = 'title' | 'value' | 'probability' | 'expectedCloseDate' | 'company' | 'stage';
type SortDirection = 'asc' | 'desc';

// Memoized Deal List Container with Optimized Filtering and Sorting
const OptimizedDealList = memo<OptimizedDealListProps>(({
  deals,
  selectedDealId,
  onDealSelect,
  onDealAnalyze,
  onDealAdd,
  isLoading = false,
  searchTerm = '',
  onSearchChange
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [sortField, setSortField] = useState<SortField>('expectedCloseDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Memoized search and filter logic
  const filteredAndSortedDeals = useMemo(() => {
    let filtered = deals;

    // Apply search filter
    const searchQuery = (onSearchChange ? searchTerm : localSearchTerm).toLowerCase();
    if (searchQuery) {
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(searchQuery) ||
        deal.company.toLowerCase().includes(searchQuery) ||
        deal.contact.toLowerCase().includes(searchQuery) ||
        deal.notes?.toLowerCase().includes(searchQuery) ||
        deal.nextSteps?.some(step => step.toLowerCase().includes(searchQuery))
      );
    }

    // Apply stage filter
    if (stageFilter !== 'all') {
      filtered = filtered.filter(deal => deal.stage === stageFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(deal => deal.priority === priorityFilter);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'value':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'probability':
          aValue = a.probability;
          bValue = b.probability;
          break;
        case 'expectedCloseDate':
          aValue = a.expectedCloseDate ? new Date(a.expectedCloseDate).getTime() : 0;
          bValue = b.expectedCloseDate ? new Date(b.expectedCloseDate).getTime() : 0;
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'stage':
          aValue = a.stage;
          bValue = b.stage;
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [deals, searchTerm, localSearchTerm, stageFilter, priorityFilter, sortField, sortDirection, onSearchChange]);

  // Memoized total value calculation
  const totalValue = useMemo(() => {
    return filteredAndSortedDeals.reduce((sum, deal) => sum + deal.value, 0);
  }, [filteredAndSortedDeals]);

  const averageProbability = useMemo(() => {
    if (filteredAndSortedDeals.length === 0) return 0;
    const total = filteredAndSortedDeals.reduce((sum, deal) => sum + deal.probability, 0);
    return Math.round(total / filteredAndSortedDeals.length);
  }, [filteredAndSortedDeals]);

  // Memoized handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setLocalSearchTerm(value);
    }
  }, [onSearchChange]);

  const handleSortChange = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleStageFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStageFilter(e.target.value);
  }, []);

  const handlePriorityFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriorityFilter(e.target.value);
  }, []);

  // Memoized deal select handler
  const handleDealSelect = useCallback((deal: Deal) => {
    onDealSelect?.(deal);
  }, [onDealSelect]);

  // Memoized deal analyze handler
  const handleDealAnalyze = useCallback((deal: Deal) => {
    onDealAnalyze?.(deal);
  }, [onDealAnalyze]);

  // Memoized filter options
  const stageOptions = useMemo(() => [
    { value: 'all', label: 'All Stages' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'initial', label: 'Initial' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
  ], []);

  const priorityOptions = useMemo(() => [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ], []);

  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Deals ({filteredAndSortedDeals.length})
            </h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Total Value: {formatCurrency(totalValue)}
              </div>
              <div>
                Avg. Probability: {averageProbability}%
              </div>
            </div>
          </div>
          {onDealAdd && (
            <button
              onClick={onDealAdd}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Deal
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
              value={onSearchChange ? searchTerm : localSearchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Stage Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={stageFilter}
              onChange={handleStageFilterChange}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-32"
            >
              {stageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={handlePriorityFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-32"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-sm text-gray-600">Sort by:</span>
          {(['title', 'value', 'probability', 'expectedCloseDate', 'company'] as SortField[]).map((field) => (
            <button
              key={field}
              onClick={() => handleSortChange(field)}
              className={`
                flex items-center px-3 py-1 rounded-md text-sm transition-colors
                ${sortField === field 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {field === 'expectedCloseDate' ? 'Close Date' : 
               field.charAt(0).toUpperCase() + field.slice(1)}
              {sortField === field && (
                sortDirection === 'asc' 
                  ? <SortAsc className="w-3 h-3 ml-1" />
                  : <SortDesc className="w-3 h-3 ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Deal List */}
      <div className="p-4">
        {filteredAndSortedDeals.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-600">No deals found</p>
            {(searchTerm || localSearchTerm) && (
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search or filters
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedDeals.map((deal) => (
              <OptimizedDealCard
                key={deal.id}
                deal={deal}
                isSelected={deal.id === selectedDealId}
                onClick={handleDealSelect}
                onAnalyze={onDealAnalyze ? handleDealAnalyze : undefined}
                showAnalyzeButton={!!onDealAnalyze}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

OptimizedDealList.displayName = 'OptimizedDealList';

export default OptimizedDealList;
