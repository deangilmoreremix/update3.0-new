import React, { useState, useMemo, FC } from 'react';
import { 
  Search, Filter, X, Calendar, Users, 
  Tag, MapPin, Building, Star,
  ChevronDown, ChevronUp, RotateCcw, Save,
  SlidersHorizontal, Check
} from 'lucide-react';

export interface FilterCriteria {
  search: string;
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  valueRange: {
    min: number | null;
    max: number | null;
  };
  tags: string[];
  assignedTo: string[];
  source: string[];
  location: string[];
  company: string[];
  priority: string[];
  customFields: Record<string, any>;
}

interface AdvancedFilterProps {
  type: 'deals' | 'contacts' | 'companies';
  onFiltersChange: (filters: FilterCriteria) => void;
  initialFilters?: Partial<FilterCriteria>;
  data?: any[];
  savedFilters?: Array<{ id: string; name: string; filters: FilterCriteria }>;
  onSaveFilter?: (name: string, filters: FilterCriteria) => void;
  onLoadFilter?: (filters: FilterCriteria) => void;
}

export const AdvancedFilter: FC<AdvancedFilterProps> = ({
  type,
  onFiltersChange,
  initialFilters = {},
  data = [],
  savedFilters = [],
  onSaveFilter,
  onLoadFilter
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterCriteria>({
    search: '',
    status: [],
    dateRange: { start: null, end: null },
    valueRange: { min: null, max: null },
    tags: [],
    assignedTo: [],
    source: [],
    location: [],
    company: [],
    priority: [],
    customFields: {},
    ...initialFilters
  });

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveFilterName, setSaveFilterName] = useState('');

  // Filter options based on type and data
  const filterOptions = useMemo(() => {
    const getUniqueValues = (field: string) => {
      const values = data.map(item => item[field]).filter(Boolean);
      return [...new Set(values)].map(value => ({ value, label: value }));
    };

    const statusOptions: FilterOption[] = type === 'deals' 
      ? [
          { value: 'discovery', label: 'Discovery' },
          { value: 'qualification', label: 'Qualification' },
          { value: 'proposal', label: 'Proposal' },
          { value: 'negotiation', label: 'Negotiation' },
          { value: 'closed-won', label: 'Closed Won' },
          { value: 'closed-lost', label: 'Closed Lost' }
        ]
      : type === 'contacts'
      ? [
          { value: 'lead', label: 'Lead' },
          { value: 'prospect', label: 'Prospect' },
          { value: 'customer', label: 'Customer' },
          { value: 'inactive', label: 'Inactive' }
        ]
      : [
          { value: 'active', label: 'Active' },
          { value: 'prospect', label: 'Prospect' },
          { value: 'customer', label: 'Customer' },
          { value: 'inactive', label: 'Inactive' }
        ];

    return {
      status: statusOptions,
      tags: getUniqueValues('tags').slice(0, 20),
      assignedTo: getUniqueValues('assignedTo'),
      source: getUniqueValues('source'),
      location: getUniqueValues('location'),
      company: getUniqueValues('company'),
      priority: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]
    };
  }, [data, type]);

  // Update filters
  const updateFilters = (newFilters: Partial<FilterCriteria>) => {
    const updated = { ...activeFilters, ...newFilters };
    setActiveFilters(updated);
    onFiltersChange(updated);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const cleared: FilterCriteria = {
      search: '',
      status: [],
      dateRange: { start: null, end: null },
      valueRange: { min: null, max: null },
      tags: [],
      assignedTo: [],
      source: [],
      location: [],
      company: [],
      priority: [],
      customFields: {}
    };
    setActiveFilters(cleared);
    onFiltersChange(cleared);
  };

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      activeFilters.search ||
      activeFilters.status.length > 0 ||
      activeFilters.dateRange.start ||
      activeFilters.dateRange.end ||
      activeFilters.valueRange.min !== null ||
      activeFilters.valueRange.max !== null ||
      activeFilters.tags.length > 0 ||
      activeFilters.assignedTo.length > 0 ||
      activeFilters.source.length > 0 ||
      activeFilters.location.length > 0 ||
      activeFilters.company.length > 0 ||
      activeFilters.priority.length > 0 ||
      Object.keys(activeFilters.customFields).length > 0
    );
  }, [activeFilters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.search) count++;
    if (activeFilters.status.length > 0) count++;
    if (activeFilters.dateRange.start || activeFilters.dateRange.end) count++;
    if (activeFilters.valueRange.min !== null || activeFilters.valueRange.max !== null) count++;
    if (activeFilters.tags.length > 0) count++;
    if (activeFilters.assignedTo.length > 0) count++;
    if (activeFilters.source.length > 0) count++;
    if (activeFilters.location.length > 0) count++;
    if (activeFilters.company.length > 0) count++;
    if (activeFilters.priority.length > 0) count++;
    count += Object.keys(activeFilters.customFields).length;
    return count;
  }, [activeFilters]);

  // Multi-select component
  const MultiSelect: FC<{
    options: FilterOption[];
    values: string[];
    onChange: (values: string[]) => void;
    placeholder: string;
    icon?: React.ReactNode;
  }> = ({ options, values, onChange, placeholder, icon }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center space-x-2">
            {icon}
            <span className={values.length === 0 ? 'text-gray-500' : 'text-gray-900 dark:text-white'}>
              {values.length === 0 ? placeholder : `${values.length} selected`}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map(option => (
              <div
                key={option.value}
                className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  const newValues = values.includes(option.value)
                    ? values.filter(v => v !== option.value)
                    : [...values, option.value];
                  onChange(newValues);
                }}
              >
                <div className={`w-4 h-4 border rounded mr-3 flex items-center justify-center ${
                  values.includes(option.value) 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {values.includes(option.value) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-gray-900 dark:text-white flex-1">
                  {option.label}
                </span>
                {option.count && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({option.count})
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleSaveFilter = () => {
    if (saveFilterName.trim() && onSaveFilter) {
      onSaveFilter(saveFilterName.trim(), activeFilters);
      setSaveFilterName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative flex-1 min-w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={activeFilters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {activeFilters.search && (
              <button
                onClick={() => updateFilters({ search: '' })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <div className="relative">
              <select
                onChange={(e) => {
                  const filter = savedFilters.find(f => f.id === e.target.value);
                  if (filter && onLoadFilter) {
                    onLoadFilter(filter.filters);
                    setActiveFilters(filter.filters);
                  }
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Saved Filters</option>
                {savedFilters.map(filter => (
                  <option key={filter.id} value={filter.id}>
                    {filter.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Save Filter */}
          {hasActiveFilters && onSaveFilter && (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span className="text-sm">Save</span>
            </button>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <MultiSelect
                options={filterOptions.status}
                values={activeFilters.status}
                onChange={(values) => updateFilters({ status: values })}
                placeholder="Select status"
                icon={<Tag className="w-4 h-4 text-gray-400" />}
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={activeFilters.dateRange.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => updateFilters({
                    dateRange: {
                      ...activeFilters.dateRange,
                      start: e.target.value ? new Date(e.target.value) : null
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={activeFilters.dateRange.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => updateFilters({
                    dateRange: {
                      ...activeFilters.dateRange,
                      end: e.target.value ? new Date(e.target.value) : null
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Value Range (for deals) */}
            {type === 'deals' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Value Range
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min value"
                    value={activeFilters.valueRange.min || ''}
                    onChange={(e) => updateFilters({
                      valueRange: {
                        ...activeFilters.valueRange,
                        min: e.target.value ? Number(e.target.value) : null
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max value"
                    value={activeFilters.valueRange.max || ''}
                    onChange={(e) => updateFilters({
                      valueRange: {
                        ...activeFilters.valueRange,
                        max: e.target.value ? Number(e.target.value) : null
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assigned To
              </label>
              <MultiSelect
                options={filterOptions.assignedTo}
                values={activeFilters.assignedTo}
                onChange={(values) => updateFilters({ assignedTo: values })}
                placeholder="Select assignee"
                icon={<Users className="w-4 h-4 text-gray-400" />}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <MultiSelect
                options={filterOptions.tags}
                values={activeFilters.tags}
                onChange={(values) => updateFilters({ tags: values })}
                placeholder="Select tags"
                icon={<Tag className="w-4 h-4 text-gray-400" />}
              />
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source
              </label>
              <MultiSelect
                options={filterOptions.source}
                values={activeFilters.source}
                onChange={(values) => updateFilters({ source: values })}
                placeholder="Select source"
                icon={<Star className="w-4 h-4 text-gray-400" />}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <MultiSelect
                options={filterOptions.location}
                values={activeFilters.location}
                onChange={(values) => updateFilters({ location: values })}
                placeholder="Select location"
                icon={<MapPin className="w-4 h-4 text-gray-400" />}
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company
              </label>
              <MultiSelect
                options={filterOptions.company}
                values={activeFilters.company}
                onChange={(values) => updateFilters({ company: values })}
                placeholder="Select company"
                icon={<Building className="w-4 h-4 text-gray-400" />}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <MultiSelect
                options={filterOptions.priority}
                values={activeFilters.priority}
                onChange={(values) => updateFilters({ priority: values })}
                placeholder="Select priority"
                icon={<SlidersHorizontal className="w-4 h-4 text-gray-400" />}
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {activeFilters.search && (
              <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                <Search className="w-3 h-3" />
                <span>"{activeFilters.search}"</span>
                <button
                  onClick={() => updateFilters({ search: '' })}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {activeFilters.status.map(status => (
              <div key={status} className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                <span>{status}</span>
                <button
                  onClick={() => updateFilters({ 
                    status: activeFilters.status.filter(s => s !== status) 
                  })}
                  className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {(activeFilters.dateRange.start || activeFilters.dateRange.end) && (
              <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                <Calendar className="w-3 h-3" />
                <span>
                  {activeFilters.dateRange.start?.toLocaleDateString()} - {activeFilters.dateRange.end?.toLocaleDateString()}
                </span>
                <button
                  onClick={() => updateFilters({ dateRange: { start: null, end: null } })}
                  className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Add more filter tag types as needed */}
          </div>
        </div>
      )}

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Save Filter
            </h3>
            <input
              type="text"
              placeholder="Enter filter name"
              value={saveFilterName}
              onChange={(e) => setSaveFilterName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setSaveFilterName('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFilter}
                disabled={!saveFilterName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
