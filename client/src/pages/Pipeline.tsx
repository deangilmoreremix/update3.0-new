import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import AIEnhancedDealCard from '../components/pipeline/AIEnhancedDealCard';
import DealAnalytics from '../components/DealAnalytics';
import PipelineStats from '../components/PipelineStats';
import { AchievementPanel } from '../components/gamification/AchievementPanel';
import { ContactsModal } from '../components/contacts/ContactsModal';
import { APIStatusIndicator } from '../components/ui/APIStatusIndicator';
import { FloatingActionPanel } from '../components/ui/FloatingActionPanel';
import AdvancedFilter from '../components/pipeline/AdvancedFilter';
import AddDealModal from '../components/deals/AddDealModal';
import DealDetail from '../components/DealDetail';
import { Deal, PipelineColumn } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  BarChart3, 
  Users, 
  Grid3X3, 
  List, 
  Settings,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';

interface MockDeal extends Deal {
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
  contactAvatar?: string;
  companyAvatar?: string;
  isFavorite?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastEnrichment?: {
    confidence: number;
    aiProvider: string;
    timestamp: Date;
  };
}

const mockDeals: Record<string, MockDeal> = {
  'deal-1': {
    id: 'deal-1',
    title: 'Enterprise CRM Integration',
    company: 'TechCorp Inc.',
    contact: 'John Smith',
    value: 75000,
    stage: 'qualification',
    probability: 75,
    priority: 'high',
    expectedCloseDate: '2024-02-15',
    isFavorite: true,
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp&backgroundColor=3b82f6&textColor=ffffff',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
    lastEnrichment: {
      confidence: 85,
      aiProvider: 'OpenAI GPT-4',
      timestamp: new Date()
    }
  },
  'deal-2': {
    id: 'deal-2',
    title: 'SaaS Platform Migration',
    company: 'StartupXYZ',
    contact: 'Sarah Johnson',
    value: 45000,
    stage: 'proposal',
    probability: 60,
    priority: 'medium',
    expectedCloseDate: '2024-02-20',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=StartupXYZ&backgroundColor=8b5cf6&textColor=ffffff',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  },
  'deal-3': {
    id: 'deal-3',
    title: 'AI-Powered Analytics Suite',
    company: 'DataTech Solutions',
    contact: 'Mike Wilson',
    value: 120000,
    stage: 'negotiation',
    probability: 85,
    priority: 'high',
    expectedCloseDate: '2024-02-10',
    isFavorite: true,
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DataTech&backgroundColor=f59e0b&textColor=ffffff',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-15')
  },
  'deal-4': {
    id: 'deal-4',
    title: 'Cloud Infrastructure Setup',
    company: 'CloudFirst Corp',
    contact: 'Lisa Chen',
    value: 65000,
    stage: 'discovery',
    probability: 35,
    priority: 'medium',
    expectedCloseDate: '2024-02-25',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CloudFirst&backgroundColor=10b981&textColor=ffffff',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-14')
  },
  'deal-5': {
    id: 'deal-5',
    title: 'Digital Transformation Consulting',
    company: 'Future Enterprises',
    contact: 'David Brown',
    value: 90000,
    stage: 'closed-won',
    probability: 100,
    priority: 'high',
    expectedCloseDate: '2024-01-30',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Future&backgroundColor=ef4444&textColor=ffffff',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-30')
  },
  'deal-6': {
    id: 'deal-6',
    title: 'Mobile App Development',
    company: 'AppTech Inc',
    contact: 'Emma Davis',
    value: 35000,
    stage: 'closed-lost',
    probability: 0,
    priority: 'low',
    expectedCloseDate: '2024-01-20',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AppTech&backgroundColor=6366f1&textColor=ffffff',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2024-01-20')
  },
  'deal-7': {
    id: 'deal-7',
    title: 'Cybersecurity Assessment',
    company: 'SecureNet Solutions',
    contact: 'Robert Taylor',
    value: 55000,
    stage: 'qualification',
    probability: 65,
    priority: 'medium',
    expectedCloseDate: '2024-02-28',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SecureNet&backgroundColor=06b6d4&textColor=ffffff',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16')
  },
  'deal-8': {
    id: 'deal-8',
    title: 'E-commerce Platform Upgrade',
    company: 'ShopGlobal Ltd',
    contact: 'Jennifer White',
    value: 80000,
    stage: 'proposal',
    probability: 70,
    priority: 'high',
    expectedCloseDate: '2024-02-18',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ShopGlobal&backgroundColor=ec4899&textColor=ffffff',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-13')
  }
};

const mockColumns: Record<string, PipelineColumn> = {
  'discovery': {
    id: 'discovery',
    title: 'Discovery',
    dealIds: ['deal-4']
  },
  'qualification': {
    id: 'qualification',
    title: 'Qualification',
    dealIds: ['deal-1', 'deal-7']
  },
  'proposal': {
    id: 'proposal',
    title: 'Proposal',
    dealIds: ['deal-2', 'deal-8']
  },
  'negotiation': {
    id: 'negotiation',
    title: 'Negotiation',
    dealIds: ['deal-3']
  },
  'closed-won': {
    id: 'closed-won',
    title: 'Closed Won',
    dealIds: ['deal-5']
  },
  'closed-lost': {
    id: 'closed-lost',
    title: 'Closed Lost',
    dealIds: ['deal-6']
  }
};

const columnOrder = ['discovery', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];

const calculateStageValues = (deals: Record<string, MockDeal>, columns: Record<string, PipelineColumn>) => {
  const values: Record<string, number> = {};
  
  Object.keys(columns).forEach(columnId => {
    values[columnId] = columns[columnId].dealIds.reduce((sum, dealId) => {
      const deal = deals[dealId];
      return deal ? sum + deal.value : sum;
    }, 0);
  });
  
  return values;
};

const Pipeline: React.FC = () => {
  const [deals, setDeals] = useState<Record<string, MockDeal>>(mockDeals);
  const [columns, setColumns] = useState<Record<string, PipelineColumn>>(mockColumns);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [analyzingDealId, setAnalyzingDealId] = useState<string | null>(null);
  const [enrichingDealId, setEnrichingDealId] = useState<string | null>(null);

  // Filter deals based on search and filters
  const filteredDeals = useMemo(() => {
    let filtered = { ...deals };

    // Apply search filter
    if (searchTerm) {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([_, deal]) =>
          deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.contact.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply advanced filters
    activeFilters.forEach(filter => {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([_, deal]) => {
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

    return filtered;
  }, [deals, searchTerm, activeFilters]);

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

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    if (sourceColumn === destColumn) {
      const newDealIds = Array.from(sourceColumn.dealIds);
      newDealIds.splice(source.index, 1);
      newDealIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        dealIds: newDealIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      const sourceDealIds = Array.from(sourceColumn.dealIds);
      sourceDealIds.splice(source.index, 1);
      const newSourceColumn = {
        ...sourceColumn,
        dealIds: sourceDealIds,
      };

      const destDealIds = Array.from(destColumn.dealIds);
      destDealIds.splice(destination.index, 0, draggableId);
      const newDestColumn = {
        ...destColumn,
        dealIds: destDealIds,
      };

      // Update deal stage
      const updatedDeal = {
        ...deals[draggableId],
        stage: destination.droppableId,
        updatedAt: new Date(),
      };

      setDeals({
        ...deals,
        [draggableId]: updatedDeal,
      });

      setColumns({
        ...columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      });
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

  const handleAddDeal = (dealData: Omit<MockDeal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDealId = `deal-${Date.now()}`;
    const newDeal: MockDeal = {
      ...dealData,
      id: newDealId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to deals
    setDeals(prev => ({
      ...prev,
      [newDealId]: newDeal
    }));

    // Add to appropriate column
    setColumns(prev => ({
      ...prev,
      [newDeal.stage]: {
        ...prev[newDeal.stage],
        dealIds: [...prev[newDeal.stage].dealIds, newDealId]
      }
    }));
  };

  const handleAnalyzeDeal = async (deal: MockDeal) => {
    setAnalyzingDealId(deal.id);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update deal with enhanced probability
      const newProbability = Math.min(deal.probability + 15, 95);
      const updatedDeal = {
        ...deal,
        probability: newProbability,
        lastEnrichment: {
          confidence: newProbability,
          aiProvider: 'Hybrid AI (GPT-4o + Gemini)',
          timestamp: new Date()
        }
      };
      
      setDeals(prev => ({
        ...prev,
        [deal.id]: updatedDeal
      }));
      
      return true;
    } catch (error) {
      console.error('AI analysis failed:', error);
      return false;
    } finally {
      setAnalyzingDealId(null);
    }
  };

  const handleEnrichDeal = async (deal: MockDeal) => {
    setEnrichingDealId(deal.id);
    try {
      // Simulate AI enrichment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the deal with enhanced data
      const updatedDeal = {
        ...deal,
        probability: Math.min(deal.probability + 20, 95),
        lastEnrichment: {
          confidence: 85,
          aiProvider: 'AI Research',
          timestamp: new Date()
        }
      };
      
      setDeals(prev => ({
        ...prev,
        [deal.id]: updatedDeal
      }));
      
      return true;
    } catch (error) {
      console.error('AI enrichment failed:', error);
      return false;
    } finally {
      setEnrichingDealId(null);
    }
  };

  const handleToggleFavorite = async (deal: MockDeal) => {
    const updatedDeal = {
      ...deal,
      isFavorite: !deal.isFavorite
    };
    
    setDeals(prev => ({
      ...prev,
      [deal.id]: updatedDeal
    }));
  };

  const handleFindNewImage = async (deal: MockDeal) => {
    try {
      // Simulate finding a new image
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo, just use a different seed for the avatar
      const newSeed = Date.now().toString();
      const newAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${newSeed}&backgroundColor=3b82f6,8b5cf6,f59e0b,10b981,ef4444&textColor=ffffff`;
      
      const updatedDeal = {
        ...deal,
        companyAvatar: newAvatar
      };
      
      setDeals(prev => ({
        ...prev,
        [deal.id]: updatedDeal
      }));
    } catch (error) {
      console.error('Failed to find new image:', error);
    }
  };

  const stageValues = calculateStageValues(filteredDeals, filteredColumns);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Pipeline</h1>
            
            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 text-sm font-medium transition-colors ${
                  viewMode === 'kanban' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 text-sm font-medium border-l border-gray-300 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
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
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Team</span>
            </button>

            {/* Add Deal Button */}
            <button
              onClick={() => setShowAddDealModal(true)}
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
            <span className="text-sm text-gray-600">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {filter.field} {filter.operator} {filter.value}
                <button
                  onClick={() => {
                    const newFilters = activeFilters.filter((_, i) => i !== index);
                    setActiveFilters(newFilters);
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
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

        {/* Team Achievements */}
        {showAchievements && (
          <div className="mb-8">
            <AchievementPanel />
          </div>
        )}

        {/* Pipeline View */}
        {viewMode === 'kanban' ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-6 overflow-x-auto pb-6">
              {columnOrder.map((columnId) => {
                const column = filteredColumns[columnId];
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
                                        onAIEnrich={handleEnrichDeal}
                                        isAnalyzing={analyzingDealId === deal.id}
                                        isEnriching={enrichingDealId === deal.id}
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
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Deal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Probability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.values(filteredDeals).map((deal) => (
                    <tr key={deal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={deal.companyAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${deal.company}&backgroundColor=3b82f6&textColor=ffffff`}
                            alt={deal.company}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{deal.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{deal.contact}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{deal.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">${deal.value.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {deal.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{deal.probability}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {deal.expectedCloseDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDealClick(deal.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modals */}
        {showContactsModal && (
          <ContactsModal
            isOpen={showContactsModal}
            onClose={() => setShowContactsModal(false)}
          />
        )}

        {showAddDealModal && (
          <AddDealModal
            isOpen={showAddDealModal}
            onClose={() => setShowAddDealModal(false)}
            onAddDeal={handleAddDeal}
          />
        )}

        {selectedDealId && (
          <DealDetail
            dealId={selectedDealId}
            isOpen={!!selectedDealId}
            onClose={() => setSelectedDealId(null)}
          />
        )}

        {/* Floating Action Panel */}
        <FloatingActionPanel />

        {/* API Status Indicator */}
        <APIStatusIndicator />
      </div>
    </div>
  );
};

export default Pipeline;