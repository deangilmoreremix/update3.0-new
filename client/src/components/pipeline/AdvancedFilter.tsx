import React, { useState } from 'react';
import { Filter, X, Plus, Search } from 'lucide-react';

interface FilterCondition {
  field: string;
  operator: string;
  value: string | number;
}

interface AdvancedFilterProps {
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newFilter, setNewFilter] = useState<FilterCondition>({
    field: 'value',
    operator: 'gt',
    value: '',
  });

  const fieldOptions = [
    { value: 'value', label: 'Deal Value' },
    { value: 'probability', label: 'Probability' },
    { value: 'stage', label: 'Stage' },
    { value: 'priority', label: 'Priority' },
    { value: 'company', label: 'Company' },
    { value: 'contact', label: 'Contact' },
  ];

  const operatorOptions = {
    value: [
      { value: 'gt', label: 'Greater than' },
      { value: 'lt', label: 'Less than' },
      { value: 'eq', label: 'Equal to' },
      { value: 'gte', label: 'Greater than or equal' },
      { value: 'lte', label: 'Less than or equal' },
    ],
    probability: [
      { value: 'gt', label: 'Greater than' },
      { value: 'lt', label: 'Less than' },
      { value: 'eq', label: 'Equal to' },
      { value: 'gte', label: 'Greater than or equal' },
      { value: 'lte', label: 'Less than or equal' },
    ],
    stage: [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Not equals' },
    ],
    priority: [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Not equals' },
    ],
    company: [
      { value: 'contains', label: 'Contains' },
      { value: 'equals', label: 'Equals' },
      { value: 'starts_with', label: 'Starts with' },
    ],
    contact: [
      { value: 'contains', label: 'Contains' },
      { value: 'equals', label: 'Equals' },
      { value: 'starts_with', label: 'Starts with' },
    ],
  };

  const valueOptions = {
    stage: [
      { value: 'qualification', label: 'Qualification' },
      { value: 'proposal', label: 'Proposal' },
      { value: 'negotiation', label: 'Negotiation' },
      { value: 'closed-won', label: 'Closed Won' },
      { value: 'closed-lost', label: 'Closed Lost' },
    ],
    priority: [
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' },
    ],
  };

  const addFilter = () => {
    if (newFilter.value !== '') {
      onFiltersChange([...filters, newFilter]);
      setNewFilter({
        field: 'value',
        operator: 'gt',
        value: '',
      });
    }
  };

  const removeFilter = (index: number) => {
    onFiltersChange(filters.filter((_, i) => i !== index));
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  const getFieldLabel = (field: string) => {
    return fieldOptions.find(f => f.value === field)?.label || field;
  };

  const getOperatorLabel = (field: string, operator: string) => {
    const ops = operatorOptions[field as keyof typeof operatorOptions] || [];
    return ops.find(o => o.value === operator)?.label || operator;
  };

  const getValueLabel = (field: string, value: string | number) => {
    const options = valueOptions[field as keyof typeof valueOptions];
    if (options) {
      return options.find(o => o.value === value)?.label || value;
    }
    return value;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors ${
          filters.length > 0
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        <Filter className="w-5 h-5" />
        {filters.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {filters.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-80 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Advanced Filters</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Active Filters */}
          {filters.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Filters:</span>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-2">
                {filters.map((filter, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {getFieldLabel(filter.field)} {getOperatorLabel(filter.field, filter.operator)} {getValueLabel(filter.field, filter.value)}
                    </span>
                    <button
                      onClick={() => removeFilter(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Filter */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Field
              </label>
              <select
                value={newFilter.field}
                onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value, operator: 'gt', value: '' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fieldOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Operator
              </label>
              <select
                value={newFilter.operator}
                onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {(operatorOptions[newFilter.field as keyof typeof operatorOptions] || []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Value
              </label>
              {valueOptions[newFilter.field as keyof typeof valueOptions] ? (
                <select
                  value={newFilter.value}
                  onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select value...</option>
                  {valueOptions[newFilter.field as keyof typeof valueOptions]!.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={newFilter.field === 'value' || newFilter.field === 'probability' ? 'number' : 'text'}
                  value={newFilter.value}
                  onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                  placeholder={`Enter ${getFieldLabel(newFilter.field).toLowerCase()}...`}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            <button
              onClick={addFilter}
              disabled={newFilter.value === ''}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilter;