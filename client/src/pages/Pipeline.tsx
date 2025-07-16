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
import { Search, Plus, BarChart3, Grid3X3, List } from 'lucide-react';

// Mock data based on repository structure
const mockDeals: Record<string, Deal> = {
  'deal-1': {
    id: 'deal-1',
    title: 'Enterprise Software License',
    company: 'TechCorp Solutions',
    contact: 'Sarah Johnson',
    value: 125000,
    stage: 'qualification',
    probability: 85,
    priority: 'high',
    dueDate: new Date('2024-02-15'),
    expectedCloseDate: '2024-02-15',
    contactAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp&backgroundColor=3b82f6&textColor=ffffff',
    isFavorite: true,
    tags: ['enterprise', 'software'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/techcorp-solutions',
      website: 'https://techcorp.com'
    },
    customFields: {
      "Deal Source": "Direct",
      "Account Manager": "Alex Rivera"
    },
    lastActivity: 'Sent proposal document',
    lastEnrichment: {
      confidence: 85,
      aiProvider: 'OpenAI GPT-4o',
      timestamp: new Date()
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
  },
  'deal-2': {
    id: 'deal-2',
    title: 'Cloud Migration Project',
    company: 'StartupXYZ',
    contact: 'Mike Chen',
    value: 75000,
    stage: 'proposal',
    probability: 65,
    priority: 'medium',
    dueDate: new Date('2024-02-20'),
    expectedCloseDate: '2024-02-20',
    contactAvatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=StartupXYZ&backgroundColor=8b5cf6&textColor=ffffff',
    tags: ['cloud', 'migration'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/startupxyz',
      website: 'https://startupxyz.com'
    },
    customFields: {
      "Deal Source": "Referral",
      "Account Manager": "Sam Wilson"
    },
    lastActivity: 'Demo completed',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12'
  },
  'deal-3': {
    id: 'deal-3',
    title: 'AI Analytics Platform',
    company: 'DataFlow Inc',
    contact: 'Emily Rodriguez',
    value: 95000,
    stage: 'negotiation',
    probability: 78,
    priority: 'high',
    dueDate: new Date('2024-02-10'),
    expectedCloseDate: '2024-02-10',
    contactAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DataFlow&backgroundColor=f59e0b&textColor=ffffff',
    isFavorite: true,
    tags: ['ai', 'analytics'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/dataflow-inc',
      website: 'https://dataflow.com'
    },
    customFields: {
      "Deal Source": "Marketing",
      "Account Manager": "Lisa Park"
    },
    lastActivity: 'Contract review in progress',
    lastEnrichment: {
      confidence: 78,
      aiProvider: 'Gemini Pro',
      timestamp: new Date()
    },
    createdAt: '2024-01-03',
    updatedAt: '2024-01-15'
  },
  'deal-4': {
    id: 'deal-4',
    title: 'Digital Transformation',
    company: 'RetailCorp',
    contact: 'David Kim',
    value: 45000,
    stage: 'discovery',
    probability: 40,
    priority: 'medium',
    dueDate: new Date('2024-02-25'),
    expectedCloseDate: '2024-02-25',
    contactAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RetailCorp&backgroundColor=10b981&textColor=ffffff',
    tags: ['retail', 'transformation'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/retailcorp',
      website: 'https://retailcorp.com'
    },
    customFields: {
      "Deal Source": "Cold Outreach",
      "Account Manager": "Chris Taylor"
    },
    lastActivity: 'Initial meeting scheduled',
    createdAt: '2024-01-07',
    updatedAt: '2024-01-14'
  },
  'deal-5': {
    id: 'deal-5',
    title: 'Security Compliance Suite',
    company: 'FinanceFirst',
    contact: 'Jennifer Lopez',
    value: 180000,
    stage: 'closed-won',
    probability: 100,
    priority: 'high',
    dueDate: new Date('2024-01-30'),
    expectedCloseDate: '2024-01-30',
    contactAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=FinanceFirst&backgroundColor=059669&textColor=ffffff',
    isFavorite: true,
    tags: ['finance', 'security'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/financefirst',
      website: 'https://financefirst.com'
    },
    customFields: {
      "Deal Source": "Partner",
      "Account Manager": "Alex Rivera"
    },
    lastActivity: 'Contract signed',
    createdAt: '2023-12-15',
    updatedAt: '2024-01-30'
  },
  'deal-6': {
    id: 'deal-6',
    title: 'Mobile App Development',
    company: 'AppInnovate',
    contact: 'Robert Wilson',
    value: 35000,
    stage: 'closed-lost',
    probability: 0,
    priority: 'low',
    dueDate: new Date('2024-01-20'),
    expectedCloseDate: '2024-01-20',
    contactAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AppInnovate&backgroundColor=ef4444&textColor=ffffff',
    tags: ['mobile', 'development'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/appinnovate',
      website: 'https://appinnovate.com'
    },
    customFields: {
      "Deal Source": "Web Form",
      "Account Manager": "Sam Wilson"
    },
    lastActivity: 'Lost to competitor',
    createdAt: '2023-12-20',
    updatedAt: '2024-01-20'
  },
  'deal-7': {
    id: 'deal-7',
    title: 'E-commerce Platform',
    company: 'ShopSmart',
    contact: 'Maria Garcia',
    value: 65000,
    stage: 'qualification',
    probability: 55,
    priority: 'medium',
    dueDate: new Date('2024-03-01'),
    expectedCloseDate: '2024-03-01',
    contactAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ShopSmart&backgroundColor=7c3aed&textColor=ffffff',
    tags: ['ecommerce', 'platform'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/shopsmart',
      website: 'https://shopsmart.com'
    },
    customFields: {
      "Deal Source": "Event",
      "Account Manager": "Lisa Park"
    },
    lastActivity: 'Requirements gathering',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  'deal-8': {
    id: 'deal-8',
    title: 'CRM Implementation',
    company: 'GrowthTech',
    contact: 'James Thompson',
    value: 85000,
    stage: 'proposal',
    probability: 70,
    priority: 'high',
    dueDate: new Date('2024-02-28'),
    expectedCloseDate: '2024-02-28',
    contactAvatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=GrowthTech&backgroundColor=dc2626&textColor=ffffff',
    isFavorite: true,
    tags: ['crm', 'implementation'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/growthtech',
      website: 'https://growthtech.com'
    },
    customFields: {
      "Deal Source": "Inbound",
      "Account Manager": "Chris Taylor"
    },
    lastActivity: 'Proposal sent',
    lastEnrichment: {
      confidence: 70,
      aiProvider: 'Hybrid AI (GPT-4o + Gemini)',
      timestamp: new Date()
    },
    createdAt: '2024-01-08',
    updatedAt: '2024-01-16'
  }
};

const mockColumns: Record<string, PipelineColumn> = {
  discovery: {
    id: 'discovery',
    title: 'Discovery',
    dealIds: ['deal-4'],
    color: '#3B82F6'
  },
  qualification: {
    id: 'qualification',
    title: 'Qualification',
    dealIds: ['deal-1', 'deal-7'],
    color: '#F59E0B'
  },
  proposal: {
    id: 'proposal',
    title: 'Proposal',
    dealIds: ['deal-2', 'deal-8'],
    color: '#8B5CF6'
  },
  negotiation: {
    id: 'negotiation',
    title: 'Negotiation',
    dealIds: ['deal-3'],
    color: '#F97316'
  },
  'closed-won': {
    id: 'closed-won',
    title: 'Closed Won',
    dealIds: ['deal-5'],
    color: '#10B981'
  },
  'closed-lost': {
    id: 'closed-lost',
    title: 'Closed Lost',
    dealIds: ['deal-6'],
    color: '#EF4444'
  }
};

const columnOrder = ['discovery', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];

const Pipeline: React.FC = () => {
  const [deals, setDeals] = useState<Record<string, Deal>>(mockDeals);
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
        updatedAt: new Date().toISOString(),
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

  // AI Analysis Functions
  const handleAnalyzeDeal = async (deal: Deal): Promise<boolean> => {
    setAnalyzingDealId(deal.id);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update deal with enhanced probability
      const enhancedProbability = Math.min(deal.probability + 10, 95);
      const updatedDeal = {
        ...deal,
        probability: enhancedProbability,
        lastEnrichment: {
          confidence: enhancedProbability,
          aiProvider: 'Hybrid AI (GPT-4o + Gemini)',
          timestamp: new Date()
        },
        updatedAt: new Date().toISOString()
      };
      
      setDeals(prev => ({
        ...prev,
        [deal.id]: updatedDeal
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to analyze deal:', error);
      return false;
    } finally {
      setAnalyzingDealId(null);
    }
  };

  const handleAIEnrichDeal = async (deal: Deal): Promise<boolean> => {
    setEnrichingDealId(deal.id);
    try {
      // Simulate AI enrichment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update deal with enriched data
      const updatedDeal = {
        ...deal,
        customFields: {
          ...deal.customFields,
          "AI Insights": "High conversion potential",
          "Next Best Action": "Schedule follow-up meeting"
        },
        lastEnrichment: {
          confidence: Math.min(deal.probability + 5, 90),
          aiProvider: 'OpenAI GPT-4o',
          timestamp: new Date()
        },
        updatedAt: new Date().toISOString()
      };
      
      setDeals(prev => ({
        ...prev,
        [deal.id]: updatedDeal
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to enrich deal:', error);
      return false;
    } finally {
      setEnrichingDealId(null);
    }
  };

  const handleToggleFavorite = async (deal: Deal): Promise<void> => {
    const updatedDeal = {
      ...deal,
      isFavorite: !deal.isFavorite,
      updatedAt: new Date().toISOString()
    };
    
    setDeals(prev => ({
      ...prev,
      [deal.id]: updatedDeal
    }));
  };

  const handleFindNewImage = async (deal: Deal): Promise<void> => {
    // Simulate image search
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAvatars = [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    ];
    
    const randomAvatar = newAvatars[Math.floor(Math.random() * newAvatars.length)];
    
    const updatedDeal = {
      ...deal,
      companyAvatar: randomAvatar,
      updatedAt: new Date().toISOString()
    };
    
    setDeals(prev => ({
      ...prev,
      [deal.id]: updatedDeal
    }));
  };

  // Calculate pipeline statistics
  const pipelineStats = useMemo(() => {
    const dealsArray = Object.values(filteredDeals);
    const totalValue = dealsArray.reduce((sum, deal) => sum + deal.value, 0);
    const totalDeals = dealsArray.length;
    const averageDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
    const avgProbability = totalDeals > 0 ? dealsArray.reduce((sum, deal) => sum + deal.probability, 0) / totalDeals : 0;
    
    const stageValues = columnOrder.reduce((acc, stage) => {
      acc[stage] = dealsArray.filter(deal => deal.stage === stage).reduce((sum, deal) => sum + deal.value, 0);
      return acc;
    }, {} as Record<string, number>);

    return {
      totalValue,
      totalDeals,
      averageDealSize,
      conversionRate: avgProbability,
      stageValues
    };
  }, [filteredDeals]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <div className="flex-none p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sales Pipeline</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your deals through the sales process</p>
          </div>
          <div className="flex items-center space-x-4">
            <APIStatusIndicator />
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{showAnalytics ? 'Hide' : 'Show'} Analytics</span>
            </button>
            <button
              onClick={() => setShowAddDealModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Deal</span>
            </button>
          </div>
        </div>

        {/* Pipeline Stats */}
        <PipelineStats 
          totalValue={pipelineStats.totalValue}
          totalDeals={pipelineStats.totalDeals}
          averageDealSize={pipelineStats.averageDealSize}
          conversionRate={pipelineStats.conversionRate}
          stageValues={pipelineStats.stageValues}
        />

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <AdvancedFilter
            onFiltersChange={setActiveFilters}
            activeFilters={activeFilters}
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="flex-none p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <DealAnalytics deals={Object.values(filteredDeals)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'kanban' ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="h-full overflow-x-auto overflow-y-hidden">
              <div className="flex space-x-6 p-6 h-full min-w-max">
                {columnOrder.map(columnId => {
                  const column = filteredColumns[columnId];
                  if (!column) return null;

                  return (
                    <div key={column.id} className="flex flex-col w-80">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: column.color }}
                          />
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {column.title}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {column.dealIds.length}
                          </span>
                        </div>
                      </div>

                      <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 space-y-3 p-2 rounded-lg transition-colors ${
                              snapshot.isDraggingOver
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : 'bg-gray-50/50 dark:bg-gray-800/50'
                            }`}
                            style={{ minHeight: '200px' }}
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
                                      className={`${
                                        snapshot.isDragging
                                          ? 'rotate-3 shadow-xl'
                                          : ''
                                      }`}
                                    >
                                      <AIEnhancedDealCard
                                        deal={deal}
                                        onClick={() => setSelectedDealId(deal.id)}
                                        onAnalyze={handleAnalyzeDeal}
                                        onAIEnrich={handleAIEnrichDeal}
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
                  );
                })}
              </div>
            </div>
          </DragDropContext>
        ) : (
          <div className="p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
                            src={deal.companyAvatar}
                            alt={deal.company}
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {deal.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-300">
                              {deal.contact}
                            </div>
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
                        <span
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                          style={{ backgroundColor: filteredColumns[deal.stage]?.color }}
                        >
                          {filteredColumns[deal.stage]?.title}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {deal.probability}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedDealId(deal.id)}
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
      </div>

      {/* Floating Action Panel */}
      <FloatingActionPanel
        onAddDeal={() => setShowAddDealModal(true)}
        onShowContacts={() => setShowContactsModal(true)}
        onShowAchievements={() => setShowAchievements(true)}
      />

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
        />
      )}

      {showAchievements && (
        <AchievementPanel
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {selectedDealId && (
        <DealDetail
          dealId={selectedDealId}
          onClose={() => setSelectedDealId(null)}
        />
      )}
    </div>
  );
};

export default Pipeline;