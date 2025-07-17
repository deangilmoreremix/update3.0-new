import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys, cacheUtils } from '../providers/QueryProvider';
import { Contact, Deal } from '../types';

// Mock API functions - replace with your actual API calls
const api = {
  // Contact API calls
  getContacts: async (filters: Record<string, any> = {}): Promise<Contact[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    // Return mock data or actual API call
    return [];
  },
  
  getContact: async (id: string): Promise<Contact> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    throw new Error('Contact not found');
  },
  
  createContact: async (contactData: Partial<Contact>): Promise<Contact> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    throw new Error('Not implemented');
  },
  
  updateContact: async (id: string, contactData: Partial<Contact>): Promise<Contact> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    throw new Error('Not implemented');
  },
  
  deleteContact: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new Error('Not implemented');
  },
  
  searchContacts: async (query: string): Promise<Contact[]> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    return [];
  },
  
  // Deal API calls
  getDeals: async (filters: Record<string, any> = {}): Promise<Deal[]> => {
    await new Promise(resolve => setTimeout(resolve, 120));
    return [];
  },
  
  getDeal: async (id: string): Promise<Deal> => {
    await new Promise(resolve => setTimeout(resolve, 60));
    throw new Error('Deal not found');
  },
  
  createDeal: async (dealData: Partial<Deal>): Promise<Deal> => {
    await new Promise(resolve => setTimeout(resolve, 250));
    throw new Error('Not implemented');
  },
  
  updateDeal: async (id: string, dealData: Partial<Deal>): Promise<Deal> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    throw new Error('Not implemented');
  },
  
  deleteDeal: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new Error('Not implemented');
  },
  
  // Analytics API calls
  getAnalytics: async (period: string = 'month'): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      totalRevenue: 0,
      dealCount: 0,
      conversionRate: 0,
      trends: [],
    };
  },
};

// ===== CONTACT HOOKS =====

export const useContacts = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: queryKeys.contacts.list(filters),
    queryFn: () => api.getContacts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useContact = (id: string, options?: Partial<UseQueryOptions<Contact>>) => {
  return useQuery({
    queryKey: queryKeys.contacts.detail(id),
    queryFn: () => api.getContact(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useContactSearch = (query: string) => {
  return useQuery({
    queryKey: queryKeys.contacts.search(query),
    queryFn: () => api.searchContacts(query),
    enabled: query.length > 2, // Only search if query is longer than 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createContact,
    onSuccess: (newContact) => {
      // Invalidate and refetch contact lists
      cacheUtils.invalidateContacts();
      
      // Optimistically add to cache
      queryClient.setQueryData(
        queryKeys.contacts.detail(newContact.id),
        newContact
      );
      
      // Update contact lists cache
      queryClient.setQueriesData(
        { queryKey: queryKeys.contacts.lists() },
        (oldData: Contact[] | undefined) => {
          if (!oldData) return [newContact];
          return [newContact, ...oldData];
        }
      );
    },
    onError: (error) => {
      console.error('Failed to create contact:', error);
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contact> }) => 
      api.updateContact(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.contacts.detail(id) });
      
      // Snapshot the previous value
      const previousContact = queryClient.getQueryData(queryKeys.contacts.detail(id));
      
      // Optimistically update
      queryClient.setQueryData(
        queryKeys.contacts.detail(id),
        (old: Contact | undefined) => old ? { ...old, ...data } : undefined
      );
      
      return { previousContact };
    },
    onError: (error, { id }, context) => {
      // Rollback on error
      if (context?.previousContact) {
        queryClient.setQueryData(queryKeys.contacts.detail(id), context.previousContact);
      }
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success
      cacheUtils.invalidateContact(id);
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteContact,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.contacts.detail(deletedId) });
      
      // Update lists
      queryClient.setQueriesData(
        { queryKey: queryKeys.contacts.lists() },
        (oldData: Contact[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(contact => contact.id !== deletedId);
        }
      );
      
      cacheUtils.invalidateContacts();
    },
  });
};

// ===== DEAL HOOKS =====

export const useDeals = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: queryKeys.deals.list(filters),
    queryFn: () => api.getDeals(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes (deals change more frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDeal = (id: string, options?: Partial<UseQueryOptions<Deal>>) => {
  return useQuery({
    queryKey: queryKeys.deals.detail(id),
    queryFn: () => api.getDeal(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const usePipelineData = () => {
  return useQuery({
    queryKey: queryKeys.deals.pipeline(),
    queryFn: () => api.getDeals({ includeStageStats: true }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createDeal,
    onSuccess: (newDeal) => {
      cacheUtils.invalidateDeals();
      cacheUtils.invalidateAnalytics();
      
      queryClient.setQueryData(
        queryKeys.deals.detail(newDeal.id),
        newDeal
      );
      
      queryClient.setQueriesData(
        { queryKey: queryKeys.deals.lists() },
        (oldData: Deal[] | undefined) => {
          if (!oldData) return [newDeal];
          return [newDeal, ...oldData];
        }
      );
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Deal> }) => 
      api.updateDeal(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.deals.detail(id) });
      
      const previousDeal = queryClient.getQueryData(queryKeys.deals.detail(id));
      
      queryClient.setQueryData(
        queryKeys.deals.detail(id),
        (old: Deal | undefined) => old ? { ...old, ...data } : undefined
      );
      
      return { previousDeal };
    },
    onError: (error, { id }, context) => {
      if (context?.previousDeal) {
        queryClient.setQueryData(queryKeys.deals.detail(id), context.previousDeal);
      }
    },
    onSettled: (data, error, { id }) => {
      cacheUtils.invalidateDeal(id);
      
      // If deal stage changed, invalidate analytics
      if (data && error === null) {
        cacheUtils.invalidateAnalytics();
      }
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteDeal,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: queryKeys.deals.detail(deletedId) });
      
      queryClient.setQueriesData(
        { queryKey: queryKeys.deals.lists() },
        (oldData: Deal[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(deal => deal.id !== deletedId);
        }
      );
      
      cacheUtils.invalidateDeals();
      cacheUtils.invalidateAnalytics();
    },
  });
};

// ===== ANALYTICS HOOKS =====

export const useAnalytics = (period: string = 'month') => {
  return useQuery({
    queryKey: queryKeys.analytics.performance(period),
    queryFn: () => api.getAnalytics(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: () => api.getAnalytics('dashboard'),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
  });
};

// ===== ADVANCED HOOKS =====

// Hook for prefetching related data
export const usePrefetchRelatedData = () => {
  const queryClient = useQueryClient();
  
  const prefetchContactDeals = (contactId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.deals.list({ contactId }),
      queryFn: () => api.getDeals({ contactId }),
      staleTime: 5 * 60 * 1000,
    });
  };
  
  const prefetchDealContact = (dealId: string) => {
    // This would need the actual deal data to get the contact ID
    const deal = queryClient.getQueryData(queryKeys.deals.detail(dealId)) as Deal;
    if (deal?.contactId) {
      cacheUtils.prefetchContact(deal.contactId);
    }
  };
  
  return {
    prefetchContactDeals,
    prefetchDealContact,
  };
};

// Hook for batch operations
export const useBatchOperations = () => {
  const queryClient = useQueryClient();
  
  const batchUpdateContacts = useMutation({
    mutationFn: async (updates: Array<{ id: string; data: Partial<Contact> }>) => {
      return Promise.all(
        updates.map(({ id, data }) => api.updateContact(id, data))
      );
    },
    onSuccess: () => {
      cacheUtils.invalidateContacts();
    },
  });
  
  const batchUpdateDeals = useMutation({
    mutationFn: async (updates: Array<{ id: string; data: Partial<Deal> }>) => {
      return Promise.all(
        updates.map(({ id, data }) => api.updateDeal(id, data))
      );
    },
    onSuccess: () => {
      cacheUtils.invalidateDeals();
      cacheUtils.invalidateAnalytics();
    },
  });
  
  return {
    batchUpdateContacts,
    batchUpdateDeals,
  };
};
