import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Search, Filter, Plus, BarChart3, Grid, List, Settings, Zap, TrendingUp } from 'lucide-react';
import { useDealStore } from '../store/dealStore';
// import { useGemini } from '../hooks/useGemini';

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  closeDate: string;
  contactId?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields for enhanced functionality
  contact?: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: Date;
  notes?: string;
  contactAvatar?: string;
  companyAvatar?: string;
  lastActivity?: string;
  tags?: string[];
  isFavorite?: boolean;
  customFields?: Record<string, string | number | boolean>;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  lastEnrichment?: {
    confidence: number;
    aiProvider?: string;
    timestamp?: Date;
  };
}

interface PipelineColumn {
  id: string;
  title: string;
  dealIds: string[];
  color: string;
}

interface PipelineStats {
  totalValue: number;
  totalDeals: number;
  averageDealSize: number;
  conversionRate: number;
  stageValues: Record<string, number>;
}

const Pipeline: React.FC = () => {
  const dealStore = useDealStore();
  
  // Extract deals from store (deals is a Record<string, Deal>)
  const deals = Object.values(dealStore.deals || {});
  const isLoading = dealStore.isLoading;
  const error = dealStore.error;
  // const { analyzeText } = useGemini();
  
  // Local state for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyzingDealId, setAnalyzingDealId] = useState<string | null>(null);

  // Remove the old columns state as we're using currentColumns now

  const columnOrder = ['discovery', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];

  // Fetch deals on mount
  useEffect(() => {
    if (dealStore.fetchDeals) {
      dealStore.fetchDeals();
    }
  }, [dealStore.fetchDeals]);

  // Calculate columns dynamically without useEffect
  const currentColumns = useMemo(() => {
    const baseColumns = {
      discovery: {
        id: 'discovery',
        title: 'Discovery',
        dealIds: [],
        color: '#3B82F6'
      },
      qualification: {
        id: 'qualification',
        title: 'Qualification',
        dealIds: [],
        color: '#F59E0B'
      },
      proposal: {
        id: 'proposal',
        title: 'Proposal',
        dealIds: [],
        color: '#8B5CF6'
      },
      negotiation: {
        id: 'negotiation',
        title: 'Negotiation',
        dealIds: [],
        color: '#F97316'
      },
      'closed-won': {
        id: 'closed-won',
        title: 'Closed Won',
        dealIds: [],
        color: '#10B981'
      },
      'closed-lost': {
        id: 'closed-lost',
        title: 'Closed Lost',
        dealIds: [],
        color: '#EF4444'
      }
    };

    // Add deals to their respective columns
    deals.forEach(deal => {
      if (baseColumns[deal.stage]) {
        baseColumns[deal.stage].dealIds.push(deal.id);
      }
    });

    return baseColumns;
  }, [deals]);

  // Filter deals based on search and filters
  const filteredDeals = useMemo(() => {
    let result = [...deals];

    // Apply search
    if (searchTerm.trim()) {
      result = result.filter(deal =>
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.contact.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply advanced filters
    activeFilters.forEach(filter => {
      result = result.filter(deal => {
        switch (filter.field) {
          case 'value':
            switch (filter.operator) {
              case 'gt': return deal.value > filter.value;
              case 'lt': return deal.value < filter.value;
              case 'eq': return deal.value === filter.value;
              case 'gte': return deal.value >= filter.value;
              case 'lte': return deal.value <= filter.value;
              default: return true;
            }
          case 'probability':
            switch (filter.operator) {
              case 'gt': return deal.probability > filter.value;
              case 'lt': return deal.probability < filter.value;
              case 'eq': return deal.probability === filter.value;
              case 'gte': return deal.probability >= filter.value;
              case 'lte': return deal.probability <= filter.value;
              default: return true;
            }
          case 'stage':
            return filter.operator === 'equals' ? deal.stage === filter.value : deal.stage !== filter.value;
          case 'priority':
            return filter.operator === 'equals' ? deal.priority === filter.value : deal.priority !== filter.value;
          default:
            return true;
        }
      });
    });

    return result;
  }, [deals, searchTerm, activeFilters]);

  // Get deals for a specific column
  const getDealsForColumn = (columnId: string): Deal[] => {
    return filteredDeals.filter(deal => deal.stage === columnId);
  };

  // Calculate pipeline stats
  const pipelineStats = useMemo((): PipelineStats => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const totalDeals = deals.length;
    const averageDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
    const avgProbability = totalDeals > 0 ? deals.reduce((sum, deal) => sum + deal.probability, 0) / totalDeals : 0;
    
    const stageValues = columnOrder.reduce((acc, stage) => {
      acc[stage] = deals.filter(deal => deal.stage === stage).reduce((sum, deal) => sum + deal.value, 0);
      return acc;
    }, {} as Record<string, number>);

    return {
      totalValue,
      totalDeals,
      averageDealSize,
      conversionRate: avgProbability,
      stageValues
    };
  }, [deals]);

  // Handle drag and drop
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // If dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the deal being moved
    const deal = deals.find(d => d.id === draggableId);
    if (!deal) return;

    // Update the deal's stage using the store method
    try {
      if (dealStore.moveDealToStage) {
        dealStore.moveDealToStage(deal.id, destination.droppableId);
      } else if (dealStore.updateDeal) {
        dealStore.updateDeal(deal.id, { 
          stage: destination.droppableId,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating deal:', error);
    }
  };

  // AI Analysis
  const handleAnalyzeDeal = async (dealId: string) => {
    setAnalyzingDealId(dealId);
    
    try {
      const deal = deals.find(d => d.id === dealId);
      if (!deal) return;

      // Mock AI analysis for now
      console.log('AI Analysis for deal:', deal.title);
      
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically save the analysis or show it in a modal
      console.log('AI Analysis complete for:', deal.title);
      
    } catch (error) {
      console.error('Error analyzing deal:', error);
    } finally {
      setAnalyzingDealId(null);
    }
  };

  // Enhanced Deal Card Component
  const AIEnhancedDealCard: React.FC<{
    deal: Deal;
    onAnalyze: () => void;
    onEdit: () => void;
    isAnalyzing: boolean;
    variant?: 'card' | 'list';
  }> = ({ deal, onAnalyze, onEdit, isAnalyzing, variant = 'card' }) => {
    const priorityColors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };

    return (
      <div className={`bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 ${variant === 'card' ? 'p-4 hover:shadow-md transition-shadow cursor-pointer' : 'p-3'}`}>
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            {deal.title}
          </h4>
          <div className={`px-2 py-1 text-xs rounded ${priorityColors[deal.priority]}`}>
            {deal.priority}
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {deal.company} • {deal.contact || 'No Contact'}
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900 dark:text-white">
            ${deal.value.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {deal.probability}%
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {deal.tags?.slice(0, 2).map((tag, i) => (
              <span key={i} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAnalyze();
              }}
              disabled={isAnalyzing}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            >
              {isAnalyzing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              ) : (
                <Zap className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Pipeline Stats Component
  const PipelineStatsComponent: React.FC<{ stats: PipelineStats }> = ({ stats }) => (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pipeline Overview</h2>
        <TrendingUp className="w-5 h-5 text-blue-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalDeals}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Deals</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            ${stats.totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Value</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            ${Math.round(stats.averageDealSize).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Avg Deal Size</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(stats.conversionRate)}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Avg Probability</div>
        </div>
      </div>
    </div>
  );

  // Advanced Filter Component
  const AdvancedFilterComponent: React.FC<{
    filters: unknown[];
    onFiltersChange: (filters: unknown[]) => void;
  }> = ({ filters, onFiltersChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-lg transition-colors ${
            filters.length > 0 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>
        
        {isOpen && (
          <div className="absolute top-12 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-64 z-50">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Advanced Filters</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Filter by value, probability, stage, or priority
            </div>
            {filters.length > 0 && (
              <button
                onClick={() => onFiltersChange([])}
                className="mt-2 text-xs text-blue-500 hover:text-blue-600"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-600 dark:text-gray-400">Error loading pipeline: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Pipeline</h1>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search deals, companies, contacts..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              {/* Advanced Filter */}
              <AdvancedFilterComponent
                filters={activeFilters}
                onFiltersChange={setActiveFilters}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`p-2 rounded-lg transition-colors ${
                  showAnalytics 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {viewMode === 'kanban' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => setShowAddDealModal(true)}
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Pipeline Stats */}
        <PipelineStatsComponent stats={pipelineStats} />
        
        {/* Analytics Panel */}
        {showAnalytics && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detailed Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {columnOrder.map(stage => (
                <div key={stage} className="text-center">
                  <div className="text-lg font-bold" style={{ color: currentColumns[stage].color }}>
                    ${pipelineStats.stageValues[stage]?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {stage.replace('-', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kanban Board */}
        {viewMode === 'kanban' && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {columnOrder.map(columnId => {
                const column = currentColumns[columnId];
                const columnDeals = getDealsForColumn(columnId);
                
                return (
                  <div key={columnId} className="flex-shrink-0 w-80">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full">
                      {/* Column Header */}
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: column.color }}
                            />
                            {column.title}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {columnDeals.length}
                          </span>
                        </div>
                      </div>

                      {/* Column Content */}
                      <Droppable droppableId={columnId}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`p-4 min-h-[200px] ${
                              snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            {columnDeals.map((deal, index) => (
                              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-3 ${
                                      snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                                    }`}
                                  >
                                    <AIEnhancedDealCard
                                      deal={deal}
                                      onAnalyze={() => handleAnalyzeDeal(deal.id)}
                                      onEdit={() => setSelectedDealId(deal.id)}
                                      isAnalyzing={analyzingDealId === deal.id}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Deals</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDeals.map(deal => (
                <div key={deal.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <AIEnhancedDealCard
                    deal={deal}
                    onAnalyze={() => handleAnalyzeDeal(deal.id)}
                    onEdit={() => setSelectedDealId(deal.id)}
                    isAnalyzing={analyzingDealId === deal.id}
                    variant="list"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pipeline;