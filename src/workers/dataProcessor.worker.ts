// Web Worker for Heavy Data Processing
// This worker handles CPU-intensive operations off the main thread

import { Deal, Contact } from '../types';

interface WorkerMessage {
  type: 'CALCULATE_ANALYTICS' | 'PROCESS_LARGE_LIST' | 'FILTER_SEARCH_RESULTS';
  payload: any;
  id: string;
}

interface AnalyticsData {
  deals: Deal[];
  contacts: Contact[];
}

interface AnalyticsResult {
  totalRevenue: number;
  averageDealSize: number;
  conversionRate: number;
  topPerformers: Deal[];
  salesTrend: Array<{
    month: string;
    revenue: number;
    deals: number;
  }>;
  pipelineDistribution: Array<{
    stage: string;
    count: number;
    value: number;
  }>;
  contactsByStatus: Array<{
    status: string;
    count: number;
  }>;
}

// Analytics calculation function
function calculateAnalytics(data: AnalyticsData): AnalyticsResult {
  const { deals, contacts } = data;

  // Calculate total revenue from closed deals
  const closedDeals = deals.filter(deal => deal.stage === 'closed-won');
  const totalRevenue = closedDeals.reduce((sum, deal) => sum + deal.value, 0);

  // Calculate average deal size
  const averageDealSize = deals.length > 0 ? deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length : 0;

  // Calculate conversion rate
  const conversionRate = deals.length > 0 ? (closedDeals.length / deals.length) * 100 : 0;

  // Find top performing deals
  const topPerformers = [...deals]
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Calculate sales trend by month
  const salesTrend = generateSalesTrend(deals);

  // Calculate pipeline distribution
  const pipelineDistribution = calculatePipelineDistribution(deals);

  // Calculate contacts by status
  const contactsByStatus = calculateContactsByStatus(contacts);

  return {
    totalRevenue,
    averageDealSize,
    conversionRate,
    topPerformers,
    salesTrend,
    pipelineDistribution,
    contactsByStatus
  };
}

function generateSalesTrend(deals: Deal[]) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  return monthNames.map((month, index) => {
    const monthDeals = deals.filter(deal => {
      const dealDate = new Date(deal.createdAt);
      return dealDate.getFullYear() === currentYear && dealDate.getMonth() === index;
    });

    const monthRevenue = monthDeals
      .filter(deal => deal.stage === 'closed-won')
      .reduce((sum, deal) => sum + deal.value, 0);

    return {
      month,
      revenue: monthRevenue,
      deals: monthDeals.length
    };
  });
}

function calculatePipelineDistribution(deals: Deal[]) {
  const stages = ['qualification', 'initial', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
  
  return stages.map(stage => {
    const stageDeals = deals.filter(deal => deal.stage === stage);
    const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
    
    return {
      stage: stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' '),
      count: stageDeals.length,
      value: stageValue
    };
  });
}

function calculateContactsByStatus(contacts: Contact[]) {
  const statuses = ['lead', 'prospect', 'customer', 'churned'];
  
  return statuses.map(status => {
    const statusContacts = contacts.filter(contact => contact.status === status);
    
    return {
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count: statusContacts.length
    };
  });
}

// Process large list filtering and sorting
function processLargeList(data: { items: any[]; searchTerm: string; sortField: string; sortDirection: 'asc' | 'desc' }) {
  const { items, searchTerm, sortField, sortDirection } = data;
  
  // Filter items based on search term
  let filtered = items;
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = items.filter(item => {
      return Object.values(item).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(searchLower)
      );
    });
  }

  // Sort items
  if (sortField) {
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }

  return filtered;
}

// Filter search results with advanced matching
function filterSearchResults(data: { items: any[]; query: string; fields: string[] }) {
  const { items, query, fields } = data;
  
  if (!query) return items;
  
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(' ').filter(word => word.length > 0);
  
  return items.filter(item => {
    return queryWords.every(word => {
      return fields.some(field => {
        const fieldValue = item[field];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(word);
        }
        if (Array.isArray(fieldValue)) {
          return fieldValue.some(arrItem => 
            typeof arrItem === 'string' && arrItem.toLowerCase().includes(word)
          );
        }
        return false;
      });
    });
  });
}

// Worker message handler
self.onmessage = function(e: MessageEvent<WorkerMessage>) {
  const { type, payload, id } = e.data;
  
  try {
    let result: any;
    
    switch (type) {
      case 'CALCULATE_ANALYTICS':
        result = calculateAnalytics(payload);
        break;
        
      case 'PROCESS_LARGE_LIST':
        result = processLargeList(payload);
        break;
        
      case 'FILTER_SEARCH_RESULTS':
        result = filterSearchResults(payload);
        break;
        
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
    
    // Send result back to main thread
    self.postMessage({
      type: `${type}_SUCCESS`,
      payload: result,
      id
    });
    
  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      type: `${type}_ERROR`,
      payload: { 
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      id
    });
  }
};

// Export types for TypeScript support
export type { WorkerMessage, AnalyticsData, AnalyticsResult };
