/**
 * React Hook for Smart AI Operations
 * Provides easy access to enhanced AI capabilities with automatic model selection
 */

import { useState, useCallback, useEffect } from 'react';
import { Contact } from '../types/contact';

// Define types for task optimization
export type TaskType = 'contact_scoring' | 'categorization' | 'contact_enrichment' | 'lead_qualification';

interface TaskRecommendation {
  recommendedModel: string;
  recommendedProvider: string;
  reasoning: string;
  alternativeModels?: string[];
  estimatedCost?: number;
}

interface TaskOptimizationMetrics {
  totalTasks: number;
  overallSuccessRate: number;
  avgResponseTime: number;
  modelPerformance: {
    model: string;
    successRate: number;
    avgTime: number;
    avgCost: number;
    taskTypes: string[];
  }[];
}

export interface SmartAIState {
  analyzing: boolean;
  enriching: boolean;
  results: Record<string, any>;
  errors: Record<string, string>;
  recommendations: Record<string, any>;
  performance: any;
}

interface EnhancedAIAnalysisRequest {
  contactId: string;
  [key: string]: any;
}

interface SmartBulkRequest {
  contacts: Array<{ contactId: string; contact: any }>;
  analysisType: 'contact_scoring' | 'categorization' | 'tagging' | 'lead_qualification';
  urgency?: 'low' | 'medium' | 'high';
  costLimit?: number;
  timeLimit?: number;
}

// Enhanced AI integration service mock (to be replaced with actual implementation)
const enhancedAI = {
  scoreContact: async (contactId: string, contact: any, urgency: string = 'medium') => {
    console.log('Scoring contact with enhancedAI', { contactId, urgency });
    
    return {
      contactId,
      score: Math.floor(Math.random() * 100),
      modelUsed: 'gemini-pro',
      urgency,
      results: `AI analysis for ${contact.name || 'contact'}`
    };
  },
  
  enrichContact: async (contactId: string, contact: any, priority: 'standard' | 'premium' = 'standard') => {
    console.log('Enriching contact with enhancedAI', { contactId, priority });
    
    return {
      contactId,
      modelUsed: 'gpt-4o-mini',
      priority,
      results: `Enhanced data for ${contact.name || 'contact'}`
    };
  },
  
  categorizeAndTag: async (contactId: string, contact: any) => {
    console.log('Categorizing contact', contactId);
    
    return {
      contactId,
      categories: ['prospect', 'high-value'],
      tags: ['technology', 'enterprise'],
      modelUsed: 'gemma-2-9b'
    };
  }
};

export const useSmartAI = () => {
  const [state, setState] = useState<SmartAIState>({
    analyzing: false,
    enriching: false,
    results: {},
    errors: {},
    recommendations: {},
    performance: null
  });

  // Enhanced AI Analysis with smart model selection
  const analyzeContact = useCallback(async (contactId: string, contact: Contact, urgency: 'low' | 'medium' | 'high' = 'medium') => {
    setState(prev => ({ ...prev, analyzing: true, errors: { ...prev.errors, [contactId]: '' } }));
    
    try {
      const result = await enhancedAI.scoreContact(contactId, contact, urgency);
      
      setState(prev => ({
        ...prev,
        analyzing: false,
        results: { ...prev.results, [contactId]: result }
      }));
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setState(prev => ({
        ...prev,
        analyzing: false,
        errors: { ...prev.errors, [contactId]: errorMessage }
      }));
      throw error;
    }
  }, []);

  // Bulk contact analysis with smart batching
  const bulkAnalyzeContacts = useCallback(async (request: SmartBulkRequest) => {
    setState(prev => ({ ...prev, analyzing: true }));
    
    try {
      const results = await Promise.all(
        request.contacts.map(({ contactId, contact }) =>
          enhancedAI.scoreContact(contactId, contact, request.urgency)
        )
      );
      
      const resultsMap = results.reduce((acc, result) => {
        acc[result.contactId] = result;
        return acc;
      }, {} as Record<string, any>);
      
      setState(prev => ({
        ...prev,
        analyzing: false,
        results: { ...prev.results, ...resultsMap }
      }));
      
      return results;
    } catch (error) {
      setState(prev => ({ ...prev, analyzing: false }));
      throw error;
    }
  }, []);

  // Enhanced contact enrichment
  const enrichContact = useCallback(async (contactId: string, contact: Contact, priority: 'standard' | 'premium' = 'standard') => {
    setState(prev => ({ ...prev, enriching: true }));
    
    try {
      const result = await enhancedAI.enrichContact(contactId, contact, priority);
      
      setState(prev => ({
        ...prev,
        enriching: false,
        results: { ...prev.results, [contactId]: result }
      }));
      
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, enriching: false }));
      throw error;
    }
  }, []);

  // Get task recommendation
  const getTaskRecommendation = useCallback(async (taskType: TaskType, context: any): Promise<TaskRecommendation> => {
    // Mock implementation - replace with actual service
    return {
      recommendedModel: 'gemini-2.5-flash',
      recommendedProvider: 'google',
      reasoning: `Best model for ${taskType} based on current performance metrics`,
      alternativeModels: ['gpt-4o-mini', 'gemma-2-9b'],
      estimatedCost: 0.002
    };
  }, []);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(async (): Promise<TaskOptimizationMetrics> => {
    // Mock implementation - replace with actual analytics
    return {
      totalTasks: 150,
      overallSuccessRate: 94.2,
      avgResponseTime: 1.8,
      modelPerformance: [
        {
          model: 'gemini-2.5-flash',
          successRate: 96.1,
          avgTime: 1.2,
          avgCost: 0.001,
          taskTypes: ['contact_scoring', 'categorization']
        },
        {
          model: 'gpt-4o-mini',
          successRate: 92.8,
          avgTime: 2.1,
          avgCost: 0.002,
          taskTypes: ['contact_enrichment', 'lead_qualification']
        }
      ]
    };
  }, []);

  // Clear results
  const clearResults = useCallback(() => {
    setState({
      analyzing: false,
      enriching: false,
      results: {},
      errors: {},
      recommendations: {},
      performance: null
    });
  }, []);

  return {
    ...state,
    analyzeContact,
    bulkAnalyzeContacts,
    enrichContact,
    getTaskRecommendation,
    getPerformanceMetrics,
    clearResults
  };
};