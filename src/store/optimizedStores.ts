import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Contact, Deal, User } from '../types';

// ===== TYPES =====

interface ContactState {
  contacts: Record<string, Contact>;
  selectedContacts: Set<string>;
  filters: {
    search: string;
    tags: string[];
    status: string;
    assignedTo: string;
    dateRange: { start: Date | null; end: Date | null };
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

interface DealState {
  deals: Record<string, Deal>;
  selectedDeals: Set<string>;
  pipelineView: 'kanban' | 'list' | 'analytics';
  filters: {
    search: string;
    stage: string[];
    assignedTo: string;
    valueRange: { min: number; max: number };
    dateRange: { start: Date | null; end: Date | null };
  };
  dragState: {
    isDragging: boolean;
    draggedItem: string | null;
    dropZone: string | null;
  };
}

interface UIState {
  sidebarCollapsed: boolean;
  activeModal: string | null;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
  theme: 'light' | 'dark' | 'system';
  performance: {
    renderTimes: number[];
    memoryUsage: number[];
    networkRequests: number;
  };
}

// ===== CONTACT STORE =====

interface ContactStore extends ContactState {
  // Actions
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  removeContact: (id: string) => void;
  
  // Selection
  toggleSelectContact: (id: string) => void;
  selectAllContacts: () => void;
  clearSelection: () => void;
  
  // Filters
  updateFilters: (filters: Partial<ContactState['filters']>) => void;
  resetFilters: () => void;
  
  // Pagination
  setPagination: (pagination: Partial<ContactState['pagination']>) => void;
  
  // Computed
  getFilteredContacts: () => Contact[];
  getSelectedContacts: () => Contact[];
  getContactById: (id: string) => Contact | undefined;
}

export const useContactStore = create<ContactStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        contacts: {},
        selectedContacts: new Set(),
        filters: {
          search: '',
          tags: [],
          status: '',
          assignedTo: '',
          dateRange: { start: null, end: null },
        },
        pagination: {
          page: 1,
          limit: 50,
          total: 0,
        },
        
        // Actions
        setContacts: (contacts) => set((state) => {
          state.contacts = {};
          contacts.forEach(contact => {
            state.contacts[contact.id] = contact;
          });
          state.pagination.total = contacts.length;
        }),
        
        addContact: (contact) => set((state) => {
          state.contacts[contact.id] = contact;
          state.pagination.total += 1;
        }),
        
        updateContact: (id, updates) => set((state) => {
          if (state.contacts[id]) {
            Object.assign(state.contacts[id], updates);
          }
        }),
        
        removeContact: (id) => set((state) => {
          delete state.contacts[id];
          state.selectedContacts.delete(id);
          state.pagination.total -= 1;
        }),
        
        // Selection
        toggleSelectContact: (id) => set((state) => {
          if (state.selectedContacts.has(id)) {
            state.selectedContacts.delete(id);
          } else {
            state.selectedContacts.add(id);
          }
        }),
        
        selectAllContacts: () => set((state) => {
          const filteredContacts = get().getFilteredContacts();
          state.selectedContacts = new Set(filteredContacts.map(c => c.id));
        }),
        
        clearSelection: () => set((state) => {
          state.selectedContacts.clear();
        }),
        
        // Filters
        updateFilters: (newFilters) => set((state) => {
          Object.assign(state.filters, newFilters);
          state.pagination.page = 1; // Reset to first page
        }),
        
        resetFilters: () => set((state) => {
          state.filters = {
            search: '',
            tags: [],
            status: '',
            assignedTo: '',
            dateRange: { start: null, end: null },
          };
          state.pagination.page = 1;
        }),
        
        // Pagination
        setPagination: (newPagination) => set((state) => {
          Object.assign(state.pagination, newPagination);
        }),
        
        // Computed
        getFilteredContacts: () => {
          const { contacts, filters } = get();
          let filtered = Object.values(contacts);
          
          if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(contact =>
              contact.name?.toLowerCase().includes(search) ||
              contact.email?.toLowerCase().includes(search) ||
              contact.company?.toLowerCase().includes(search)
            );
          }
          
          if (filters.status) {
            filtered = filtered.filter(contact => contact.status === filters.status);
          }
          
          if (filters.assignedTo) {
            filtered = filtered.filter(contact => contact.assignedTo === filters.assignedTo);
          }
          
          if (filters.tags.length > 0) {
            filtered = filtered.filter(contact =>
              contact.tags?.some(tag => filters.tags.includes(tag))
            );
          }
          
          if (filters.dateRange.start || filters.dateRange.end) {
            filtered = filtered.filter(contact => {
              const createdDate = new Date(contact.createdAt);
              if (filters.dateRange.start && createdDate < filters.dateRange.start) return false;
              if (filters.dateRange.end && createdDate > filters.dateRange.end) return false;
              return true;
            });
          }
          
          return filtered;
        },
        
        getSelectedContacts: () => {
          const { contacts, selectedContacts } = get();
          return Array.from(selectedContacts).map(id => contacts[id]).filter(Boolean);
        },
        
        getContactById: (id) => {
          return get().contacts[id];
        },
      })),
      {
        name: 'contact-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
        }),
      }
    ),
    { name: 'ContactStore' }
  )
);

// ===== DEAL STORE =====

interface DealStore extends DealState {
  // Actions
  setDeals: (deals: Deal[]) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  removeDeal: (id: string) => void;
  
  // Selection
  toggleSelectDeal: (id: string) => void;
  selectAllDeals: () => void;
  clearSelection: () => void;
  
  // View
  setPipelineView: (view: DealState['pipelineView']) => void;
  
  // Filters
  updateFilters: (filters: Partial<DealState['filters']>) => void;
  resetFilters: () => void;
  
  // Drag & Drop
  startDrag: (itemId: string) => void;
  endDrag: () => void;
  setDropZone: (zone: string | null) => void;
  
  // Computed
  getFilteredDeals: () => Deal[];
  getDealsByStage: () => Record<string, Deal[]>;
  getSelectedDeals: () => Deal[];
  getDealById: (id: string) => Deal | undefined;
  getTotalValue: () => number;
}

export const useDealStore = create<DealStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        deals: {},
        selectedDeals: new Set(),
        pipelineView: 'kanban',
        filters: {
          search: '',
          stage: [],
          assignedTo: '',
          valueRange: { min: 0, max: 1000000 },
          dateRange: { start: null, end: null },
        },
        dragState: {
          isDragging: false,
          draggedItem: null,
          dropZone: null,
        },
        
        // Actions
        setDeals: (deals) => set((state) => {
          state.deals = {};
          deals.forEach(deal => {
            state.deals[deal.id] = deal;
          });
        }),
        
        addDeal: (deal) => set((state) => {
          state.deals[deal.id] = deal;
        }),
        
        updateDeal: (id, updates) => set((state) => {
          if (state.deals[id]) {
            Object.assign(state.deals[id], updates);
          }
        }),
        
        removeDeal: (id) => set((state) => {
          delete state.deals[id];
          state.selectedDeals.delete(id);
        }),
        
        // Selection
        toggleSelectDeal: (id) => set((state) => {
          if (state.selectedDeals.has(id)) {
            state.selectedDeals.delete(id);
          } else {
            state.selectedDeals.add(id);
          }
        }),
        
        selectAllDeals: () => set((state) => {
          const filteredDeals = get().getFilteredDeals();
          state.selectedDeals = new Set(filteredDeals.map(d => d.id));
        }),
        
        clearSelection: () => set((state) => {
          state.selectedDeals.clear();
        }),
        
        // View
        setPipelineView: (view) => set((state) => {
          state.pipelineView = view;
        }),
        
        // Filters
        updateFilters: (newFilters) => set((state) => {
          Object.assign(state.filters, newFilters);
        }),
        
        resetFilters: () => set((state) => {
          state.filters = {
            search: '',
            stage: [],
            assignedTo: '',
            valueRange: { min: 0, max: 1000000 },
            dateRange: { start: null, end: null },
          };
        }),
        
        // Drag & Drop
        startDrag: (itemId) => set((state) => {
          state.dragState.isDragging = true;
          state.dragState.draggedItem = itemId;
        }),
        
        endDrag: () => set((state) => {
          state.dragState.isDragging = false;
          state.dragState.draggedItem = null;
          state.dragState.dropZone = null;
        }),
        
        setDropZone: (zone) => set((state) => {
          state.dragState.dropZone = zone;
        }),
        
        // Computed
        getFilteredDeals: () => {
          const { deals, filters } = get();
          let filtered = Object.values(deals);
          
          if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(deal =>
              deal.title?.toLowerCase().includes(search) ||
              deal.company?.toLowerCase().includes(search)
            );
          }
          
          if (filters.stage.length > 0) {
            filtered = filtered.filter(deal => filters.stage.includes(deal.stage));
          }
          
          if (filters.assignedTo) {
            filtered = filtered.filter(deal => deal.assignedTo === filters.assignedTo);
          }
          
          if (filters.valueRange.min > 0 || filters.valueRange.max < 1000000) {
            filtered = filtered.filter(deal => {
              const value = deal.value || 0;
              return value >= filters.valueRange.min && value <= filters.valueRange.max;
            });
          }
          
          return filtered;
        },
        
        getDealsByStage: () => {
          const deals = get().getFilteredDeals();
          const stages: Record<string, Deal[]> = {};
          
          deals.forEach(deal => {
            const stage = deal.stage || 'unassigned';
            if (!stages[stage]) stages[stage] = [];
            stages[stage].push(deal);
          });
          
          return stages;
        },
        
        getSelectedDeals: () => {
          const { deals, selectedDeals } = get();
          return Array.from(selectedDeals).map(id => deals[id]).filter(Boolean);
        },
        
        getDealById: (id) => {
          return get().deals[id];
        },
        
        getTotalValue: () => {
          const deals = get().getFilteredDeals();
          return deals.reduce((total, deal) => total + (deal.value || 0), 0);
        },
      })),
      {
        name: 'deal-store',
        partialize: (state) => ({
          pipelineView: state.pipelineView,
          filters: state.filters,
        }),
      }
    ),
    { name: 'DealStore' }
  )
);

// ===== UI STORE =====

interface UIStore extends UIState {
  // Sidebar
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Modals
  openModal: (modalId: string) => void;
  closeModal: () => void;
  
  // Notifications
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Theme
  setTheme: (theme: UIState['theme']) => void;
  
  // Performance
  recordRenderTime: (time: number) => void;
  recordMemoryUsage: (usage: number) => void;
  incrementNetworkRequests: () => void;
  resetPerformanceMetrics: () => void;
  
  // Computed
  getUnreadNotifications: () => UIState['notifications'];
  getAverageRenderTime: () => number;
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        sidebarCollapsed: false,
        activeModal: null,
        notifications: [],
        theme: 'system',
        performance: {
          renderTimes: [],
          memoryUsage: [],
          networkRequests: 0,
        },
        
        // Sidebar
        toggleSidebar: () => set((state) => {
          state.sidebarCollapsed = !state.sidebarCollapsed;
        }),
        
        setSidebarCollapsed: (collapsed) => set((state) => {
          state.sidebarCollapsed = collapsed;
        }),
        
        // Modals
        openModal: (modalId) => set((state) => {
          state.activeModal = modalId;
        }),
        
        closeModal: () => set((state) => {
          state.activeModal = null;
        }),
        
        // Notifications
        addNotification: (notification) => set((state) => {
          const newNotification = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            read: false,
          };
          state.notifications.unshift(newNotification);
          
          // Keep only last 50 notifications
          if (state.notifications.length > 50) {
            state.notifications = state.notifications.slice(0, 50);
          }
        }),
        
        markNotificationRead: (id) => set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          if (notification) {
            notification.read = true;
          }
        }),
        
        removeNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id);
        }),
        
        clearAllNotifications: () => set((state) => {
          state.notifications = [];
        }),
        
        // Theme
        setTheme: (theme) => set((state) => {
          state.theme = theme;
        }),
        
        // Performance
        recordRenderTime: (time) => set((state) => {
          state.performance.renderTimes.push(time);
          // Keep only last 100 measurements
          if (state.performance.renderTimes.length > 100) {
            state.performance.renderTimes = state.performance.renderTimes.slice(-100);
          }
        }),
        
        recordMemoryUsage: (usage) => set((state) => {
          state.performance.memoryUsage.push(usage);
          // Keep only last 100 measurements
          if (state.performance.memoryUsage.length > 100) {
            state.performance.memoryUsage = state.performance.memoryUsage.slice(-100);
          }
        }),
        
        incrementNetworkRequests: () => set((state) => {
          state.performance.networkRequests += 1;
        }),
        
        resetPerformanceMetrics: () => set((state) => {
          state.performance = {
            renderTimes: [],
            memoryUsage: [],
            networkRequests: 0,
          };
        }),
        
        // Computed
        getUnreadNotifications: () => {
          return get().notifications.filter(n => !n.read);
        },
        
        getAverageRenderTime: () => {
          const { renderTimes } = get().performance;
          if (renderTimes.length === 0) return 0;
          return renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length;
        },
      })),
      {
        name: 'ui-store',
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);

// ===== SELECTORS =====

// Contact selectors
export const contactSelectors = {
  filteredContacts: () => useContactStore.getState().getFilteredContacts(),
  selectedContacts: () => useContactStore.getState().getSelectedContacts(),
  contactById: (id: string) => useContactStore.getState().getContactById(id),
  contactCount: () => Object.keys(useContactStore.getState().contacts).length,
  selectedCount: () => useContactStore.getState().selectedContacts.size,
};

// Deal selectors
export const dealSelectors = {
  filteredDeals: () => useDealStore.getState().getFilteredDeals(),
  dealsByStage: () => useDealStore.getState().getDealsByStage(),
  selectedDeals: () => useDealStore.getState().getSelectedDeals(),
  dealById: (id: string) => useDealStore.getState().getDealById(id),
  totalValue: () => useDealStore.getState().getTotalValue(),
  dealCount: () => Object.keys(useDealStore.getState().deals).length,
};

// UI selectors
export const uiSelectors = {
  unreadNotifications: () => useUIStore.getState().getUnreadNotifications(),
  averageRenderTime: () => useUIStore.getState().getAverageRenderTime(),
  performanceMetrics: () => useUIStore.getState().performance,
};
