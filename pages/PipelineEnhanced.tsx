import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Search, Filter, BarChart3, Calendar, DollarSign, User, Phone, Mail, MessageSquare, Target, Clock, TrendingUp } from 'lucide-react';

// Mock data
const mockColumns = {
  'lead': { id: 'lead', title: 'Lead', color: 'bg-gray-100', deals: ['deal1', 'deal2'] },
  'qualified': { id: 'qualified', title: 'Qualified', color: 'bg-blue-100', deals: ['deal3'] },
  'proposal': { id: 'proposal', title: 'Proposal', color: 'bg-yellow-100', deals: ['deal4', 'deal5'] },
  'negotiation': { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-100', deals: ['deal6'] },
  'closed': { id: 'closed', title: 'Closed Won', color: 'bg-green-100', deals: ['deal7'] }
};

const mockDeals = {
  'deal1': {
    id: 'deal1',
    title: 'Enterprise Solution - TechCorp',
    value: 25000,
    contact: 'John Smith',
    company: 'TechCorp Inc.',
    probability: 20,
    lastContact: '2 days ago',
    nextAction: 'Follow-up call',
    stage: 'lead'
  },
  'deal2': {
    id: 'deal2',
    title: 'Software License - StartupCo',
    value: 15000,
    contact: 'Sarah Johnson',
    company: 'StartupCo',
    probability: 30,
    lastContact: '1 day ago',
    nextAction: 'Send proposal',
    stage: 'lead'
  },
  'deal3': {
    id: 'deal3',
    title: 'Consulting Services - BigCorp',
    value: 50000,
    contact: 'Mike Wilson',
    company: 'BigCorp',
    probability: 60,
    lastContact: 'Today',
    nextAction: 'Product demo',
    stage: 'qualified'
  },
  'deal4': {
    id: 'deal4',
    title: 'Cloud Migration - RetailCo',
    value: 35000,
    contact: 'Lisa Brown',
    company: 'RetailCo',
    probability: 75,
    lastContact: '3 hours ago',
    nextAction: 'Contract review',
    stage: 'proposal'
  },
  'deal5': {
    id: 'deal5',
    title: 'Training Program - EduTech',
    value: 12000,
    contact: 'David Lee',
    company: 'EduTech Solutions',
    probability: 65,
    lastContact: '1 day ago',
    nextAction: 'Schedule meeting',
    stage: 'proposal'
  },
  'deal6': {
    id: 'deal6',
    title: 'Custom Development - HealthCare+',
    value: 75000,
    contact: 'Rachel Green',
    company: 'HealthCare+',
    probability: 85,
    lastContact: '5 hours ago',
    nextAction: 'Final negotiation',
    stage: 'negotiation'
  },
  'deal7': {
    id: 'deal7',
    title: 'SaaS Implementation - FinanceGroup',
    value: 45000,
    contact: 'Tom Anderson',
    company: 'FinanceGroup',
    probability: 100,
    lastContact: 'Yesterday',
    nextAction: 'Contract signed',
    stage: 'closed'
  }
};

const columnOrder = ['lead', 'qualified', 'proposal', 'negotiation', 'closed'];

const PipelineEnhanced: React.FC = () => {
  const [columns, setColumns] = useState(mockColumns);
  const [deals, setDeals] = useState(mockDeals);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    if (sourceColumn === destColumn) {
      // Reordering within same column
      const newDealIds = Array.from(sourceColumn.deals);
      newDealIds.splice(source.index, 1);
      newDealIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        deals: newDealIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      // Moving to different column
      const sourceDealIds = Array.from(sourceColumn.deals);
      sourceDealIds.splice(source.index, 1);
      const newSourceColumn = {
        ...sourceColumn,
        deals: sourceDealIds,
      };

      const destDealIds = Array.from(destColumn.deals);
      destDealIds.splice(destination.index, 0, draggableId);
      const newDestColumn = {
        ...destColumn,
        deals: destDealIds,
      };

      // Update deal stage
      setDeals({
        ...deals,
        [draggableId]: {
          ...deals[draggableId],
          stage: destination.droppableId
        }
      });

      setColumns({
        ...columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      });
    }
  };

  const DealCard = ({ deal, index }: { deal: unknown; index: number }) => (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-pointer hover:shadow-md transition-all ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
          onClick={() => setSelectedDeal(deal.id)}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight">{deal.title}</h4>
            <span className="text-lg font-bold text-green-600">${deal.value.toLocaleString()}</span>
          </div>
          
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{deal.contact}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="h-3 w-3" />
              <span>{deal.company}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Last contact: {deal.lastContact}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="w-12 bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full" 
                  style={{ width: `${deal.probability}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{deal.probability}%</span>
            </div>
            
            <div className="flex space-x-1">
              <button className="p-1 text-gray-400 hover:text-blue-600">
                <Phone className="h-3 w-3" />
              </button>
              <button className="p-1 text-gray-400 hover:text-green-600">
                <Mail className="h-3 w-3" />
              </button>
              <button className="p-1 text-gray-400 hover:text-purple-600">
                <MessageSquare className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="mt-2 text-xs text-blue-600 font-medium">
            Next: {deal.nextAction}
          </div>
        </div>
      )}
    </Draggable>
  );

  const totalValue = Object.values(deals).reduce((sum, deal) => sum + deal.value, 0);
  const weightedValue = Object.values(deals).reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600 mt-1">Track and manage your deals through the sales process</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              <span>Add Deal</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{Object.keys(deals).length}</p>
              <p className="text-sm text-gray-600">Total Deals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">${totalValue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Pipeline Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${Math.round(weightedValue).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Weighted Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(Object.values(deals).reduce((sum, deal) => sum + deal.probability, 0) / Object.keys(deals).length)}%
              </p>
              <p className="text-sm text-gray-600">Avg. Probability</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Analytics Panel (if shown) */}
        {showAnalytics && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-blue-900">Conversion Rate</p>
                <p className="text-2xl font-bold text-blue-600">12.5%</p>
                <p className="text-sm text-blue-700">+2.3% from last month</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-green-900">Avg Deal Size</p>
                <p className="text-2xl font-bold text-green-600">${Math.round(totalValue / Object.keys(deals).length).toLocaleString()}</p>
                <p className="text-sm text-green-700">+8.1% from last month</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-purple-900">Avg Sales Cycle</p>
                <p className="text-2xl font-bold text-purple-600">45 days</p>
                <p className="text-sm text-purple-700">-5 days from last month</p>
              </div>
            </div>
          </div>
        )}

        {/* Pipeline Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {columnOrder.map((columnId) => {
              const column = columns[columnId];
              const columnDeals = column.deals.map(dealId => deals[dealId]);
              const columnValue = columnDeals.reduce((sum, deal) => sum + deal.value, 0);

              return (
                <div key={column.id} className={`${column.color} rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{column.title}</h3>
                      <p className="text-sm text-gray-600">{columnDeals.length} deals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${columnValue.toLocaleString()}</p>
                    </div>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] transition-colors ${
                          snapshot.isDraggingOver ? 'bg-white bg-opacity-50' : ''
                        }`}
                      >
                        {columnDeals.map((deal, index) => (
                          <DealCard key={deal.id} deal={deal} index={index} />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>

        {/* Deal Detail Modal (if selected) */}
        {selectedDeal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {deals[selectedDeal].title}
                  </h2>
                  <button
                    onClick={() => setSelectedDeal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Deal Value</label>
                    <p className="text-2xl font-bold text-green-600">${deals[selectedDeal].value.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact</label>
                    <p className="text-gray-900">{deals[selectedDeal].contact}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <p className="text-gray-900">{deals[selectedDeal].company}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Probability</label>
                    <p className="text-gray-900">{deals[selectedDeal].probability}%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Next Action</label>
                    <p className="text-gray-900">{deals[selectedDeal].nextAction}</p>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    <Calendar className="h-4 w-4" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineEnhanced;
