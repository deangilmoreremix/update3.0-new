import { useCallback, useRef, useEffect } from 'react';

interface WorkerMessage {
  type: string;
  payload: any;
  id: string;
}

interface WorkerResponse {
  type: string;
  payload: any;
  id: string;
}

type WorkerCallback = (result: any, error?: any) => void;

export const useWebWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, WorkerCallback>>(new Map());

  // Initialize worker
  useEffect(() => {
    // Create worker from inline code for better compatibility
    const workerCode = `
      // Simplified inline worker for data processing
      self.onmessage = function(e) {
        const { type, payload, id } = e.data;
        
        try {
          let result;
          
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
              throw new Error('Unknown message type: ' + type);
          }
          
          self.postMessage({
            type: type + '_SUCCESS',
            payload: result,
            id: id
          });
          
        } catch (error) {
          self.postMessage({
            type: type + '_ERROR',
            payload: { message: error.message },
            id: id
          });
        }
      };
      
      function calculateAnalytics(data) {
        const { deals, contacts } = data;
        
        const closedDeals = deals.filter(deal => deal.stage === 'closed-won');
        const totalRevenue = closedDeals.reduce((sum, deal) => sum + deal.value, 0);
        const averageDealSize = deals.length > 0 ? deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length : 0;
        const conversionRate = deals.length > 0 ? (closedDeals.length / deals.length) * 100 : 0;
        
        return {
          totalRevenue,
          averageDealSize,
          conversionRate,
          topPerformers: deals.sort((a, b) => b.value - a.value).slice(0, 10),
          pipelineDistribution: calculatePipelineDistribution(deals)
        };
      }
      
      function calculatePipelineDistribution(deals) {
        const stages = ['qualification', 'initial', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
        return stages.map(stage => {
          const stageDeals = deals.filter(deal => deal.stage === stage);
          return {
            stage: stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' '),
            count: stageDeals.length,
            value: stageDeals.reduce((sum, deal) => sum + deal.value, 0)
          };
        });
      }
      
      function processLargeList(data) {
        const { items, searchTerm, sortField, sortDirection } = data;
        
        let filtered = items;
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filtered = items.filter(item => 
            Object.values(item).some(value => 
              typeof value === 'string' && value.toLowerCase().includes(searchLower)
            )
          );
        }
        
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
      
      function filterSearchResults(data) {
        const { items, query, fields } = data;
        
        if (!query) return items;
        
        const queryLower = query.toLowerCase();
        return items.filter(item => 
          fields.some(field => {
            const fieldValue = item[field];
            return typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(queryLower);
          })
        );
      }
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    
    try {
      workerRef.current = new Worker(workerUrl);
      
      workerRef.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const { type, payload, id } = e.data;
        const callback = callbacksRef.current.get(id);
        
        if (callback) {
          if (type.endsWith('_SUCCESS')) {
            callback(payload);
          } else if (type.endsWith('_ERROR')) {
            callback(null, payload);
          }
          callbacksRef.current.delete(id);
        }
      };
      
      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
      };
      
    } catch (error) {
      console.error('Failed to create worker:', error);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        URL.revokeObjectURL(workerUrl);
      }
    };
  }, []);

  // Send message to worker
  const postMessage = useCallback((type: string, payload: any, callback: WorkerCallback) => {
    if (!workerRef.current) {
      console.error('Worker not initialized');
      callback(null, { message: 'Worker not available' });
      return;
    }

    const id = Math.random().toString(36).substr(2, 9);
    callbacksRef.current.set(id, callback);

    const message: WorkerMessage = { type, payload, id };
    workerRef.current.postMessage(message);
  }, []);

  // Convenience methods for specific operations
  const calculateAnalytics = useCallback((data: any, callback: WorkerCallback) => {
    postMessage('CALCULATE_ANALYTICS', data, callback);
  }, [postMessage]);

  const processLargeList = useCallback((data: any, callback: WorkerCallback) => {
    postMessage('PROCESS_LARGE_LIST', data, callback);
  }, [postMessage]);

  const filterSearchResults = useCallback((data: any, callback: WorkerCallback) => {
    postMessage('FILTER_SEARCH_RESULTS', data, callback);
  }, [postMessage]);

  return {
    calculateAnalytics,
    processLargeList,
    filterSearchResults,
    postMessage
  };
};

export default useWebWorker;
