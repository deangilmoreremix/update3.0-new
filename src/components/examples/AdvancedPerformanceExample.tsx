import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { Search, Grid, List as ListIcon } from 'lucide-react';
import { 
  VirtualContactList, 
  VirtualDealList, 
  LazyComponent,
  OptimizedSalesPerformanceDashboard 
} from '../optimized';
import useWebWorker from '../../hooks/useWebWorker';
import { Deal, Contact } from '../../types';

interface AdvancedPerformanceExampleProps {
  contacts: Contact[];
  deals: Deal[];
}

const AdvancedPerformanceExample: React.FC<AdvancedPerformanceExampleProps> = ({
  contacts,
  deals
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedTab, setSelectedTab] = useState<'contacts' | 'deals' | 'analytics'>('contacts');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>(deals);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Web Worker for heavy computations
  const { calculateAnalytics, filterSearchResults } = useWebWorker();

  // Memoized search handler with debouncing
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    
    return (term: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsProcessing(true);
        
        if (selectedTab === 'contacts') {
          filterSearchResults(
            { items: contacts, query: term, fields: ['name', 'email', 'company', 'position'] },
            (result, error) => {
              if (!error) {
                setFilteredContacts(result);
              }
              setIsProcessing(false);
            }
          );
        } else if (selectedTab === 'deals') {
          filterSearchResults(
            { items: deals, query: term, fields: ['title', 'notes'] },
            (result, error) => {
              if (!error) {
                setFilteredDeals(result);
              }
              setIsProcessing(false);
            }
          );
        }
      }, 300);
    };
  }, [contacts, deals, selectedTab, filterSearchResults]);

  // Handle search term change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  }, [debouncedSearch]);

  // Tab change handler
  const handleTabChange = useCallback((tab: 'contacts' | 'deals' | 'analytics') => {
    setSelectedTab(tab);
    if (tab === 'analytics' && !analyticsData) {
      setIsProcessing(true);
      calculateAnalytics(
        { deals, contacts },
        (result, error) => {
          if (!error) {
            setAnalyticsData(result);
          }
          setIsProcessing(false);
        }
      );
    }
  }, [deals, contacts, analyticsData, calculateAnalytics]);

  // Memoized contact handlers
  const handleContactSelect = useCallback((contact: Contact) => {
    console.log('Selected contact:', contact.id);
  }, []);

  const handleContactEdit = useCallback((contact: Contact) => {
    console.log('Edit contact:', contact.id);
  }, []);

  const handleContactDelete = useCallback((contactId: string) => {
    console.log('Delete contact:', contactId);
  }, []);

  // Memoized deal handlers
  const handleDealSelect = useCallback((deal: Deal) => {
    console.log('Selected deal:', deal.id);
  }, []);

  const handleDealAnalyze = useCallback(async (deal: Deal) => {
    console.log('Analyze deal:', deal.id);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, []);

  // Performance metrics display
  const performanceMetrics = useMemo(() => ({
    totalContacts: contacts.length,
    totalDeals: deals.length,
    filteredContacts: filteredContacts.length,
    filteredDeals: filteredDeals.length,
    memoryUsage: (performance as any).memory ? 
      Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 'N/A'
  }), [contacts.length, deals.length, filteredContacts.length, filteredDeals.length]);

  return (
    <div className="space-y-6 p-6">
      {/* Header with Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Advanced Performance Demo
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div>📊 {performanceMetrics.totalContacts} contacts</div>
            <div>💼 {performanceMetrics.totalDeals} deals</div>
            <div>🧠 Memory: {performanceMetrics.memoryUsage}MB</div>
            {isProcessing && <div className="text-blue-600">⚡ Processing...</div>}
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search with web worker..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {(['contacts', 'deals', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === tab
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area with Lazy Loading */}
      <div className="space-y-6">
        {selectedTab === 'contacts' && (
          <LazyComponent
            height={600}
            className="w-full"
            fallback={
              <div className="animate-pulse bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Loading contacts...</div>
              </div>
            }
          >
            <VirtualContactList
              contacts={filteredContacts}
              onContactSelect={handleContactSelect}
              onContactEdit={handleContactEdit}
              onContactDelete={handleContactDelete}
              height={600}
              width="100%"
              itemHeight={120}
            />
          </LazyComponent>
        )}

        {selectedTab === 'deals' && (
          <LazyComponent
            height={600}
            className="w-full"
            fallback={
              <div className="animate-pulse bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Loading deals...</div>
              </div>
            }
          >
            <VirtualDealList
              deals={filteredDeals}
              onDealSelect={handleDealSelect}
              onDealAnalyze={handleDealAnalyze}
              height={600}
              width="100%"
              itemHeight={160}
            />
          </LazyComponent>
        )}

        {selectedTab === 'analytics' && (
          <LazyComponent
            height={800}
            className="w-full"
            fallback={
              <div className="animate-pulse bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Calculating analytics...</div>
              </div>
            }
          >
            <Suspense fallback={<div>Loading analytics dashboard...</div>}>
              <OptimizedSalesPerformanceDashboard
                contacts={contacts}
                deals={deals}
                isLoading={isProcessing}
              />
            </Suspense>
          </LazyComponent>
        )}
      </div>

      {/* Performance Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          🚀 Performance Optimizations Active
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-blue-700">
          <div>✅ Virtual Scrolling</div>
          <div>✅ Web Workers</div>
          <div>✅ Lazy Loading</div>
          <div>✅ React.memo</div>
          <div>✅ useMemo Hooks</div>
          <div>✅ useCallback Hooks</div>
          <div>✅ Intersection Observer</div>
          <div>✅ Debounced Search</div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPerformanceExample;
