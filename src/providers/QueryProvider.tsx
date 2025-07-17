import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import React, { ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

// Create a persister for localStorage
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'SMART_CRM_CACHE',
  throttleTime: 1000, // Throttle saving to localStorage
});

// Create Query Client with optimized configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time - data stays in cache for 30 minutes after component unmount
      gcTime: 30 * 60 * 1000,
      // Retry failed requests up to 3 times with exponential backoff
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for critical data
      refetchOnWindowFocus: false,
      // Background refetch interval
      refetchInterval: false,
      // Enable background refetch
      refetchOnMount: 'always',
      // Network mode optimizations
      networkMode: 'online',
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
      // Network mode for mutations
      networkMode: 'online',
    },
  },
});

// Enhanced Query Provider with Persistence and DevTools
const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersister,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        buster: 'v1', // Increment this to invalidate all persisted data
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            // Only persist successful queries that are not mutations
            return query.state.status === 'success' && 
                   !query.state.error && 
                   query.queryKey.length > 0;
          },
        },
      }}
    >
      {children}
      {/* React Query DevTools - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </PersistQueryClientProvider>
  );
};

// Query key factories for consistent cache management
export const queryKeys = {
  // Contacts
  contacts: {
    all: ['contacts'] as const,
    lists: () => [...queryKeys.contacts.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.contacts.lists(), filters] as const,
    details: () => [...queryKeys.contacts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.contacts.details(), id] as const,
    search: (query: string) => [...queryKeys.contacts.all, 'search', query] as const,
  },
  
  // Deals
  deals: {
    all: ['deals'] as const,
    lists: () => [...queryKeys.deals.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.deals.lists(), filters] as const,
    details: () => [...queryKeys.deals.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.deals.details(), id] as const,
    pipeline: () => [...queryKeys.deals.all, 'pipeline'] as const,
    analytics: () => [...queryKeys.deals.all, 'analytics'] as const,
  },
  
  // Analytics
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    performance: (period: string) => [...queryKeys.analytics.all, 'performance', period] as const,
    reports: () => [...queryKeys.analytics.all, 'reports'] as const,
    report: (type: string, filters: Record<string, any>) => 
      [...queryKeys.analytics.reports(), type, filters] as const,
  },
  
  // User and Settings
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    settings: () => [...queryKeys.user.all, 'settings'] as const,
    preferences: () => [...queryKeys.user.all, 'preferences'] as const,
  },
};

// Cache invalidation utilities
export const cacheUtils = {
  // Invalidate all contact-related queries
  invalidateContacts: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
  },
  
  // Invalidate all deal-related queries
  invalidateDeals: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.deals.all });
  },
  
  // Invalidate analytics when data changes
  invalidateAnalytics: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
  },
  
  // Invalidate specific contact
  invalidateContact: (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.contacts.detail(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
  },
  
  // Invalidate specific deal
  invalidateDeal: (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.deals.detail(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
    queryClient.invalidateQueries({ queryKey: queryKeys.deals.pipeline() });
  },
  
  // Clear all cache
  clearCache: () => {
    queryClient.clear();
    localStorage.removeItem('SMART_CRM_CACHE');
  },
  
  // Prefetch data for improved UX
  prefetchContact: (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.contacts.detail(id),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },
  
  prefetchDeal: (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.deals.detail(id),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },
};

// Performance monitoring utilities
export const performanceUtils = {
  // Get cache statistics
  getCacheStats: () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    return {
      totalQueries: queries.length,
      successfulQueries: queries.filter(q => q.state.status === 'success').length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      loadingQueries: queries.filter(q => q.state.status === 'pending').length,
      staleQueries: queries.filter(q => q.isStale()).length,
      cacheSize: JSON.stringify(cache).length,
    };
  },
  
  // Monitor query performance
  getQueryPerformance: (queryKey: string[]) => {
    const query = queryClient.getQueryCache().find({ queryKey });
    if (!query) return null;
    
    return {
      dataUpdatedAt: query.state.dataUpdatedAt,
      errorUpdatedAt: query.state.errorUpdatedAt,
      fetchStatus: query.state.fetchStatus,
      status: query.state.status,
      isStale: query.isStale(),
      isFetching: query.state.isFetching,
    };
  },
};

export { queryClient, QueryProvider };
export default QueryProvider;
