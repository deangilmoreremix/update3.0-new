import React, { useState } from 'react';
import { Filter, X, Plus, ChevronDown } from 'lucide-react';

interface FilterRule {
  field: string;
  operator: string;
  value: unknown;
}

interface AdvancedFilterProps {
  onApplyFilters: (filters: FilterRule[]) => void;
  onClearFilters: () => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ onApplyFilters, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterRule[]>([]);

  const fieldOptions = [
    { value: 'value', label: 'Deal Value' },
    { value: 'probability', label: 'Probability' },
    { value: 'stage', label: 'Stage' },
    { value: 'priority', label: 'Priority' }
  ];

  const operatorOptions = {
    value: [
      { value: 'gt', label: 'Greater than' },
      { value: 'lt', label: 'Less than' },
      { value: 'eq', label: 'Equal to' },
      { value: 'gte', label: 'Greater than or equal' },
      { value: 'lte', label: 'Less than or equal' }
    ],
    probability: [
      { value: 'gt', label: 'Greater than' },
      { value: 'lt', label: 'Less than' },
      { value: 'eq', label: 'Equal to' },
      { value: 'gte', label: 'Greater than or equal' },
      { value: 'lte', label: 'Less than or equal' }
    ],
    stage: [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Not equals' }
    ],
    priority: [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Not equals' }
    ]
  };

  const stageOptions = [
    { value: 'discovery', label: 'Discovery' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const addFilter = () => {
    setFilters([...filters, { field: 'value', operator: 'gt', value: '' }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, updates: Partial<FilterRule>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    const validFilters = filters.filter(f => f.value !== '' && f.value !== null);
    onApplyFilters(validFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setFilters([]);
    onClearFilters();
    setIsOpen(false);
  };

  const renderValueInput = (filter: FilterRule, index: number) => {
    if (filter.field === 'stage') {
      return (
        <select
          value={filter.value}
          onChange={(e) => updateFilter(index, { value: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select stage</option>
          {stageOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      );
    }

    if (filter.field === 'priority') {
      return (
        <select
          value={filter.value}
          onChange={(e) => updateFilter(index, { value: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select priority</option>
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="number"
        value={filter.value}
        onChange={(e) => updateFilter(index, { value: parseFloat(e.target.value) || '' })}
        placeholder={filter.field === 'value' ? 'Enter amount' : 'Enter percentage'}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
          filters.length > 0 || isOpen
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {filters.length > 0 && (
          <span className="bg-white bg-opacity-20 text-xs px-2 py-0.5 rounded-full">
            {filters.length}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Advanced Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {filters.map((filter, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={filter.field}
                    onChange={(e) => updateFilter(index, { 
                      field: e.target.value, 
                      operator: operatorOptions[e.target.value as keyof typeof operatorOptions][0].value,
                      value: ''
                    })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {fieldOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>

                  <select
                    value={filter.operator}
                    onChange={(e) => updateFilter(index, { operator: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {operatorOptions[filter.field as keyof typeof operatorOptions]?.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>

                  {renderValueInput(filter, index)}

                  <button
                    onClick={() => removeFilter(index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={addFilter}
                className="flex items-center space-x-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors w-full"
              >
                <Plus className="w-4 h-4" />
                <span>Add filter</span>
              </button>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilter;