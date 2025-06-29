import React, { useState, useEffect } from 'react';
import { AIGoal, AI_GOALS, AI_GOAL_CATEGORIES } from '../data/aiGoals';
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
  Palette
} from 'lucide-react';

interface InteractiveGoalExplorerProps {
  realMode?: boolean;
  onModeToggle?: (mode: boolean) => void;
  onGoalSelect?: (goal: AIGoal) => void;
  contextData?: any;
}

const InteractiveGoalExplorer: React.FC<InteractiveGoalExplorerProps> = ({
  realMode = false,
  onModeToggle,
  onGoalSelect,
  contextData
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [complexityFilter, setComplexityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [executingGoal, setExecutingGoal] = useState<AIGoal | null>(null);
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
    totalGoals: AI_GOALS.length,
    inProgress: 0,
    completed: 0,
    avgExecutionTime: 0
  });

  // Filter goals based on current filters
  const filteredGoals = AI_GOALS.filter(goal => {
    const matchesCategory = selectedCategory === 'all' || goal.category === selectedCategory;
    const matchesComplexity = complexityFilter === 'all' || goal.complexity === complexityFilter;
    const matchesSearch = searchQuery === '' || 
      goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesComplexity && matchesSearch;
  });

  // Update live stats
  useEffect(() => {
    setLiveStats({
      totalGoals: AI_GOALS.length,
      inProgress: executingGoals.size,
      completed: completedGoals.size,
      avgExecutionTime: 8.5
    });
  }, [executingGoals.size, completedGoals.size]);

  // Initialize customization selections
  useEffect(() => {
    if (isCustomizationMode) {
      const currentSelections = getSelectedGoals(selectedLocation);
      setSelectedGoalsForCustomization(currentSelections);
    }
  }, [isCustomizationMode, selectedLocation, getSelectedGoals]);

  const handleGoalExecution = (goal: AIGoal) => {
    if (isCustomizationMode) {
      handleCustomizationToggle(goal.id);
      return;
    }
    
    setExecutingGoal(goal);
    setShowExecutionModal(true);
    setExecutingGoals(prev => new Set([...prev, goal.id]));
    
    // Simulate execution progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      setExecutionProgress(prev => ({ ...prev, [goal.id]: Math.min(progress, 100) }));
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setExecutingGoals(prev => {
            const newSet = new Set(prev);
            newSet.delete(goal.id);
            return newSet;
          });
          setCompletedGoals(prev => new Set([...prev, goal.id]));
          setExecutionProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[goal.id];
            return newProgress;
          });
        }, 1000);
      }
    }, 500);
    
    if (onGoalSelect) {
      onGoalSelect(goal);
    }
  };

  const handleCustomizationToggle = (goalId: string) => {
    const isSelected = selectedGoalsForCustomization.includes(goalId);
    const canSelect = !isSelected && selectedGoalsForCustomization.length < maxButtonsPerLocation;
    
    if (isSelected) {
      setSelectedGoalsForCustomization(prev => prev.filter(id => id !== goalId));
    } else if (canSelect) {
      setSelectedGoalsForCustomization(prev => [...prev, goalId]);
    }
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sales': return <TrendingUp className="h-4 w-4" />;
      case 'marketing': return <Lightbulb className="h-4 w-4" />;
      case 'relationship': return <Users className="h-4 w-4" />;
      case 'automation': return <Bot className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      case 'content': return <Network className="h-4 w-4" />;
      case 'ai-native': return <Brain className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              AI Goals Dashboard
            </h1>
          </div>
          <p className="text-xl text-blue-200 mb-6">
            Discover and execute {AI_GOALS.length} intelligent automation goals to transform your business
          </p>
          
          {/* Mode Toggle and Customization */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => onModeToggle && onModeToggle(!realMode)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                realMode
                  ? 'bg-green-600 text-white shadow-lg hover:bg-green-700'
                  : 'bg-gray-600 text-white shadow-lg hover:bg-gray-700'
              }`}
            >
              {realMode ? '🔴 Live Mode' : '🎭 Demo Mode'}
            </button>
            
            {!isCustomizationMode ? (
              <button
                onClick={() => setIsCustomizationMode(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2"
              >
                <Palette className="h-4 w-4" />
                Customize Toolbar
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveCustomization}
                  className="px-4 py-2 bg-green-600 text-white rounded-full font-medium shadow-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Save ({selectedGoalsForCustomization.length})
                </button>
                <button
                  onClick={handleCancelCustomization}
                  className="px-4 py-2 bg-gray-600 text-white rounded-full font-medium shadow-lg hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Customization Panel */}
        {isCustomizationMode && (
          <div className="mb-8 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Customize AI Toolbar
              </h3>
              <div className="text-sm text-blue-200">
                Select up to {maxButtonsPerLocation} goals for your {selectedLocation} toolbar
              </div>
            </div>
            
            {/* Location Selector */}
            <div className="flex gap-2 mb-4">
              {(['contact', 'deal', 'company'] as CustomizationLocation[]).map(location => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedLocation === location
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/20 text-blue-200 hover:bg-white/30'
                  }`}
                >
                  {location.charAt(0).toUpperCase() + location.slice(1)} Cards
                </button>
              ))}
            </div>
            
            {/* Selection Status */}
            <div className="text-sm text-blue-200">
              {selectedGoalsForCustomization.length} of {maxButtonsPerLocation} goals selected
            </div>
          </div>
        )}

        {/* Live Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-200">Total Goals</span>
            </div>
            <div className="text-2xl font-bold text-white">{liveStats.totalGoals}</div>
          </div>
          
          <div className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-orange-400" />
              <span className="text-sm font-medium text-orange-200">In Progress</span>
            </div>
            <div className="text-2xl font-bold text-white">{liveStats.inProgress}</div>
          </div>
          
          <div className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-green-200">Completed</span>
            </div>
            <div className="text-2xl font-bold text-white">{liveStats.completed}</div>
          </div>
          
          <div className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-200">Avg Time</span>
            </div>
            <div className="text-2xl font-bold text-white">{liveStats.avgExecutionTime}m</div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-8 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search goals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {AI_GOAL_CATEGORIES.map(category => (
                <option key={category} value={category} className="text-gray-900">
                  {category}
                </option>
              ))}
            </select>
            
            {/* Complexity Filter */}
            <select
              value={complexityFilter}
              onChange={(e) => setComplexityFilter(e.target.value)}
              className="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Complexities</option>
              <option value="Simple" className="text-gray-900">Simple</option>
              <option value="Intermediate" className="text-gray-900">Intermediate</option>
              <option value="Advanced" className="text-gray-900">Advanced</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/20 text-blue-200 hover:bg-white/30'
            }`}
          >
            <Eye className="h-4 w-4" />
            All ({AI_GOALS.length})
          </button>
          {AI_GOAL_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/20 text-blue-200 hover:bg-white/30'
              }`}
            >
              {getCategoryIcon(category)}
              {category} ({AI_GOALS.filter(g => g.category === category).length})
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredGoals.map(goal => {
            const isExecuting = executingGoals.has(goal.id);
            const isCompleted = completedGoals.has(goal.id);
            const progress = executionProgress[goal.id] || 0;
            const isSelectedForCustomization = selectedGoalsForCustomization.includes(goal.id);
            const canSelectForCustomization = !isSelectedForCustomization && selectedGoalsForCustomization.length < maxButtonsPerLocation;
            
            return (
              <div key={goal.id} className="relative">
                {/* Customization Selection Overlay */}
                {isCustomizationMode && (
                  <div className={`absolute inset-0 z-10 rounded-2xl transition-all duration-300 ${
                    isSelectedForCustomization
                      ? 'bg-blue-500/20 ring-2 ring-blue-500'
                      : canSelectForCustomization
                      ? 'hover:bg-blue-500/10 hover:ring-1 hover:ring-blue-400'
                      : 'bg-gray-500/20 ring-1 ring-gray-400'
                  }`}>
                    <div className="absolute top-4 right-4">
                      {isSelectedForCustomization ? (
                        <div className="p-2 bg-blue-500 rounded-full text-white shadow-lg">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : canSelectForCustomization ? (
                        <div className="p-2 bg-white/20 border-2 border-blue-400 rounded-full">
                          <div className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-500 rounded-full text-white">
                          <X className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <InteractiveGoalCard
                  goal={goal}
                  onExecute={handleGoalExecution}
                  isExecuting={isExecuting}
                  executionProgress={progress}
                  realMode={realMode}
                />
                
                {isCompleted && (
                  <div className="absolute top-4 left-4 p-2 bg-green-500 rounded-full text-white shadow-lg animate-bounce">
                    <Award className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center py-16">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No goals found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Goal Execution Modal */}
      {showExecutionModal && executingGoal && (
        <GoalExecutionModal
          goal={executingGoal}
          isOpen={showExecutionModal}
          onClose={() => setShowExecutionModal(false)}
          realMode={realMode}
          contextData={contextData}
        />
      )}
    </div>
  );
};

export default InteractiveGoalExplorer;