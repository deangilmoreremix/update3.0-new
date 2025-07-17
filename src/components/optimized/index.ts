// Optimized Performance Components
// These components use React.memo, useMemo, and useCallback for maximum performance

// Phase 1: React Optimizations
export { default as ContactListItem } from './ContactListItem';
export { default as ContactList } from './ContactList';
export { default as OptimizedDealCard } from './OptimizedDealCard';
export { default as OptimizedDealList } from './OptimizedDealList';
export { default as OptimizedSalesPerformanceDashboard } from './OptimizedSalesPerformanceDashboard';

// Phase 2: Virtual Scrolling & Advanced Optimizations
export { default as VirtualContactList } from './VirtualContactList';
export { default as VirtualDealList } from './VirtualDealList';
export { default as LazyComponent } from './LazyComponent';

// Re-export types for convenience
export type { Contact } from './ContactListItem';
export type { Deal } from '../../types';
