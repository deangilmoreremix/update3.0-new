import React, { useState, useMemo } from 'react';
import {
  Download, FileText, FileSpreadsheet, Database,
  Calendar, Filter, Settings, Check, X, Loader2,
  ChevronDown, Eye, RefreshCw, AlertCircle, Info
} from 'lucide-react';

interface ExportField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array';
  selected: boolean;
  format?: string;
}

interface ExportOptions {
  format: 'csv' | 'excel' | 'json' | 'pdf';
  fields: ExportField[];
  filters: any;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  includeMetadata: boolean;
  groupBy?: string;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
}

interface DataExportProps {
  data: any[];
  type: 'deals' | 'contacts' | 'companies' | 'activities';
  onExport: (options: ExportOptions) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
  customFields?: ExportField[];
}

export const DataExport: React.FC<DataExportProps> = ({
  data,
  type,
  onExport,
  isOpen,
  onClose,
  customFields = []
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'format' | 'fields' | 'options' | 'preview'>('format');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    fields: [],
    filters: {},
    dateRange: { start: null, end: null },
    includeMetadata: true,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Default fields based on type
  const defaultFields = useMemo((): ExportField[] => {
    const getFieldsForType = () => {
      switch (type) {
        case 'deals':
          return [
            { key: 'id', label: 'ID', type: 'string', selected: false },
            { key: 'title', label: 'Title', type: 'string', selected: true },
            { key: 'value', label: 'Value', type: 'number', selected: true, format: 'currency' },
            { key: 'stage', label: 'Stage', type: 'string', selected: true },
            { key: 'status', label: 'Status', type: 'string', selected: true },
            { key: 'probability', label: 'Probability', type: 'number', selected: false, format: 'percentage' },
            { key: 'assignedTo', label: 'Assigned To', type: 'string', selected: true },
            { key: 'company', label: 'Company', type: 'string', selected: true },
            { key: 'contact', label: 'Contact', type: 'string', selected: true },
            { key: 'source', label: 'Source', type: 'string', selected: false },
            { key: 'tags', label: 'Tags', type: 'array', selected: false },
            { key: 'createdAt', label: 'Created Date', type: 'date', selected: true },
            { key: 'updatedAt', label: 'Last Updated', type: 'date', selected: false },
            { key: 'closedAt', label: 'Closed Date', type: 'date', selected: false },
            { key: 'expectedCloseDate', label: 'Expected Close Date', type: 'date', selected: false }
          ];
        
        case 'contacts':
          return [
            { key: 'id', label: 'ID', type: 'string', selected: false },
            { key: 'name', label: 'Name', type: 'string', selected: true },
            { key: 'email', label: 'Email', type: 'string', selected: true },
            { key: 'phone', label: 'Phone', type: 'string', selected: true },
            { key: 'company', label: 'Company', type: 'string', selected: true },
            { key: 'title', label: 'Job Title', type: 'string', selected: true },
            { key: 'status', label: 'Status', type: 'string', selected: true },
            { key: 'source', label: 'Source', type: 'string', selected: false },
            { key: 'location', label: 'Location', type: 'string', selected: false },
            { key: 'tags', label: 'Tags', type: 'array', selected: false },
            { key: 'assignedTo', label: 'Assigned To', type: 'string', selected: false },
            { key: 'lastContact', label: 'Last Contact', type: 'date', selected: false },
            { key: 'createdAt', label: 'Created Date', type: 'date', selected: true },
            { key: 'updatedAt', label: 'Last Updated', type: 'date', selected: false }
          ];
        
        case 'companies':
          return [
            { key: 'id', label: 'ID', type: 'string', selected: false },
            { key: 'name', label: 'Company Name', type: 'string', selected: true },
            { key: 'industry', label: 'Industry', type: 'string', selected: true },
            { key: 'size', label: 'Company Size', type: 'string', selected: true },
            { key: 'revenue', label: 'Annual Revenue', type: 'number', selected: false, format: 'currency' },
            { key: 'website', label: 'Website', type: 'string', selected: false },
            { key: 'location', label: 'Location', type: 'string', selected: true },
            { key: 'status', label: 'Status', type: 'string', selected: true },
            { key: 'assignedTo', label: 'Account Owner', type: 'string', selected: true },
            { key: 'tags', label: 'Tags', type: 'array', selected: false },
            { key: 'createdAt', label: 'Created Date', type: 'date', selected: true },
            { key: 'updatedAt', label: 'Last Updated', type: 'date', selected: false }
          ];
        
        case 'activities':
          return [
            { key: 'id', label: 'ID', type: 'string', selected: false },
            { key: 'type', label: 'Activity Type', type: 'string', selected: true },
            { key: 'title', label: 'Title', type: 'string', selected: true },
            { key: 'description', label: 'Description', type: 'string', selected: false },
            { key: 'status', label: 'Status', type: 'string', selected: true },
            { key: 'assignedTo', label: 'Assigned To', type: 'string', selected: true },
            { key: 'relatedTo', label: 'Related To', type: 'string', selected: true },
            { key: 'dueDate', label: 'Due Date', type: 'date', selected: true },
            { key: 'completedAt', label: 'Completed Date', type: 'date', selected: false },
            { key: 'createdAt', label: 'Created Date', type: 'date', selected: true }
          ];
        
        default:
          return [];
      }
    };

    return [...getFieldsForType(), ...customFields];
  }, [type, customFields]);

  // Initialize fields
  React.useEffect(() => {
    setExportOptions(prev => ({
      ...prev,
      fields: defaultFields
    }));
  }, [defaultFields]);

  // Format options
  const formatOptions = [
    {
      value: 'csv',
      label: 'CSV',
      description: 'Comma-separated values, compatible with Excel and most tools',
      icon: <FileText className="w-6 h-6" />,
      recommended: true
    },
    {
      value: 'excel',
      label: 'Excel',
      description: 'Microsoft Excel format with formatting and multiple sheets',
      icon: <FileSpreadsheet className="w-6 h-6" />
    },
    {
      value: 'json',
      label: 'JSON',
      description: 'JavaScript Object Notation, ideal for developers and APIs',
      icon: <Database className="w-6 h-6" />
    },
    {
      value: 'pdf',
      label: 'PDF',
      description: 'Formatted report document, ideal for sharing and printing',
      icon: <FileText className="w-6 h-6" />
    }
  ];

  // Update field selection
  const updateFieldSelection = (fieldKey: string, selected: boolean) => {
    setExportOptions(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.key === fieldKey ? { ...field, selected } : field
      )
    }));
  };

  // Select all fields
  const selectAllFields = () => {
    setExportOptions(prev => ({
      ...prev,
      fields: prev.fields.map(field => ({ ...field, selected: true }))
    }));
  };

  // Deselect all fields
  const deselectAllFields = () => {
    setExportOptions(prev => ({
      ...prev,
      fields: prev.fields.map(field => ({ ...field, selected: false }))
    }));
  };

  // Get preview data
  const previewData = useMemo(() => {
    const selectedFields = exportOptions.fields.filter(f => f.selected);
    return data.slice(0, 5).map(item => {
      const previewItem: any = {};
      selectedFields.forEach(field => {
        let value = item[field.key];
        
        // Format value based on type
        if (field.type === 'date' && value) {
          value = new Date(value).toLocaleDateString();
        } else if (field.type === 'number' && field.format === 'currency' && value) {
          value = `$${value.toLocaleString()}`;
        } else if (field.type === 'number' && field.format === 'percentage' && value) {
          value = `${value}%`;
        } else if (field.type === 'array' && Array.isArray(value)) {
          value = value.join(', ');
        }
        
        previewItem[field.label] = value || '';
      });
      return previewItem;
    });
  }, [data, exportOptions.fields]);

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(exportOptions);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Get estimated file size
  const getEstimatedSize = () => {
    const selectedFields = exportOptions.fields.filter(f => f.selected);
    const averageFieldSize = 20; // bytes
    const estimatedBytes = data.length * selectedFields.length * averageFieldSize;
    
    if (estimatedBytes < 1024) return `${estimatedBytes} B`;
    if (estimatedBytes < 1024 * 1024) return `${Math.round(estimatedBytes / 1024)} KB`;
    return `${Math.round(estimatedBytes / (1024 * 1024))} MB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Export {type.charAt(0).toUpperCase() + type.slice(1)}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {data.length} record{data.length !== 1 ? 's' : ''} available for export
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'format', label: 'Format' },
            { key: 'fields', label: 'Fields' },
            { key: 'options', label: 'Options' },
            { key: 'preview', label: 'Preview' }
          ].map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step.key
                    ? 'bg-blue-600 text-white'
                    : index < ['format', 'fields', 'options', 'preview'].indexOf(currentStep)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {index < ['format', 'fields', 'options', 'preview'].indexOf(currentStep) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep === step.key ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {step.label}
              </span>
              {index < 3 && (
                <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Format Selection */}
          {currentStep === 'format' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Choose Export Format
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formatOptions.map(format => (
                  <div
                    key={format.value}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      exportOptions.format === format.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setExportOptions(prev => ({ ...prev, format: format.value as any }))}
                  >
                    {format.recommended && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Recommended
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        exportOptions.format === format.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {format.icon}
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {format.label}
                      </h4>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Field Selection */}
          {currentStep === 'fields' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Select Fields to Export
                </h3>
                <div className="space-x-2">
                  <button
                    onClick={selectAllFields}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAllFields}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {exportOptions.fields.map(field => (
                  <div
                    key={field.key}
                    className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => updateFieldSelection(field.key, !field.selected)}
                  >
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      field.selected 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {field.selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {field.label}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {field.type}
                        {field.format && ` (${field.format})`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    {exportOptions.fields.filter(f => f.selected).length} of {exportOptions.fields.length} fields selected
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Export Options */}
          {currentStep === 'options' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Export Options
              </h3>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Date Range (optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <input
                      type="date"
                      value={exportOptions.dateRange.start?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          start: e.target.value ? new Date(e.target.value) : null
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">To</label>
                    <input
                      type="date"
                      value={exportOptions.dateRange.end?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          end: e.target.value ? new Date(e.target.value) : null
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Sort By
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={exportOptions.sortBy || ''}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {exportOptions.fields.filter(f => f.selected).map(field => (
                      <option key={field.key} value={field.key}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={exportOptions.sortOrder}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeMetadata}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Include metadata (export date, user, etc.)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Preview */}
          {currentStep === 'preview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Export Preview
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Estimated size: {getEstimatedSize()}
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Format</div>
                  <div className="font-medium text-gray-900 dark:text-white uppercase">
                    {exportOptions.format}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Records</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {data.length.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Fields</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {exportOptions.fields.filter(f => f.selected).length}
                  </div>
                </div>
              </div>

              {/* Data Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Data Preview (first 5 records)
                </h4>
                
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        {Object.keys(previewData[0] || {}).map(key => (
                          <th
                            key={key}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {previewData.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value: any, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                            >
                              {String(value).substring(0, 50)}
                              {String(value).length > 50 && '...'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            {currentStep !== 'format' && (
              <button
                onClick={() => {
                  const steps = ['format', 'fields', 'options', 'preview'];
                  const currentIndex = steps.indexOf(currentStep);
                  setCurrentStep(steps[currentIndex - 1] as any);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>

            {currentStep === 'preview' ? (
              <button
                onClick={handleExport}
                disabled={isExporting || exportOptions.fields.filter(f => f.selected).length === 0}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const steps = ['format', 'fields', 'options', 'preview'];
                  const currentIndex = steps.indexOf(currentStep);
                  setCurrentStep(steps[currentIndex + 1] as any);
                }}
                disabled={currentStep === 'fields' && exportOptions.fields.filter(f => f.selected).length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
