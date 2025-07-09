import React, { useState } from 'react';
import { Filter, X, Plus, Check } from 'lucide-react';

interface FilterCondition {
  field: string;
  operator: string;
  value: any;
}

interface AdvancedFilterProps {
  onApplyFilters: (filters: FilterCondition[]) => void;
  onClearFilters: () => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ onApplyFilters, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [newFilter, setNewFilter] = useState<FilterCondition>({
    field: 'value',
    operator: 'gt',
    value: ''
  });

  const fields = [
    { value: 'value', label: 'Deal Value' },
    { value: 'probability', label: 'Probability' },
    { value: 'stage', label: 'Stage' },
    { value: 'priority', label: 'Priority' }
  ];

  const operators = {
    value: [
      { value: 'gt', label: '>' },
      { value: 'lt', label: '<' },
      { value: 'eq', label: '=' },
      { value: 'gte', label: '>=' },
      { value: 'lte', label: '<=' }
    ],
    probability: [
      { value: 'gt', label: '>' },
      { value: 'lt', label: '<' },
      { value: 'eq', label: '=' },
      { value: 'gte', label: '>=' },
      { value: 'lte', label: '<=' }
    ],
    stage: [
      { value: 'equals', label: 'equals' },
      { value: 'not_equals', label: 'not equals' }
    ],
    priority: [
      { value: 'equals', label: 'equals' },
      { value: 'not_equals', label: 'not equals' }
    ]
  };

  const stageOptions = ['discovery', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
  const priorityOptions = ['high', 'medium', 'low'];

  const addFilter = () => {
    if (newFilter.value !== '') {
      setFilters([...filters, newFilter]);
      setNewFilter({
        field: 'value',
        operator: 'gt',
        value: ''
      });
    }
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setFilters([]);
    onClearFilters();
    setIsOpen(false);
  };

  const renderValueInput = () => {
    if (newFilter.field === 'stage') {
      return (
        <select
          value={newFilter.value}
          onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select stage</option>
          {stageOptions.map(stage => (
            <option key={stage} value={stage}>
              {stage.charAt(0).toUpperCase() + stage.slice(1)}
            </option>
          ))}
        </select>
      );
    }

    if (newFilter.field === 'priority') {
      return (
        <select
          value={newFilter.value}
          onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select priority</option>
          {priorityOptions.map(priority => (
            <option key={priority} value={priority}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="number"
        value={newFilter.value}
        onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter value"
      />
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
          filters.length > 0 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {filters.length > 0 && (
          <span className="bg-blue-800 text-white rounded-full px-2 py-1 text-xs">
            {filters.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Filters */}
            {filters.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h4>
                <div className="space-y-2">
                  {filters.map((filter, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-50 p-2 rounded-md"
                    >
                      <span className="text-sm text-blue-800">
                        {fields.find(f => f.value === filter.field)?.label} {filter.operator} {filter.value}
                      </span>
                      <button
                        onClick={() => removeFilter(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Filter */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Add Filter</h4>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <select
                  value={newFilter.field}
                  onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value, operator: operators[e.target.value as keyof typeof operators][0].value })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {fields.map(field => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={newFilter.operator}
                  onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {operators[newFilter.field as keyof typeof operators].map(op => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
                
                {renderValueInput()}
              </div>
              
              <button
                onClick={addFilter}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Filter</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Clear All
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={applyFilters}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilter;