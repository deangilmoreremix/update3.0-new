import React, { useState, useRef } from 'react';
import { ModernButton } from '../ui/ModernButton';
import { useContactStore } from '../../store/contactStore';
import { Contact } from '../../types/index';
import { AlertCircle, CheckCircle, Database, Download, File, FileSpreadsheet, FileText, Info, Upload, X } from 'lucide-react';

interface ImportContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CSV_TEMPLATE_HEADERS = [
  'firstName',
  'lastName', 
  'name',
  'email',
  'phone',
  'title',
  'company',
  'industry',
  'sources',
  'interestLevel',
  'status',
  'notes',
  'tags'
];

const SAMPLE_CSV_DATA = [
  [
    'John',
    'Smith', 
    'John Smith',
    'john.smith@company.com',
    '+1-555-0123',
    'Marketing Director',
    'Tech Corp',
    'Technology',
    'LinkedIn,Email',
    'hot',
    'prospect',
    'Interested in enterprise solutions',
    'Enterprise,High Value'
  ],
  [
    'Sarah',
    'Johnson',
    'Sarah Johnson', 
    'sarah.j@startup.io',
    '+1-555-0456',
    'CEO',
    'Startup Inc',
    'Software',
    'Referral',
    'medium',
    'lead',
    'Referred by existing client',
    'Startup,Referral'
  ]
];

const parseCSV = (text: string): string[][] => {
  const lines = text.split('\n').filter(line => line.trim());
  return lines.map(line => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (const i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i-1] === ',')) {
        inQuotes = true;
      } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  });
};

const validateContact = (data: Record<string, string>): string[] => {
  const errors = [];
  
  if (!data.email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (!data.name && (!data.firstName || !data.lastName)) {
    errors.push('Name or firstName + lastName is required');
  }
  
  if (!data.company) {
    errors.push('Company is required');
  }
  
  if (data.interestLevel && !['hot', 'medium', 'low', 'cold'].includes(data.interestLevel)) {
    errors.push('Interest level must be: hot, medium, low, or cold');
  }
  
  if (data.status && !['lead', 'prospect', 'customer', 'churned', 'active', 'pending', 'inactive'].includes(data.status)) {
    errors.push('Status must be: lead, prospect, customer, churned, active, pending, or inactive');
  }
  
  return errors;
};

export const ImportContactsModal: React.FC<ImportContactsModalProps> = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [parsedContacts, setParsedContacts] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'guide' | 'upload' | 'preview'>('guide');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importContacts } = useContactStore();

  const downloadTemplate = () => {
    const csvContent = [
      CSV_TEMPLATE_HEADERS.join(','),
      ...SAMPLE_CSV_DATA.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setErrors(['Please select a CSV file']);
      return;
    }
    
    setFile(selectedFile);
    setErrors([]);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = parseCSV(text);
        setCsvData(parsed);
        processCSVData(parsed);
        setActiveTab('preview');
      } catch (error) {
        setErrors(['Failed to parse CSV file']);
      }
    };
    reader.readAsText(selectedFile);
  };

  const processCSVData = (data: string[][]) => {
    if (data.length < 2) {
      setErrors(['CSV must contain at least a header row and one data row']);
      return;
    }
    
    const headers = data[0].map(h => h.toLowerCase().trim());
    const rows = data.slice(1);
    const newErrors: string[] = [];
    const contacts: unknown[] = [];
    
    rows.forEach((row, index) => {
      const contact: unknown = {};
      
      headers.forEach((header, colIndex) => {
        if (row[colIndex]) {
          contact[header] = row[colIndex].trim();
        }
      });
      
      // Generate full name if not provided
      if (!contact.name && contact.firstname && contact.lastname) {
        contact.name = `${contact.firstname} ${contact.lastname}`;
      }
      
      // Default values
      contact.sources = contact.sources ? contact.sources.split(',').map((s: string) => s.trim()) : ['Manual Import'];
      contact.interestLevel = contact.interestlevel || 'medium';
      contact.status = contact.status || 'lead';
      contact.avatarSrc = `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`;
      contact.tags = contact.tags ? contact.tags.split(',').map((t: string) => t.trim()) : [];
      
      const validationErrors = validateContact(contact);
      if (validationErrors.length > 0) {
        newErrors.push(`Row ${index + 2}: ${validationErrors.join(', ')}`);
      } else {
        contacts.push(contact);
      }
    });
    
    setErrors(newErrors);
    setParsedContacts(contacts);
  };

  const handleImport = async () => {
    if (parsedContacts.length === 0) return;
    
    setIsProcessing(true);
    try {
      await importContacts(parsedContacts);
      setImportResults({ success: parsedContacts.length, failed: errors.length });
      setActiveTab('preview');
    } catch (error) {
      setErrors(['Failed to import contacts']);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setCsvData([]);
    setParsedContacts([]);
    setErrors([]);
    setImportResults(null);
    setActiveTab('guide');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl text-white">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Import Contacts</h2>
              <p className="text-gray-600">Upload CSV file to import multiple contacts</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'guide', label: 'CSV Format Guide', icon: Info },
            { id: 'upload', label: 'Upload File', icon: Upload },
            { id: 'preview', label: 'Preview & Import', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">CSV Format Requirements</h3>
                    <p className="text-blue-800">Follow this guide to ensure your CSV file imports correctly.</p>
                  </div>
                </div>
              </div>

              {/* Required Fields */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  Required Fields
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { field: 'email', description: 'Valid email address (e.g., john@company.com)' },
                    { field: 'name', description: 'Full name OR firstName + lastName' },
                    { field: 'company', description: 'Company name' },
                    { field: 'title', description: 'Job title or position' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">{item.field}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Fields */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Optional Fields
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { field: 'phone', description: 'Phone number with country code' },
                    { field: 'industry', description: 'Industry category' },
                    { field: 'sources', description: 'Comma-separated (LinkedIn,Email,Website)' },
                    { field: 'interestLevel', description: 'hot, medium, low, or cold' },
                    { field: 'status', description: 'lead, prospect, customer, or churned' },
                    { field: 'notes', description: 'Additional notes about the contact' },
                    { field: 'tags', description: 'Comma-separated tags (Enterprise,VIP)' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">{item.field}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Template */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileSpreadsheet className="w-5 h-5 mr-2 text-purple-500" />
                  Download CSV Template
                </h4>
                <p className="text-gray-600 mb-4">
                  Download our pre-formatted CSV template with sample data to get started quickly.
                </p>
                <ModernButton
                  variant="outline"
                  onClick={downloadTemplate}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Template</span>
                </ModernButton>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Drop your CSV file here
                    </h3>
                    <p className="text-gray-600 mb-4">
                      or click to browse your files
                    </p>
                  </div>
                  <ModernButton
                    variant="primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select CSV File
                  </ModernButton>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>

              {/* File Info */}
              {file && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">{file.name}</p>
                      <p className="text-sm text-blue-700">
                        {(file.size / 1024).toFixed(1)} KB • Ready to process
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Errors */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900 mb-2">Processing Errors</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-blue-500" />
                  Import Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{parsedContacts.length}</div>
                    <div className="text-sm text-green-700">Valid Contacts</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{errors.length}</div>
                    <div className="text-sm text-red-700">Errors Found</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{csvData.length - 1}</div>
                    <div className="text-sm text-blue-700">Total Rows</div>
                  </div>
                </div>
              </div>

              {/* Import Results */}
              {importResults && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-900">Import Completed!</h4>
                      <p className="text-sm text-green-700">
                        Successfully imported {importResults.success} contacts
                        {importResults.failed > 0 && ` (${importResults.failed} failed)`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              {parsedContacts.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900">Contact Preview</h4>
                    <p className="text-sm text-gray-600">First 5 contacts to be imported</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {parsedContacts.slice(0, 5).map((contact, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {contact.name || `${contact.firstName} ${contact.lastName}`}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {contact.email}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {contact.company}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {contact.title}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {contact.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedContacts.length > 5 && (
                    <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
                      Showing 5 of {parsedContacts.length} contacts
                    </div>
                  )}
                </div>
              )}

              {/* Errors List */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Validation Errors</h4>
                  <div className="max-h-40 overflow-y-auto">
                    <ul className="text-sm text-red-700 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Import Button */}
              {parsedContacts.length > 0 && !importResults && (
                <div className="flex justify-end">
                  <ModernButton
                    variant="primary"
                    onClick={handleImport}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    {isProcessing ? 'Importing...' : `Import ${parsedContacts.length} Contacts`}
                  </ModernButton>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};