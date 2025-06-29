import React, { useState, useEffect } from 'react';
import { GOALS, GOAL_CATEGORIES } from '../data/goals';
import { Goal } from '../types/goals';
import InteractiveGoalCard from './ui/InteractiveGoalCard';
import GoalExecutionModal from './GoalExecutionModal';
import { useCustomizationStore, CustomizationLocation } from '../store/customizationStore';
import { 
  Target, 
  Filter, 
  Search, 
  Zap, 
  Star, 
  TrendingUp,
  ArrowRight,
  Play,
  Eye,
  Sparkles,
  Brain,
  Users,
  Activity,
  BarChart3,
  Network,
  Bot,
  Award,
  Lightbulb,
  HelpCircle,
  Settings,
  Check,
  X,
  ChevronRight,
  Palette,
  DollarSign
} from 'lucide-react';

interface InteractiveGoalExplorerProps {
  realMode?: boolean;
  onModeToggle?: (mode: boolean) => void;
  onGoalSelect?: (goal: Goal) => void;
  contextData?: any;
}

const InteractiveGoalExplorer: React.FC<InteractiveGoalExplorerProps> = ({
  realMode = false,
  onModeToggle,
  onGoalSelect,
  contextData
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [complexityFilter, setComplexityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [executingGoal, setExecutingGoal] = useState<Goal | null>(null);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [executingGoals, setExecutingGoals] = useState<Set<string>>(new Set());
  const [executionProgress, setExecutionProgress] = useState<Record<string, number>>({});
  const [completedGoals, setCompletedGoals] = useState<Set<string>>(new Set());
  
  // Customization state
  const [isCustomizationMode, setIsCustomizationMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<CustomizationLocation>('contact');
  const [selectedGoalsForCustomization, setSelectedGoalsForCustomization] = useState<string[]>([]);
  const { getSelectedGoals, setSelectedGoals, maxButtonsPerLocation } = useCustomizationStore();
  
  const [liveStats, setLiveStats] = useState({
    totalGoals: 58,
    inProgress: 0,
    completed: 0,
    activeAgents: 0,
    crmUpdates: 0,
    businessValue: 0
  });

  // Filter goals based on current filters
  const filteredGoals = GOALS.filter(goal => {
    const matchesCategory = selectedCategory === 'all' || goal.category === selectedCategory;
    const matchesComplexity = complexityFilter === 'all' || goal.complexity === complexityFilter;
    
    // Map complexity to priority for filtering
    const priority = goal.complexity === 'Advanced' ? 'High' : 
                    goal.complexity === 'Intermediate' ? 'Medium' : 'Low';
    const matchesPriority = priorityFilter === 'all' || priority === priorityFilter;
    
    const matchesSearch = searchQuery === '' || 
      goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesComplexity && matchesPriority && matchesSearch;
  });

  // Get category counts
  const getCategoryCount = (category: string) => {
    if (category === 'all') return GOALS.length;
    return GOALS.filter(goal => goal.category === category).length;
  };

  // Get priority counts
  const getPriorityCount = (priority: string) => {
    if (priority === 'all') return GOALS.length;
    return GOALS.filter(goal => {
      const goalPriority = goal.complexity === 'Advanced' ? 'High' : 
                          goal.complexity === 'Intermediate' ? 'Medium' : 'Low';
      return goalPriority === priority;
    }).length;
  };

  // Update live stats
  useEffect(() => {
    setLiveStats(prev => ({
      ...prev,
      inProgress: executingGoals.size,
      completed: completedGoals.size,
      activeAgents: executingGoals.size * 2, // Mock agents per goal
      crmUpdates: completedGoals.size * 8, // Mock updates per completion
      businessValue: completedGoals.size * 15000 // Mock value per goal
    }));
  }, [executingGoals.size, completedGoals.size]);

  // Initialize customization selections
  useEffect(() => {
    if (isCustomizationMode) {
      const currentSelections = getSelectedGoals(selectedLocation);
      setSelectedGoalsForCustomization(currentSelections);
    }
  }, [isCustomizationMode, selectedLocation, getSelectedGoals]);

  const handleGoalExecution = (goal: Goal) => {
    if (isCustomizationMode) {
      handleCustomizationToggle(goal.id);
      return;
    }

    setExecutingGoal(goal);
    setShowExecutionModal(true);
    
    // Add to executing goals
    setExecutingGoals(prev => new Set([...Array.from(prev), goal.id]));
    
    // Start progress simulation
    const startTime = Date.now();
    const duration = 10000; // 10 seconds
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      setExecutionProgress(prev => ({
        ...prev,
        [goal.id]: progress
      }));
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        setExecutingGoals(prev => {
          const newSet = new Set(prev);
          newSet.delete(goal.id);
          return newSet;
        });
        setCompletedGoals(prev => new Set([...Array.from(prev), goal.id]));
      }
    }, 100);
  };

  // Customization functions
  const handleCustomizationToggle = (goalId: string) => {
    setSelectedGoalsForCustomization(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else if (prev.length < maxButtonsPerLocation) {
        return [...prev, goalId];
      }
      return prev;
    });
  };

  const handleSaveCustomization = () => {
    setSelectedGoals(selectedLocation, selectedGoalsForCustomization);
    setIsCustomizationMode(false);
    setSelectedGoalsForCustomization([]);
  };

  const handleCancelCustomization = () => {
    setIsCustomizationMode(false);
    setSelectedGoalsForCustomization([]);
  };

  return (
    <div className="space-y-8">
      {/* Main Title with Floating Animations */}
      <div className="relative text-center py-8">
        <div className="absolute -top-4 -left-4 animate-float">
          <Brain className="h-12 w-12 text-purple-600 opacity-20" />
        </div>
        <div className="absolute -top-4 -right-4 animate-float" style={{animationDelay: '1s'}}>
          <Sparkles className="h-12 w-12 text-blue-600 opacity-20" />
        </div>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 animate-float" style={{animationDelay: '2s'}}>
          <Target className="h-10 w-10 text-green-600 opacity-20" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Interactive AI Goal Explorer
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Choose your business goals and watch AI agents execute them in real-time on a live CRM interface. 
          Every goal comes with step-by-step execution, live progress tracking, and measurable business impact.
        </p>
      </div>

      {/* Live System Dashboard */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-xl rounded-2xl border border-blue-200 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Live System Dashboard</h2>
          <p className="text-gray-600">Real-time metrics from your AI goal execution system</p>
        </div>
        
        <div className="grid md:grid-cols-6 gap-6">
          {/* Available Goals */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 text-center group hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{liveStats.totalGoals}</div>
            <div className="text-sm text-gray-600 font-medium">Available Goals</div>
            <div className="text-xs text-gray-500 mt-1">Ready to execute</div>
          </div>

          {/* Executing Now */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100 text-center group hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{liveStats.inProgress}</div>
            <div className="text-sm text-gray-600 font-medium">Executing Now</div>
            <div className="text-xs text-gray-500 mt-1">Active workflows</div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100 text-center group hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{liveStats.completed}</div>
            <div className="text-sm text-gray-600 font-medium">Completed</div>
            <div className="text-xs text-gray-500 mt-1">Successfully achieved</div>
          </div>

          {/* AI Agents */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100 text-center group hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
              <Bot className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{liveStats.activeAgents}</div>
            <div className="text-sm text-gray-600 font-medium">AI Agents</div>
            <div className="text-xs text-gray-500 mt-1">Currently working</div>
          </div>

          {/* CRM Updates */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-100 text-center group hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-200 transition-colors">
              <BarChart3 className="h-6 w-6 text-teal-600" />
            </div>
            <div className="text-3xl font-bold text-teal-600 mb-1">{liveStats.crmUpdates}</div>
            <div className="text-sm text-gray-600 font-medium">CRM Updates</div>
            <div className="text-xs text-gray-500 mt-1">Data changes made</div>
          </div>

          {/* Business Value */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100 text-center group hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">${liveStats.businessValue.toLocaleString()}</div>
            <div className="text-sm text-gray-600 font-medium">Business Value</div>
            <div className="text-xs text-gray-500 mt-1">Generated ROI</div>
          </div>
        </div>
      </div>

      {/* Search and Customization Controls */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search goals by title, description, or business impact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 text-lg"
          />
        </div>

        {/* Customization Toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsCustomizationMode(!isCustomizationMode)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
              isCustomizationMode
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <Palette className="h-5 w-5" />
            {isCustomizationMode ? 'Exit Customization' : 'Customize Toolbar'}
          </button>
        </div>

        {/* Customization Controls */}
        {isCustomizationMode && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-purple-700">Customize for:</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value as CustomizationLocation)}
                  className="px-3 py-2 rounded-lg border border-purple-300 bg-white focus:ring-2 focus:ring-purple-500/20 outline-none"
                >
                  <option value="contact">Contact Cards</option>
                  <option value="deal">Deal Cards</option>
                  <option value="company">Company Cards</option>
                </select>
              </div>
              
              <div className="text-sm text-purple-600">
                Selected: {selectedGoalsForCustomization.length}/{maxButtonsPerLocation}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSaveCustomization}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Save Selection
              </button>
              <button
                onClick={handleCancelCustomization}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-6">
        {/* Goal Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Goal Categories
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
            >
              All Goals <span className="text-sm opacity-75">({getCategoryCount('all')})</span>
            </button>
            {GOAL_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                }`}
              >
                {category} <span className="text-sm opacity-75">({getCategoryCount(category)})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority and Complexity Filters */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Priority Level */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Level</h3>
            <div className="space-y-2">
              <button
                onClick={() => setPriorityFilter('all')}
                className={`w-full px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                  priorityFilter === 'all'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                }`}
              >
                All Priorities <span className="float-right text-sm opacity-75">({getPriorityCount('all')})</span>
              </button>
              {['High', 'Medium', 'Low'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setPriorityFilter(priority)}
                  className={`w-full px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                    priorityFilter === priority
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {priority} <span className="float-right text-sm opacity-75">({getPriorityCount(priority)})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Complexity Level */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complexity Level</h3>
            <div className="space-y-2">
              <button
                onClick={() => setComplexityFilter('all')}
                className={`w-full px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                  complexityFilter === 'all'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                }`}
              >
                All Levels
              </button>
              {['Simple', 'Intermediate', 'Advanced'].map((complexity) => (
                <button
                  key={complexity}
                  onClick={() => setComplexityFilter(complexity)}
                  className={`w-full px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                    complexityFilter === complexity
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {complexity}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => {
          const isSelected = selectedGoalsForCustomization.includes(goal.id);
          
          return (
            <div key={goal.id} className="relative">
              {/* Selection Overlay for Customization Mode */}
              {isCustomizationMode && (
                <div className={`absolute inset-0 rounded-2xl border-4 transition-all duration-300 z-20 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-transparent hover:border-blue-300'
                }`}>
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              )}
              
              <InteractiveGoalCard
                goal={goal}
                onExecute={handleGoalExecution}
                isExecuting={executingGoals.has(goal.id)}
                executionProgress={executionProgress[goal.id] || 0}
                realMode={realMode}
              />
            </div>
          );
        })}
      </div>

      {/* No Results Message */}
      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No goals found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setPriorityFilter('all');
              setComplexityFilter('all');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Goal Execution Modal */}
      {showExecutionModal && executingGoal && (
        <GoalExecutionModal
          goal={executingGoal}
          isOpen={showExecutionModal}
          onClose={() => {
            setShowExecutionModal(false);
            setExecutingGoal(null);
          }}
          realMode={realMode}
          onComplete={(result) => {
            console.log('Goal execution completed:', result);
          }}
          contextData={contextData}
        />
      )}
    </div>
  );
};

export default InteractiveGoalExplorer;