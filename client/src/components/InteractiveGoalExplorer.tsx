import React, { useState, useEffect } from 'react';
import { Goal } from '../types/goals';
import { goalCategories, allGoals } from '../data/aiGoals';
import InteractiveGoalCard from './ui/InteractiveGoalCard';
import GoalExecutionModal from './GoalExecutionModal';
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
  HelpCircle
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
  const [liveStats, setLiveStats] = useState({
    totalGoals: allGoals.length,
    executing: 0,
    completed: 0,
    estimatedValue: 0,
    agentsActive: 0,
    crmUpdates: 0
  });

  // Filter goals based on selected criteria
  const filteredGoals = allGoals.filter(goal => {
    const categoryMatch = selectedCategory === 'all' || 
      goal.category.toLowerCase() === selectedCategory.toLowerCase();
    const priorityMatch = priorityFilter === 'all' || goal.priority === priorityFilter;
    const complexityMatch = complexityFilter === 'all' || goal.complexity === complexityFilter;
    const searchMatch = searchQuery === '' || 
      goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && priorityMatch && complexityMatch && searchMatch;
  });

  // Update live stats
  useEffect(() => {
    setLiveStats({
      totalGoals: allGoals.length,
      executing: executingGoals.size,
      completed: completedGoals.size,
      estimatedValue: (completedGoals.size * 15000) + (executingGoals.size * 7500),
      agentsActive: executingGoals.size * 3,
      crmUpdates: completedGoals.size * 12 + executingGoals.size * 6
    });
  }, [executingGoals, completedGoals]);

  // Handle goal execution
  const handleExecuteGoal = async (goal: Goal) => {
    if (executingGoals.has(goal.id)) return;

    setExecutingGoals(prev => {
      const newSet = new Set(prev);
      newSet.add(goal.id);
      return newSet;
    });
    setExecutionProgress(prev => ({ ...prev, [goal.id]: 0 }));

    // Show the modal
    setExecutingGoal(goal);
    setShowExecutionModal(true);
    
    // Notify parent component
    onGoalSelect?.(goal);

    // Simulate execution progress
    const progressInterval = setInterval(() => {
      setExecutionProgress(prev => {
        const currentProgress = prev[goal.id] || 0;
        const newProgress = Math.min(100, currentProgress + Math.random() * 12 + 3);
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setExecutingGoals(current => {
            const newSet = new Set(current);
            newSet.delete(goal.id);
            return newSet;
          });
          setCompletedGoals(current => {
            const newSet = new Set(current);
            newSet.add(goal.id);
            return newSet;
          });
          return { ...prev, [goal.id]: 100 };
        }
        
        return { ...prev, [goal.id]: newProgress };
      });
    }, 800);
  };

  // Handle goal completion from modal
  const handleExecutionComplete = (result: any) => {
    console.log('Goal execution completed:', result);
    setCompletedGoals(prev => {
      const newSet = new Set(prev);
      newSet.add(result.goalId);
      return newSet;
    });
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowExecutionModal(false);
    setExecutingGoal(null);
  };

  const getPriorityCount = (priority: string) => {
    return allGoals.filter(g => g.priority === priority).length;
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return allGoals.length;
    return allGoals.filter(g => g.category.toLowerCase() === categoryId.toLowerCase()).length;
  };

  return (
    <div className="space-y-8" id="goal-explorer-section">
      {/* Enhanced Interactive Header */}
      <div className="text-center space-y-8">
        <div className="relative">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Interactive AI Goal Explorer
          </h1>
          <div className="absolute -top-4 -right-4 animate-float">
            <Sparkles className="h-12 w-12 text-blue-600" />
          </div>
          <div className="absolute -bottom-2 -left-4 animate-float" style={{animationDelay: '1s'}}>
            <Brain className="h-10 w-10 text-purple-600" />
          </div>
        </div>
        
        <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
          Choose your business goals and watch AI agents execute them in real-time on a live CRM interface. 
          Every goal comes with step-by-step execution, live progress tracking, and measurable business impact.
        </p>

        {/* Enhanced Live Stats Dashboard */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-xl rounded-2xl border border-blue-200 p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Network className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Live System Dashboard</h2>
              <Activity className="h-6 w-6 text-green-600 animate-pulse" />
            </div>

            <div className="grid md:grid-cols-6 gap-6">
              <div className="text-center p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">{liveStats.totalGoals}</div>
                <div className="text-gray-800 font-medium">Available Goals</div>
                <div className="text-sm text-gray-600">Ready to execute</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-orange-200 shadow-sm">
                <div className="text-3xl font-bold text-orange-600 mb-2 flex items-center justify-center gap-2">
                  {liveStats.executing}
                  {liveStats.executing > 0 && <Activity className="h-6 w-6 animate-pulse" />}
                </div>
                <div className="text-gray-800 font-medium">Executing Now</div>
                <div className="text-sm text-gray-600">Active workflows</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-green-200 shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2 flex items-center justify-center gap-2">
                  {liveStats.completed}
                  {liveStats.completed > 0 && <Award className="h-6 w-6" />}
                </div>
                <div className="text-gray-800 font-medium">Completed</div>
                <div className="text-sm text-gray-600">Successfully achieved</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-purple-200 shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">{liveStats.agentsActive}</div>
                <div className="text-gray-800 font-medium">AI Agents</div>
                <div className="text-sm text-gray-600">Currently working</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-cyan-200 shadow-sm">
                <div className="text-3xl font-bold text-cyan-600 mb-2">{liveStats.crmUpdates}</div>
                <div className="text-gray-800 font-medium">CRM Updates</div>
                <div className="text-sm text-gray-600">Data changes made</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-emerald-200 shadow-sm">
                <div className="text-3xl font-bold text-emerald-600 mb-2">${(liveStats.estimatedValue).toLocaleString()}</div>
                <div className="text-gray-800 font-medium">Business Value</div>
                <div className="text-sm text-gray-600">Generated ROI</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Interface */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 backdrop-blur-xl rounded-2xl border border-gray-200 p-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
            <input
              type="text"
              placeholder="Search goals by title, description, or business impact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h4 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Goal Categories
          </h4>
          <div className="grid md:grid-cols-4 lg:grid-cols-8 gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-4 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Goals
              <span className="block text-xs opacity-75 mt-1">
                ({getCategoryCount('all')})
              </span>
            </button>
            {goalCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.name.replace(' Goals', '')}
                <span className="block text-xs opacity-75 mt-1">
                  ({category.totalGoals})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority and Complexity Filters */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-600" />
              Priority Level
            </h4>
            <div className="flex gap-3">
              {['all', 'High', 'Medium', 'Low'].map(priority => (
                <button
                  key={priority}
                  onClick={() => setPriorityFilter(priority)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    priorityFilter === priority
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {priority === 'all' ? 'All Priorities' : priority}
                  {priority !== 'all' && (
                    <span className="ml-2 text-xs opacity-75">
                      ({getPriorityCount(priority)})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-600" />
              Complexity Level
            </h4>
            <div className="flex gap-3">
              {['all', 'Simple', 'Intermediate', 'Advanced'].map(complexity => (
                <button
                  key={complexity}
                  onClick={() => setComplexityFilter(complexity)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    complexityFilter === complexity
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {complexity === 'all' ? 'All Levels' : complexity}
                  {complexity !== 'all' && complexity === 'Simple' && <Zap className="inline w-3 h-3 ml-1" />}
                  {complexity !== 'all' && complexity === 'Intermediate' && <Target className="inline w-3 h-3 ml-1" />}
                  {complexity !== 'all' && complexity === 'Advanced' && <Star className="inline w-3 h-3 ml-1" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Results Summary */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="text-gray-700">
          Showing <span className="text-gray-900 font-bold text-lg">{filteredGoals.length}</span> of{' '}
          <span className="text-gray-900 font-bold text-lg">{allGoals.length}</span> goals
          {searchQuery && (
            <span> matching "<span className="text-blue-600 font-medium">{searchQuery}</span>"</span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {realMode && (
            <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full border border-red-200">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-700 font-medium">Live Mode Active</span>
            </div>
          )}
          
          {onModeToggle && (
            <button
              onClick={() => onModeToggle(!realMode)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                realMode
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }`}
            >
              Switch to {realMode ? 'Demo' : 'Live'} Mode
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Interactive Goal Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGoals.map(goal => (
          <div key={goal.id} className="animate-fadeIn">
            <InteractiveGoalCard
              goal={goal}
              onExecute={handleExecuteGoal}
              isExecuting={executingGoals.has(goal.id)}
              executionProgress={executionProgress[goal.id] || 0}
              realMode={realMode}
            />
          </div>
        ))}
      </div>

      {/* Enhanced Empty State */}
      {filteredGoals.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
          <div className="mb-6">
            <Search className="h-20 w-20 text-gray-500 mx-auto mb-6 animate-float" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No goals found</h3>
            <p className="text-gray-700 max-w-md mx-auto text-lg">
              Try adjusting your filters or search terms to find the perfect goals for your business.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setPriorityFilter('all');
              setComplexityFilter('all');
              setSearchQuery('');
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Enhanced Quick Actions */}
      {filteredGoals.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-yellow-400" />
            Smart Quick Actions
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => {
                const highPriorityGoals = filteredGoals.filter(g => g.priority === 'High');
                highPriorityGoals.slice(0, 3).forEach(goal => handleExecuteGoal(goal));
              }}
              className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-400/30 rounded-xl hover:from-red-500/20 hover:to-orange-500/20 transition-all duration-300 text-left group hover:scale-105"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-red-500/20">
                  <TrendingUp className="h-6 w-6 text-red-400" />
                </div>
                <span className="font-semibold text-white text-lg">Execute High Priority</span>
                <ArrowRight className="h-5 w-5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-gray-300 mb-2">Run top 3 high-priority goals simultaneously</p>
              <p className="text-sm text-red-300">Maximum business impact strategy</p>
            </button>

            <button
              onClick={() => {
                const simpleGoals = filteredGoals.filter(g => g.complexity === 'Simple');
                simpleGoals.slice(0, 5).forEach(goal => handleExecuteGoal(goal));
              }}
              className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300 text-left group hover:scale-105"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-green-500/20">
                  <Zap className="h-6 w-6 text-green-400" />
                </div>
                <span className="font-semibold text-white text-lg">Quick Wins</span>
                <ArrowRight className="h-5 w-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-gray-300 mb-2">Execute all simple goals for fast results</p>
              <p className="text-sm text-green-300">Immediate productivity boost</p>
            </button>

            <button
              onClick={() => {
                const salesGoals = filteredGoals.filter(g => g.category === 'Sales');
                salesGoals.slice(0, 3).forEach(goal => handleExecuteGoal(goal));
              }}
              className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 text-left group hover:scale-105"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <span className="font-semibold text-white text-lg">Sales Focus</span>
                <ArrowRight className="h-5 w-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-gray-300 mb-2">Focus on revenue-generating goals</p>
              <p className="text-sm text-blue-300">Direct revenue impact</p>
            </button>
          </div>
        </div>
      )}

      {/* Full Screen Goal Execution Modal */}
      {executingGoal && (
        <GoalExecutionModal
          goal={executingGoal}
          isOpen={showExecutionModal}
          onClose={handleCloseModal}
          realMode={realMode}
          onComplete={handleExecutionComplete}
          contextData={contextData}
        />
      )}
    </div>
  );
};

export default InteractiveGoalExplorer;