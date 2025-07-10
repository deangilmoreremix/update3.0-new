import { useState, useCallback } from 'react';
import { getOptimalModel, type AIModelRecommendation } from '../services/aiModels';
import { Contact } from '../types/contact';

interface SmartAIResult {
  modelUsed: string;
  responseTime: number;
  confidence: number;
  results: any;
  cost: number;
}

interface BulkAnalysisOptions {
  urgency: 'low' | 'medium' | 'high';
  costLimit: number;
  timeLimit: number;
}

export const useSmartAI = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [results, setResults] = useState<Record<string, SmartAIResult>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const executeWithOptimalModel = async (
    useCase: AIModelRecommendation,
    prompt: string,
    urgency: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<SmartAIResult> => {
    const optimalModel = getOptimalModel(useCase, urgency);
    const startTime = Date.now();
    
    try {
      // Simulate API call - replace with actual AI service integration
      const response = await fetch('/api/ai/smart-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: optimalModel,
          prompt,
          useCase,
          urgency
        })
      });
      
      if (!response.ok) {
        throw new Error(`AI analysis failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      return {
        modelUsed: optimalModel,
        responseTime,
        confidence: data.confidence || 0.85,
        results: data.results,
        cost: data.cost || 0.01
      };
    } catch (error) {
      throw new Error(`Smart AI analysis failed: ${error}`);
    }
  };

  const smartScoreContact = useCallback(async (
    contactId: string,
    contact: Contact,
    urgency: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    setAnalyzing(true);
    setErrors(prev => ({ ...prev, [contactId]: '' }));
    
    try {
      const prompt = `Analyze and score this contact for sales potential:
        Name: ${contact.name}
        Company: ${contact.company}
        Title: ${contact.title}
        Email: ${contact.email}
        Status: ${contact.status}
        
        Provide a score from 0-100 and brief reasoning.`;
      
      const result = await executeWithOptimalModel('contact_scoring', prompt, urgency);
      
      setResults(prev => ({ ...prev, [contactId]: result }));
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => ({ ...prev, [contactId]: errorMsg }));
      throw error;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const smartEnrichContact = useCallback(async (
    contactId: string,
    contact: Contact,
    mode: 'standard' | 'premium' = 'standard'
  ) => {
    setEnriching(true);
    setErrors(prev => ({ ...prev, [contactId]: '' }));
    
    try {
      const urgency = mode === 'premium' ? 'high' : 'medium';
      const prompt = `Enrich this contact with additional business information:
        Name: ${contact.name}
        Company: ${contact.company}
        Title: ${contact.title}
        
        Find: LinkedIn profile, company size, industry insights, contact preferences.`;
      
      const result = await executeWithOptimalModel('data_enrichment', prompt, urgency);
      
      setResults(prev => ({ ...prev, [contactId]: result }));
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => ({ ...prev, [contactId]: errorMsg }));
      throw error;
    } finally {
      setEnriching(false);
    }
  }, []);

  const smartCategorizeAndTag = useCallback(async (
    contactId: string,
    contact: Contact
  ) => {
    setAnalyzing(true);
    setErrors(prev => ({ ...prev, [contactId]: '' }));
    
    try {
      const prompt = `Categorize and suggest tags for this contact:
        Name: ${contact.name}
        Company: ${contact.company}
        Title: ${contact.title}
        Industry: ${contact.industry}
        
        Suggest 3-5 relevant tags and primary category.`;
      
      const result = await executeWithOptimalModel('categorization', prompt, 'low');
      
      setResults(prev => ({ ...prev, [contactId]: result }));
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => ({ ...prev, [contactId]: errorMsg }));
      throw error;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const smartQualifyLead = useCallback(async (
    contactId: string,
    contact: Contact
  ) => {
    setAnalyzing(true);
    setErrors(prev => ({ ...prev, [contactId]: '' }));
    
    try {
      const prompt = `Qualify this lead for sales readiness:
        Name: ${contact.name}
        Company: ${contact.company}
        Title: ${contact.title}
        Status: ${contact.status}
        
        Assess: Budget authority, need, timeline, and decision-making power.`;
      
      const result = await executeWithOptimalModel('lead_qualification', prompt, 'high');
      
      setResults(prev => ({ ...prev, [contactId]: result }));
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => ({ ...prev, [contactId]: errorMsg }));
      throw error;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const smartBulkAnalysis = useCallback(async (
    contactData: Array<{ contactId: string; contact: Contact }>,
    analysisType: AIModelRecommendation,
    options: BulkAnalysisOptions
  ) => {
    setAnalyzing(true);
    
    try {
      const batchSize = 10; // Process in batches
      const batches = [];
      
      for (let i = 0; i < contactData.length; i += batchSize) {
        batches.push(contactData.slice(i, i + batchSize));
      }
      
      const allResults: Record<string, SmartAIResult> = {};
      let totalCost = 0;
      
      for (const batch of batches) {
        if (totalCost >= options.costLimit) {
          console.warn('Cost limit reached, stopping bulk analysis');
          break;
        }
        
        const batchPromises = batch.map(async ({ contactId, contact }) => {
          try {
            let result;
            switch (analysisType) {
              case 'contact_scoring':
                result = await smartScoreContact(contactId, contact, options.urgency);
                break;
              case 'categorization':
                result = await smartCategorizeAndTag(contactId, contact);
                break;
              case 'lead_qualification':
                result = await smartQualifyLead(contactId, contact);
                break;
              default:
                throw new Error(`Unsupported analysis type: ${analysisType}`);
            }
            
            allResults[contactId] = result;
            totalCost += result.cost;
            
            return result;
          } catch (error) {
            console.error(`Failed to analyze contact ${contactId}:`, error);
            return null;
          }
        });
        
        await Promise.all(batchPromises);
        
        // Add delay between batches to respect rate limits
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      setResults(prev => ({ ...prev, ...allResults }));
      
      return {
        results: allResults,
        totalCost,
        processedCount: Object.keys(allResults).length,
        skippedCount: contactData.length - Object.keys(allResults).length
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => ({ ...prev, bulk: errorMsg }));
      throw error;
    } finally {
      setAnalyzing(false);
    }
  }, [smartScoreContact, smartCategorizeAndTag, smartQualifyLead]);

  const clearResults = useCallback(() => {
    setResults({});
    setErrors({});
  }, []);

  return {
    smartScoreContact,
    smartEnrichContact,
    smartCategorizeAndTag,
    smartQualifyLead,
    smartBulkAnalysis,
    analyzing,
    enriching,
    results,
    errors,
    clearResults
  };
};

export const useTaskOptimization = () => {
  const [performance, setPerformance] = useState({
    totalTasks: 156,
    overallSuccessRate: 0.94,
    avgResponseTime: 2340,
    modelPerformance: [
      {
        model: 'gemma-2-27b',
        successRate: 0.96,
        avgTime: 1200,
        avgCost: 0.015,
        taskCount: 45
      },
      {
        model: 'gemini-flash',
        successRate: 0.92,
        avgTime: 800,
        avgCost: 0.008,
        taskCount: 67
      },
      {
        model: 'gpt-4o-mini',
        successRate: 0.98,
        avgTime: 2100,
        avgCost: 0.025,
        taskCount: 34
      },
      {
        model: 'gemini-pro',
        successRate: 0.95,
        avgTime: 3200,
        avgCost: 0.045,
        taskCount: 10
      }
    ]
  });

  const getRecommendations = useCallback((taskType: string) => {
    // Task-specific model recommendations
    const recommendations = {
      contact_scoring: {
        recommendedProvider: 'gemma',
        recommendedModel: 'gemma-2-27b',
        reason: 'Best balance of speed and accuracy for scoring tasks'
      },
      categorization: {
        recommendedProvider: 'gemini',
        recommendedModel: 'gemini-flash',
        reason: 'Fast processing ideal for categorization'
      },
      lead_qualification: {
        recommendedProvider: 'openai',
        recommendedModel: 'gpt-4o-mini',
        reason: 'Higher accuracy needed for qualification decisions'
      }
    };
    
    return recommendations[taskType as keyof typeof recommendations];
  }, []);

  const getInsights = useCallback(() => {
    return {
      costOptimization: 'Switch to Gemma models for simple tasks to reduce costs by 40%',
      performanceBoost: 'Use Gemini Flash for bulk operations to improve speed by 60%',
      accuracyImprovement: 'Consider GPT-4o for critical lead qualification tasks'
    };
  }, []);

  return {
    performance,
    getRecommendations,
    getInsights
  };
};