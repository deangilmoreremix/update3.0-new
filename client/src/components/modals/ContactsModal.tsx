import React, { useState, useEffect, useMemo } from 'react';
import { AvatarWithStatus } from '../ui/AvatarWithStatus';
import { ModernButton } from '../ui/ModernButton';
import { ContactDetailView } from '../contacts/ContactDetailView';
import { NewContactModal } from './NewContactModal';
import { ImportContactsModal } from './ImportContactsModal';
import { AIEnhancedContactCard } from '../contacts/AIEnhancedContactCard';
import { useContactStore } from '../../store/contactStore';
import { Contact } from '../../types/index';
import { aiEnrichmentService } from '../../services/aiEnrichmentService';
import {
  X,
  Search,
  Filter,
  ChevronDown,
  Grid3X3,
  List,
  Plus,
  Users,
  Upload,
  Download,
  Zap,
  Target,
  CheckCheck,
  CheckCircle,
  Loader2,
  Sparkles,
  Brain
} from 'lucide-react';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const filterOptions = [
  { value: 'all', label: 'All Contacts' },
  { value: 'hot', label: 'Hot Prospects' },
  { value: 'medium', label: 'Medium Interest' },
  { value: 'low', label: 'Low Interest' },
  { value: 'cold', label: 'Cold Contacts' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'recent', label: 'Recently Added' }
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'lead', label: 'Leads' },
  { value: 'prospect', label: 'Prospects' },
  { value: 'customer', label: 'Customers' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'churned', label: 'Churned' }
];

export const ContactsModal: React.FC<ContactsModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [bulkActionDropdown, setBulkActionDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [sortBy, setSortBy] = useState<'name' | 'company' | 'score' | 'updated'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Selection state
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  
  // Modal states
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // AI Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingContactIds, setAnalyzingContactIds] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState<{ current: number; total: number } | null>(null);
  const [aiResults, setAiResults] = useState<{ success: number; failed: number } | null>(null);
  
  const { contacts, fetchContacts, updateContact } = useContactStore();

  // Load contacts on mount
  useEffect(() => {
    if (isOpen) {
      fetchContacts();
    }
  }, [isOpen, fetchContacts]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsFilterDropdownOpen(false);
      setIsStatusDropdownOpen(false);
      setBulkActionDropdown(false);
    };

    if (isFilterDropdownOpen || isStatusDropdownOpen || bulkActionDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isFilterDropdownOpen, isStatusDropdownOpen, bulkActionDropdown]);

  // Computed values
  const activeFilterLabel = filterOptions.find(f => f.value === activeFilter)?.label || 'All Contacts';
  const activeStatusLabel = statusOptions.find(s => s.value === statusFilter)?.label || 'All Status';

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    let filtered = [...contacts];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.company.toLowerCase().includes(searchLower) ||
        contact.title.toLowerCase().includes(searchLower)
      );
    }

    // Apply interest level filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'favorites') {
        filtered = filtered.filter(contact => contact.isFavorite);
      } else if (activeFilter === 'recent') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(contact => new Date(contact.createdAt) > weekAgo);
      } else {
        filtered = filtered.filter(contact => contact.interestLevel === activeFilter);
      }
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'score':
          aValue = a.aiScore || 0;
          bValue = b.aiScore || 0;
          break;
        case 'updated':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [contacts, searchTerm, activeFilter, statusFilter, sortBy, sortOrder]);

  // Event handlers
  const handleFilterClick = (filterValue: string) => {
    setActiveFilter(filterValue);
    setIsFilterDropdownOpen(false);
  };

  const handleStatusFilterClick = (statusValue: string) => {
    setStatusFilter(statusValue);
    setIsStatusDropdownOpen(false);
  };

  const handleContactSelect = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleContactDetailClose = () => {
    setSelectedContact(null);
  };

  const handleNewContactClick = () => {
    setIsNewContactModalOpen(true);
  };

  const handleNewContactModalClose = () => {
    setIsNewContactModalOpen(false);
  };

  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  const handleImportModalClose = () => {
    setIsImportModalOpen(false);
  };

  const handleAnalyzeContact = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    setAnalyzingContactIds(prev => [...prev, contactId]);

    try {
      const result = await aiEnrichmentService.enrichContact(contact);
      if (result.success && result.enrichedData) {
        await updateContact(contactId, result.enrichedData);
      }
    } catch (error) {
      console.error('Failed to analyze contact:', error);
    } finally {
      setAnalyzingContactIds(prev => prev.filter(id => id !== contactId));
    }
  };

  const handleAnalyzeSelected = async () => {
    if (selectedContacts.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisProgress({ current: 0, total: selectedContacts.length });
    setBulkActionDropdown(false);

    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < selectedContacts.length; i++) {
      const contactId = selectedContacts[i];
      const contact = contacts.find(c => c.id === contactId);
      
      if (contact) {
        try {
          const result = await aiEnrichmentService.enrichContact(contact);
          if (result.success && result.enrichedData) {
            await updateContact(contactId, result.enrichedData);
            successCount++;
          } else {
            failedCount++;
          }
        } catch (error) {
          failedCount++;
        }
      }

      setAnalysisProgress({ current: i + 1, total: selectedContacts.length });
      
      // Small delay to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsAnalyzing(false);
    setAnalysisProgress(null);
    setAiResults({ success: successCount, failed: failedCount });
    setSelectedContacts([]);
  };

  const handleBulkAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress({ current: 0, total: filteredContacts.length });

    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < filteredContacts.length; i++) {
      const contact = filteredContacts[i];
      
      try {
        const result = await aiEnrichmentService.enrichContact(contact);
        if (result.success && result.enrichedData) {
          await updateContact(contact.id, result.enrichedData);
          successCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        failedCount++;
      }

      setAnalysisProgress({ current: i + 1, total: filteredContacts.length });
      
      // Small delay to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsAnalyzing(false);
    setAnalysisProgress(null);
    setAiResults({ success: successCount, failed: failedCount });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-7xl h-[95vh] flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 flex-shrink-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-xl text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    Contact Management
                    <Brain className="w-6 h-6 ml-2 text-purple-600" />
                  </h2>
                  <p className="text-gray-600">
                    Manage {contacts.length} contacts with AI-powered insights
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {/* Bulk AI Analysis */}
                <ModernButton
                  variant="secondary"
                  size="sm"
                  onClick={handleBulkAIAnalysis}
                  disabled={isAnalyzing || filteredContacts.length === 0}
                  className="flex items-center space-x-2 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                >
                  <Brain className="w-4 h-4" />
                  <span>{isAnalyzing ? 'Analyzing...' : 'AI Analyze All'}</span>
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                </ModernButton>

                {/* Analyze Selected Button */}
                {selectedContacts.length > 0 && (
                  <ModernButton
                    variant="outline"
                    size="sm"
                    onClick={handleAnalyzeSelected}
                    disabled={isAnalyzing}
                    className="flex items-center space-x-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  >
                    <Target className="w-4 h-4" />
                    <span>{isAnalyzing ? 'Processing...' : `Analyze Selected (${selectedContacts.length})`}</span>
                  </ModernButton>
                )}
              </div>

              {/* Bulk Actions */}
              {selectedContacts.length > 0 && (
                <div className="relative">
                  <ModernButton
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkActionDropdown(!bulkActionDropdown)}
                    className="flex items-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Actions</span>
                    <ChevronDown className="w-4 h-4" />
                  </ModernButton>
                  
                  {bulkActionDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
                      <button
                        onClick={handleAnalyzeSelected}
                        disabled={isAnalyzing}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-lg disabled:opacity-50"
                      >
                        Re-analyze Selected
                      </button>
                      <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        Export Selected
                      </button>
                      <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        Add Tags
                      </button>
                      <button 
                        onClick={() => setSelectedContacts([])}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors last:rounded-b-lg"
                      >
                        Clear Selection
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Import/Export */}
              <ModernButton 
                variant="outline" 
                size="sm" 
                onClick={handleImportClick}
                className="flex items-center space-x-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              >
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </ModernButton>
              
              <ModernButton 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </ModernButton>
              
              <ModernButton 
                variant="primary" 
                size="sm" 
                onClick={handleNewContactClick}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Contact</span>
              </ModernButton>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* AI Analysis Progress */}
          {(isAnalyzing || analysisProgress || aiResults) && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200">
              {analysisProgress && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                    <span className="font-medium text-purple-900">
                      Analyzing contacts... ({analysisProgress.current}/{analysisProgress.total})
                    </span>
                  </div>
                  <div className="flex-1 max-w-xs">
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(analysisProgress.current / analysisProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-purple-700">
                    {Math.round((analysisProgress.current / analysisProgress.total) * 100)}%
                  </span>
                </div>
              )}

              {aiResults && !analysisProgress && (
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">
                    AI Analysis Complete: {aiResults.success} contacts scored successfully
                    {aiResults.failed > 0 && `, ${aiResults.failed} failed`}
                  </span>
                  <button
                    onClick={() => setAiResults(null)}
                    className="text-green-700 hover:text-green-900 text-sm underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              
              {/* Interest Level Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>{activeFilterLabel}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFilterDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
                    {filterOptions.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => handleFilterClick(filter.value)}
                        className={`
                          w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg
                          ${activeFilter === filter.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}
                        `}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>{activeStatusLabel}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isStatusDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusFilterClick(option.value)}
                        className={`
                          w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg
                          ${statusFilter === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Select All */}
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                <span>{selectedContacts.length === filteredContacts.length ? 'Deselect All' : 'Select All'}</span>
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              {/* Sort Dropdown */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as typeof sortBy);
                  setSortOrder(order as typeof sortOrder);
                }}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="company-asc">Company A-Z</option>
                <option value="company-desc">Company Z-A</option>
                <option value="score-desc">Highest Score</option>
                <option value="score-asc">Lowest Score</option>
                <option value="updated-desc">Recently Updated</option>
                <option value="updated-asc">Oldest Updated</option>
              </select>

              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 text-sm font-medium transition-colors ${
                    viewMode === 'card' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 text-sm font-medium border-l border-gray-300 transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Contacts Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Users className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No contacts found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                <ModernButton 
                  variant="primary" 
                  onClick={handleNewContactClick}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Your First Contact</span>
                </ModernButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredContacts.map((contact) => (
                  <AIEnhancedContactCard
                    key={contact.id}
                    contact={contact}
                    isSelected={selectedContacts.includes(contact.id)}
                    onSelect={() => handleContactSelect(contact.id)}
                    onClick={() => handleContactClick(contact)}
                    onAnalyze={handleAnalyzeContact}
                    isAnalyzing={analyzingContactIds.includes(contact.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import Contacts Modal */}
      <ImportContactsModal
        isOpen={isImportModalOpen}
        onClose={handleImportModalClose}
      />

      {/* New Contact Modal */}
      <NewContactModal
        isOpen={isNewContactModalOpen}
        onClose={handleNewContactModalClose}
      />

      {/* Contact Detail Modal */}
      {selectedContact && (
        <ContactDetailView
          contact={selectedContact}
          isOpen={!!selectedContact}
          onClose={handleContactDetailClose}
          onUpdate={updateContact}
        />
      )}
    </>
  );
};