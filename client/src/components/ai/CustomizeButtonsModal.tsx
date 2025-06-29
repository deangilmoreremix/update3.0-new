import React, { useState, useMemo } from 'react';
import { X, Search, Settings, Target, Check, RotateCcw, Download, Upload, Sparkles } from 'lucide-react';
import { useCustomizationStore, CustomizationLocation } from '../../store/customizationStore';
import { AI_GOALS, AI_GOAL_CATEGORIES, getGoalById, getRecommendedGoals } from '../../data/aiGoals';

interface CustomizeButtonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: CustomizationLocation;
  entityType?: 'contact' | 'deal' | 'company';
}

const CustomizeButtonsModal: React.FC<CustomizeButtonsModalProps> = ({
  isOpen,
  onClose,
  initialLocation = 'contactCards',
  entityType = 'contact'
}) => {
  const {
    buttonConfigurations,
    setButtonConfiguration,
    resetToDefaults,
    exportConfiguration,
    importConfiguration
  } = useCustomizationStore();

  const [activeLocation, setActiveLocation] = useState<CustomizationLocation>(initialLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showRecommended, setShowRecommended] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    buttonConfigurations[activeLocation] || []
  );

  // Update selected goals when location changes
  React.useEffect(() => {
    setSelectedGoals(buttonConfigurations[activeLocation] || []);
  }, [activeLocation, buttonConfigurations]);

  // Filtered goals based on search, category, and recommendations
  const filteredGoals = useMemo(() => {
    let goals = AI_GOALS;

    // Filter by search query
    if (searchQuery) {
      goals = goals.filter(goal =>
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      goals = goals.filter(goal => goal.category === selectedCategory);
    }

    // Filter by recommendations
    if (showRecommended) {
      const entityTypeForLocation = activeLocation.includes('contact') ? 'contact' : 
                                   activeLocation.includes('deal') ? 'deal' : 'company';
      const recommended = getRecommendedGoals(entityTypeForLocation);
      goals = goals.filter(goal => recommended.some(r => r.id === goal.id));
    }

    return goals;
  }, [searchQuery, selectedCategory, showRecommended, activeLocation]);

  const locationLabels = {
    contactCards: 'Contact Cards',
    dealCards: 'Deal Cards',
    contactDetail: 'Contact Detail Pages',
    dealDetail: 'Deal Detail Pages'
  };

  const maxButtonsPerLocation = 6;

  const handleGoalToggle = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(prev => prev.filter(id => id !== goalId));
    } else if (selectedGoals.length < maxButtonsPerLocation) {
      setSelectedGoals(prev => [...prev, goalId]);
    }
  };

  const handleSave = () => {
    setButtonConfiguration(activeLocation, selectedGoals);
    onClose();
  };

  const handleReset = () => {
    resetToDefaults(activeLocation);
    setSelectedGoals(buttonConfigurations[activeLocation] || []);
  };

  const handleExport = () => {
    const config = exportConfiguration();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-button-configuration.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importConfiguration(content);
      if (success) {
        setSelectedGoals(buttonConfigurations[activeLocation] || []);
      } else {
        alert('Invalid configuration file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative inline-block w-full max-w-6xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Settings className="w-6 h-6 text-indigo-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Customize AI Goals Buttons
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Location Tabs */}
            <div className="lg:col-span-1">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Customize For</h4>
              <div className="space-y-2">
                {Object.entries(locationLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveLocation(key as CustomizationLocation)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeLocation === key
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    {label}
                    <span className="block text-xs text-gray-500 mt-1">
                      {buttonConfigurations[key as CustomizationLocation]?.length || 0} / {maxButtonsPerLocation} buttons
                    </span>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Reset to Defaults
                </button>
                
                <button
                  onClick={handleExport}
                  className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download size={16} className="mr-2" />
                  Export Config
                </button>
                
                <label className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Upload size={16} className="mr-2" />
                  Import Config
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="lg:col-span-3">
              <div className="flex flex-wrap gap-4 mb-6">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search AI goals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="All">All Categories</option>
                  {AI_GOAL_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                {/* Recommended Toggle */}
                <button
                  onClick={() => setShowRecommended(!showRecommended)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showRecommended
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Sparkles size={16} className="mr-2" />
                  Recommended Only
                </button>
              </div>

              {/* Selected Goals Preview */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-900 mb-2">
                  Selected for {locationLabels[activeLocation]} ({selectedGoals.length}/{maxButtonsPerLocation})
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedGoals.map(goalId => {
                    const goal = getGoalById(goalId);
                    return goal ? (
                      <span
                        key={goalId}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {goal.title}
                        <button
                          onClick={() => handleGoalToggle(goalId)}
                          className="ml-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ) : null;
                  })}
                  {selectedGoals.length === 0 && (
                    <span className="text-sm text-gray-500">No goals selected</span>
                  )}
                </div>
              </div>

              {/* Goals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredGoals.map(goal => {
                  const isSelected = selectedGoals.includes(goal.id);
                  const canSelect = !isSelected && selectedGoals.length < maxButtonsPerLocation;
                  
                  return (
                    <div
                      key={goal.id}
                      onClick={() => canSelect || isSelected ? handleGoalToggle(goal.id) : null}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                          : canSelect
                          ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          : 'border-gray-200 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h6 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {goal.title}
                        </h6>
                        {isSelected && (
                          <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 ml-2" />
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {goal.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          goal.complexity === 'Simple' ? 'bg-green-100 text-green-700' :
                          goal.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {goal.complexity}
                        </span>
                        <span className="text-gray-500">{goal.estimatedTime}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredGoals.length === 0 && (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-2">No goals found</h3>
                  <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeButtonsModal;