import React, { useEffect, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  useContacts, 
  useDeals, 
  useContactSearch,
  usePrefetchRelatedData 
} from '../hooks/useOptimizedQueries';
import { 
  useContactStore, 
  useDealStore, 
  useUIStore,
  contactSelectors,
  dealSelectors 
} from '../store/optimizedStores';
import { queryKeys } from '../providers/QueryProvider';

// ===== CACHE-FIRST DATA INTEGRATION =====

export const CacheFirstDataProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const queryClient = useQueryClient();
  const { recordNetworkRequests } = useUIStore();
  
  // Sync React Query data to Zustand stores
  const syncDataToStores = useCallback(() => {
    // Get all cached contact data
    const contactQueries = queryClient.getQueriesData({
      queryKey: ['contacts'],
    });
    
    const allContacts: any[] = [];
    contactQueries.forEach(([, data]) => {
      if (Array.isArray(data)) {
        allContacts.push(...data);
      }
    });
    
    if (allContacts.length > 0) {
      useContactStore.getState().setContacts(allContacts);
    }
    
    // Get all cached deal data
    const dealQueries = queryClient.getQueriesData({
      queryKey: ['deals'],
    });
    
    const allDeals: any[] = [];
    dealQueries.forEach(([, data]) => {
      if (Array.isArray(data)) {
        allDeals.push(...data);
      }
    });
    
    if (allDeals.length > 0) {
      useDealStore.getState().setDeals(allDeals);
    }
  }, [queryClient]);
  
  // Monitor network requests
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      recordNetworkRequests();
      return originalFetch(...args);
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, [recordNetworkRequests]);
  
  // Sync data on mount and when cache updates
  useEffect(() => {
    syncDataToStores();
    
    // Listen for query cache updates
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      syncDataToStores();
    });
    
    return unsubscribe;
  }, [queryClient, syncDataToStores]);
  
  return <>{children}</>;
};

// ===== OPTIMIZED CONTACT LIST COMPONENT =====

export const OptimizedContactList: React.FC = React.memo(() => {
  const startTime = performance.now();
  
  // Use Zustand store for UI state
  const {
    filters,
    selectedContacts,
    updateFilters,
    toggleSelectContact,
    clearSelection,
  } = useContactStore();
  
  const { recordRenderTime } = useUIStore();
  
  // Use React Query for server state with cache-first strategy
  const {
    data: serverContacts = [],
    isLoading,
    error,
  } = useContacts(filters, {
    staleTime: 10 * 60 * 1000, // 10 minutes - prefer cache
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
  
  // Use computed data from Zustand
  const filteredContacts = useMemo(() => {
    return contactSelectors.filteredContacts();
  }, [filters]);
  
  const { prefetchContactDeals } = usePrefetchRelatedData();
  
  // Prefetch related data on hover
  const handleContactHover = useCallback((contactId: string) => {
    prefetchContactDeals(contactId);
  }, [prefetchContactDeals]);
  
  // Record render performance
  useEffect(() => {
    const endTime = performance.now();
    recordRenderTime(endTime - startTime);
  });
  
  if (isLoading) {
    return <div className="animate-pulse">Loading contacts...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">Error loading contacts</div>;
  }
  
  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <select
          value={filters.status}
          onChange={(e) => updateFilters({ status: e.target.value })}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="prospect">Prospect</option>
        </select>
      </div>
      
      {/* Selection Actions */}
      {selectedContacts.size > 0 && (
        <div className="flex gap-2 p-3 bg-blue-50 rounded-md">
          <span className="text-sm">
            {selectedContacts.size} contact(s) selected
          </span>
          <button
            onClick={clearSelection}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear selection
          </button>
        </div>
      )}
      
      {/* Contact List */}
      <div className="space-y-2">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
            onMouseEnter={() => handleContactHover(contact.id)}
            onClick={() => toggleSelectContact(contact.id)}
          >
            <input
              type="checkbox"
              checked={selectedContacts.has(contact.id)}
              onChange={() => toggleSelectContact(contact.id)}
              className="rounded"
            />
            <div className="flex-1">
              <div className="font-medium">{contact.name}</div>
              <div className="text-sm text-gray-500">{contact.email}</div>
              <div className="text-sm text-gray-400">{contact.company}</div>
            </div>
            <div className="text-sm">
              <span className={`px-2 py-1 rounded-full text-xs ${
                contact.status === 'active' ? 'bg-green-100 text-green-800' :
                contact.status === 'inactive' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {contact.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredContacts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No contacts found matching your criteria
        </div>
      )}
    </div>
  );
});

OptimizedContactList.displayName = 'OptimizedContactList';

// ===== OPTIMIZED DEAL PIPELINE =====

export const OptimizedDealPipeline: React.FC = React.memo(() => {
  const startTime = performance.now();
  
  // Use Zustand store for UI state
  const {
    pipelineView,
    filters,
    dragState,
    setPipelineView,
    updateFilters,
    startDrag,
    endDrag,
    setDropZone,
  } = useDealStore();
  
  const { recordRenderTime } = useUIStore();
  
  // Use React Query for server state
  const {
    data: serverDeals = [],
    isLoading,
    error,
  } = useDeals(filters, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
  
  // Use computed data from Zustand
  const dealsByStage = useMemo(() => {
    return dealSelectors.dealsByStage();
  }, [filters]);
  
  const totalValue = useMemo(() => {
    return dealSelectors.totalValue();
  }, [filters]);
  
  // Record render performance
  useEffect(() => {
    const endTime = performance.now();
    recordRenderTime(endTime - startTime);
  });
  
  // Pipeline stages
  const stages = [
    'lead',
    'qualified',
    'proposal',
    'negotiation',
    'closed-won',
    'closed-lost',
  ];
  
  if (isLoading) {
    return <div className="animate-pulse">Loading pipeline...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">Error loading deals</div>;
  }
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <h2 className="text-xl font-semibold">Deal Pipeline</h2>
          <div className="text-sm text-gray-500">
            Total Value: ${totalValue.toLocaleString()}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setPipelineView('kanban')}
            className={`px-3 py-1 rounded ${
              pipelineView === 'kanban' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setPipelineView('list')}
            className={`px-3 py-1 rounded ${
              pipelineView === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setPipelineView('analytics')}
            className={`px-3 py-1 rounded ${
              pipelineView === 'analytics' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search deals..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <select
          value={filters.assignedTo}
          onChange={(e) => updateFilters({ assignedTo: e.target.value })}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Assignees</option>
          <option value="user1">John Doe</option>
          <option value="user2">Jane Smith</option>
        </select>
      </div>
      
      {/* Kanban View */}
      {pipelineView === 'kanban' && (
        <div className="grid grid-cols-6 gap-4">
          {stages.map((stage) => (
            <div
              key={stage}
              className={`border rounded-lg p-4 min-h-96 ${
                dragState.dropZone === stage ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDropZone(stage);
              }}
              onDragLeave={() => setDropZone(null)}
              onDrop={(e) => {
                e.preventDefault();
                // Handle deal stage update
                endDrag();
              }}
            >
              <h3 className="font-medium mb-3 capitalize">
                {stage.replace('-', ' ')}
              </h3>
              <div className="space-y-2">
                {(dealsByStage[stage] || []).map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={() => startDrag(deal.id)}
                    onDragEnd={endDrag}
                    className="p-3 bg-white border rounded-md shadow-sm cursor-move hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium text-sm">{deal.title}</div>
                    <div className="text-xs text-gray-500">{deal.company}</div>
                    <div className="text-sm font-medium text-green-600 mt-1">
                      ${deal.value?.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* List View */}
      {pipelineView === 'list' && (
        <div className="space-y-2">
          {Object.values(dealsByStage).flat().map((deal) => (
            <div
              key={deal.id}
              className="flex items-center gap-4 p-3 border rounded-md hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="font-medium">{deal.title}</div>
                <div className="text-sm text-gray-500">{deal.company}</div>
              </div>
              <div className="text-sm">
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                  {deal.stage}
                </span>
              </div>
              <div className="font-medium text-green-600">
                ${deal.value?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Analytics View */}
      {pipelineView === 'analytics' && (
        <div className="grid grid-cols-3 gap-4">
          {stages.map((stage) => {
            const stageDeals = dealsByStage[stage] || [];
            const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
            
            return (
              <div key={stage} className="p-4 border rounded-lg">
                <h3 className="font-medium capitalize">{stage.replace('-', ' ')}</h3>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{stageDeals.length}</div>
                  <div className="text-sm text-gray-500">deals</div>
                  <div className="text-lg font-semibold text-green-600 mt-1">
                    ${stageValue.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

OptimizedDealPipeline.displayName = 'OptimizedDealPipeline';

// ===== SMART SEARCH COMPONENT =====

export const SmartSearch: React.FC = React.memo(() => {
  const [query, setQuery] = React.useState('');
  const [searchType, setSearchType] = React.useState<'contacts' | 'deals'>('contacts');
  
  // Debounced search
  const debouncedQuery = React.useMemo(() => {
    return query.trim();
  }, [query]);
  
  // Smart search with caching
  const {
    data: searchResults = [],
    isLoading,
    isFetching,
  } = useContactSearch(debouncedQuery, {
    enabled: debouncedQuery.length > 2 && searchType === 'contacts',
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
  
  return (
    <div className="relative">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as 'contacts' | 'deals')}
          className="px-3 py-2 border rounded-md"
        >
          <option value="contacts">Contacts</option>
          <option value="deals">Deals</option>
        </select>
      </div>
      
      {(isLoading || isFetching) && (
        <div className="text-sm text-gray-500">Searching...</div>
      )}
      
      {debouncedQuery.length > 2 && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {searchResults.map((item: any) => (
            <div
              key={item.id}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            >
              <div className="font-medium">{item.name || item.title}</div>
              <div className="text-sm text-gray-500">
                {item.email || item.company}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

SmartSearch.displayName = 'SmartSearch';
