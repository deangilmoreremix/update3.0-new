import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useDealStore } from '../store/dealStore';
import AIEnhancedDealCard from '../components/pipeline/AIEnhancedDealCard';
import DealAnalytics from '../components/DealAnalytics';
import PipelineStats from '../components/PipelineStats';
import AdvancedFilter from '../components/pipeline/AdvancedFilter';
import { 
  Search, 
  Filter, 
  Plus, 
  BarChart3, 
  Users, 
  Grid, 
  List, 
  Settings,
  Zap,
  Eye,
  EyeOff,
  Building2,
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  User
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: string;
  probability: number;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  dueDate?: string;
  expectedCloseDate?: string;
  lostReason?: string;
  products?: string[];
  competitors?: string[];
  decisionMakers?: string[];
  lastActivityDate?: string;
  assignedTo?: string;
  currency?: string;
  discountAmount?: string;
  discountPercentage?: string;
  nextSteps?: string[];
  aiInsights?: any;
  daysInStage?: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  tenantId?: string;
  contactId?: string;
  contactAvatar?: string;
  companyAvatar?: string;
  isFavorite?: boolean;
  lastEnrichment?: {
    confidence: number;
    aiProvider: string;
    timestamp: Date;
  };
}

const Pipeline: React.FC = () => {
  const dealStore = useDealStore();
  
  // Extract deals from store and convert to Record for compatibility
  const dealsArray = Object.values(dealStore.deals || {});
  const dealsRecord = useMemo(() => {
    return dealsArray.reduce((acc, deal) => {
      acc[deal.id] = deal;
      return acc;
    }, {} as Record<string, Deal>);
  }, [dealsArray]);
  
  const isLoading = dealStore.isLoading;
  const error = dealStore.error;
  
  // Local state for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [analyzingDealId, setAnalyzingDealId] = useState<string | null>(null);

  const columnOrder = ['discovery', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];

  // Fetch deals on mount
  useEffect(() => {
    if (dealStore.fetchDeals) {
      dealStore.fetchDeals();
    }
  }, [dealStore.fetchDeals]);

  // Calculate columns dynamically
  const columns = useMemo(() => {
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
    dealsArray.forEach(deal => {
      if (baseColumns[deal.stage]) {
        baseColumns[deal.stage].dealIds.push(deal.id);
      }
    });

    return baseColumns;
  }, [dealsArray]);

  // Filter deals based on search and filters
  const filteredDeals = useMemo(() => {
    let result = { ...dealsRecord };

    // Apply search
    if (searchTerm.trim()) {
      result = Object.fromEntries(
        Object.entries(result).filter(([_, deal]) =>
          deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.contact.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply advanced filters
    activeFilters.forEach(filter => {
      result = Object.fromEntries(
        Object.entries(result).filter(([_, deal]) => {
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
        })
      );
    });

    return result;
  }, [dealsRecord, searchTerm, activeFilters]);

  // Update columns with filtered deals
  const filteredColumns = useMemo(() => {
    const newColumns = { ...columns };
    
    Object.keys(newColumns).forEach(columnId => {
      newColumns[columnId] = {
        ...newColumns[columnId],
        dealIds: newColumns[columnId].dealIds.filter(dealId => filteredDeals[dealId])
      };
    });
    
    return newColumns;
  }, [columns, filteredDeals]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update the deal stage in the store
    if (dealStore.updateDeal) {
      dealStore.updateDeal(draggableId, { stage: destination.droppableId });
    }
  };

  const handleDealClick = (dealId: string) => {
    setSelectedDealId(dealId);
  };

  const handleApplyFilters = (filters: any[]) => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  const handleShowAddDealModal = () => {
    setShowAddDealModal(true);
  };

  const handleAnalyzeDeal = async (deal: Deal) => {
    setAnalyzingDealId(deal.id);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update deal with enhanced probability using store
      const newProbability = Math.min(deal.probability + 15, 95);
      if (dealStore.updateDeal) {
        dealStore.updateDeal(deal.id, {
          probability: newProbability,
          lastEnrichment: {
            confidence: newProbability,
            aiProvider: 'Hybrid AI (GPT-4o + Gemini)',
            timestamp: new Date()
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error('AI analysis failed:', error);
      return false;
    } finally {
      setAnalyzingDealId(null);
    }
  };

  const handleToggleFavorite = async (deal: Deal) => {
    if (dealStore.updateDeal) {
      dealStore.updateDeal(deal.id, {
        isFavorite: !deal.isFavorite
      });
    }
  };

  const handleFindNewImage = async (deal: Deal) => {
    try {
      // Simulate finding a new image
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo, just use a different seed for the avatar
      const newSeed = Date.now().toString();
      const newAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${newSeed}&backgroundColor=3b82f6,8b5cf6,f59e0b,10b981,ef4444&textColor=ffffff`;
      
      if (dealStore.updateDeal) {
        dealStore.updateDeal(deal.id, {
          companyAvatar: newAvatar
        });
      }
    } catch (error) {
      console.error('Failed to find new image:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading pipeline: {error}</p>
          <button
            onClick={() => dealStore.fetchDeals?.()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Pipeline</h1>
            
            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 text-sm font-medium transition-colors ${
                  viewMode === 'kanban' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 text-sm font-medium border-l border-gray-300 dark:border-gray-600 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Advanced Filters */}
            <AdvancedFilter
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />

            {/* Analytics Toggle */}
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                showAnalytics 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {showAnalytics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>Analytics</span>
            </button>

            {/* Achievements Toggle */}
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                showAchievements 
                  ? 'bg-purple-600 text-white border-purple-600' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Team</span>
            </button>

            {/* Add Deal Button */}
            <button
              onClick={handleShowAddDealModal}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Deal</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="mb-6 flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-sm rounded-full"
              >
                {filter.field} {filter.operator} {filter.value}
                <button
                  onClick={() => {
                    const newFilters = activeFilters.filter((_, i) => i !== index);
                    setActiveFilters(newFilters);
                  }}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Pipeline Stats */}
        <PipelineStats
          totalValue={Object.values(filteredDeals).reduce((sum, deal) => sum + deal.value, 0)}
          totalDeals={Object.keys(filteredDeals).length}
        />

        {/* Analytics Dashboard */}
        {showAnalytics && (
          <div className="mb-8">
            <DealAnalytics deals={filteredDeals} />
          </div>
        )}

        {/* Pipeline View */}
        {viewMode === 'kanban' ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-6 overflow-x-auto pb-6">
              {columnOrder.map((columnId) => {
                const column = filteredColumns[columnId];
                if (!column) return null;
                
                const columnDeals = column.dealIds.map((dealId) => filteredDeals[dealId]).filter(Boolean);
                const columnValue = columnDeals.reduce((sum, deal) => sum + deal.value, 0);

                return (
                  <div key={column.id} className="flex-shrink-0 w-80">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {columnDeals.length}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ${(columnValue / 1000).toFixed(0)}k
                          </p>
                        </div>
                      </div>
                      
                      <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-4 min-h-[200px] transition-colors ${
                              snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20 rounded-lg' : ''
                            }`}
                          >
                            {column.dealIds.map((dealId, index) => {
                              const deal = filteredDeals[dealId];
                              if (!deal) return null;

                              return (
                                <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`transition-all duration-200 ${
                                        snapshot.isDragging ? 'rotate-2 scale-105' : ''
                                      }`}
                                    >
                                      <AIEnhancedDealCard
                                        deal={deal}
                                        onClick={() => handleDealClick(deal.id)}
                                        showAnalyzeButton={true}
                                        onAnalyze={handleAnalyzeDeal}
                                        isAnalyzing={analyzingDealId === deal.id}
                                        onToggleFavorite={handleToggleFavorite}
                                        onFindNewImage={handleFindNewImage}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
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
        ) : (
          // List View
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Deal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Probability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.values(filteredDeals).map((deal) => (
                    <tr
                      key={deal.id}
                      onClick={() => handleDealClick(deal.id)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={deal.contactAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${deal.contact}`}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{deal.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{deal.contact}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {deal.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${deal.value.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {deal.probability}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {deal.expectedCloseDate && new Date(deal.expectedCloseDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pipeline;