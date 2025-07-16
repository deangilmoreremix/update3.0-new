// Feature types for orchestration
export type AIFeature = 
  | 'email_generation'
  | 'pipeline_analysis' 
  | 'deal_insights'
  | 'meeting_agenda'
  | 'contact_scoring'
  | 'content_creation'
  | 'quick_response'
  | 'lead_qualification'
  | 'business_analysis';

interface TaskContext {
  customerId?: string;
  modelId?: string;
  complexity?: 'low' | 'medium' | 'high';
  priority?: 'speed' | 'quality' | 'cost';
  maxBudget?: number;
  promptTokens?: number;
}

interface ServiceResponse {
  content: unknown;
  model: string;
  provider: string;
  responseTime: number;
  cost?: number;
  tokensUsed?: number;
  success: boolean;
  error?: string;
}

class AIOrchestratorService {
  // Track usage statistics for smart routing
  private usageStats: Record<string, {
    callCount: number;
    successCount: number;
    avgResponseTime: number;
    avgCost: number;
  }> = {};

  constructor() {
    this.initializeStats();
  }

  private initializeStats() {
    const models = [
      'gemma-2-2b-it', 'gemma-2-9b-it', 'gemma-2-27b-it',
      'gemini-2.5-flash', 'gemini-2.5-flash-8b',
      'gpt-4o-mini', 'gpt-3.5-turbo'
    ];

    models.forEach(model => {
      this.usageStats[model] = {
        callCount: 0,
        successCount: 0,
        avgResponseTime: 0,
        avgCost: 0
      };
    });
  }

  /**
   * Strip markdown code blocks from AI response
   */
  private stripMarkdownCodeBlocks(content: string): string {
    // Remove markdown code blocks (```json...``` or ```...```)
    let cleaned = content.trim();
    
    // Remove opening code block markers
    cleaned = cleaned.replace(/^```(?:json|javascript|js)?\s*/i, '');
    
    // Remove closing code block markers
    cleaned = cleaned.replace(/\s*```\s*$/i, '');
    
    // Remove any remaining leading/trailing whitespace
    return cleaned.trim();
  }

  /**
   * Parse JSON safely from AI response
   */
  private parseJsonSafely(content: string): unknown {
    // First strip any markdown code blocks
    const cleaned = this.stripMarkdownCodeBlocks(content);
    
    try {
      return JSON.parse(cleaned);
    } catch (error) {
      console.warn('Failed to parse JSON, attempting additional cleanup:', error);
      
      // Additional cleanup attempt - sometimes AI adds explanatory text before/after the JSON
      try {
        const jsonStart = cleaned.indexOf('{');
        const jsonEnd = cleaned.lastIndexOf('}') + 1;
        
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          const jsonString = cleaned.substring(jsonStart, jsonEnd);
          return JSON.parse(jsonString);
        }
      } catch (secondError) {
        console.error('All JSON parsing attempts failed:', secondError);
      }
      
      // If all else fails, return the cleaned string
      return cleaned;
    }
  }

  /**
   * Select optimal model based on feature and context
   */
  private selectOptimalModel(feature: AIFeature, context: TaskContext): string {
    const { complexity = 'medium', priority = 'balanced' } = context;
    
    // Model selection logic based on feature requirements
    const modelMap: Record<AIFeature, Record<string, string[]>> = {
      'email_generation': {
        'low': ['gemma-2-2b-it', 'gemini-2.5-flash-8b'],
        'medium': ['gemini-2.5-flash', 'gpt-4o-mini'],
        'high': ['gpt-4o-mini', 'gemma-2-27b-it']
      },
      'pipeline_analysis': {
        'low': ['gemini-2.5-flash-8b', 'gemma-2-9b-it'],
        'medium': ['gemini-2.5-flash', 'gpt-4o-mini'],
        'high': ['gpt-4o-mini', 'gemma-2-27b-it']
      },
      'deal_insights': {
        'low': ['gemma-2-9b-it', 'gemini-2.5-flash-8b'],
        'medium': ['gemini-2.5-flash', 'gpt-4o-mini'],
        'high': ['gpt-4o-mini', 'gemma-2-27b-it']
      },
      'contact_scoring': {
        'low': ['gemma-2-2b-it', 'gemini-2.5-flash-8b'],
        'medium': ['gemma-2-9b-it', 'gemini-2.5-flash'],
        'high': ['gpt-4o-mini', 'gemma-2-27b-it']
      },
      'content_creation': {
        'low': ['gemma-2-9b-it', 'gemini-2.5-flash'],
        'medium': ['gpt-4o-mini', 'gemini-2.5-flash'],
        'high': ['gpt-4o-mini', 'gemma-2-27b-it']
      },
      'quick_response': {
        'low': ['gemma-2-2b-it', 'gemini-2.5-flash-8b'],
        'medium': ['gemma-2-9b-it', 'gemini-2.5-flash-8b'],
        'high': ['gemini-2.5-flash', 'gpt-4o-mini']
      },
      'meeting_agenda': {
        'low': ['gemma-2-9b-it', 'gemini-2.5-flash'],
        'medium': ['gemini-2.5-flash', 'gpt-4o-mini'],
        'high': ['gpt-4o-mini', 'gemma-2-27b-it']
      },
      'lead_qualification': {
        'low': ['gemma-2-9b-it', 'gemini-2.5-flash-8b'],
        'medium': ['gemini-2.5-flash', 'gpt-4o-mini'],
        'high': ['gpt-4o-mini', 'gemma-2-27b-it']
      },
      'business_analysis': {
        'low': ['gemini-2.5-flash', 'gemma-2-9b-it'],
        'medium': ['gpt-4o-mini', 'gemini-2.5-flash'],
        'high': ['gpt-4o-mini', 'gemma-2-27b-it']
      }
    };

    const candidates = modelMap[feature]?.[complexity] || ['gemini-2.5-flash'];
    
    // Return first candidate (can be enhanced with actual performance-based selection)
    return candidates[0];
  }

  /**
   * Execute AI task with optimal model selection
   */
  async executeTask(
    feature: AIFeature,
    prompt: string,
    context: TaskContext = {}
  ): Promise<ServiceResponse> {
    const startTime = Date.now();
    const selectedModel = this.selectOptimalModel(feature, context);
    
    try {
      // Mock response - replace with actual AI service calls
      const mockResponse = {
        content: `AI response for ${feature} using ${selectedModel}`,
        model: selectedModel,
        provider: selectedModel.includes('gpt') ? 'openai' : 'google',
        responseTime: Date.now() - startTime,
        success: true,
        tokensUsed: Math.floor(Math.random() * 1000) + 100,
        cost: Math.random() * 0.01
      };

      // Update usage statistics
      this.updateUsageStats(selectedModel, true, mockResponse.responseTime, mockResponse.cost || 0);
      
      return mockResponse;
    } catch (error) {
      const errorResponse = {
        content: null,
        model: selectedModel,
        provider: selectedModel.includes('gpt') ? 'openai' : 'google',
        responseTime: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      // Update usage statistics for failed attempt
      this.updateUsageStats(selectedModel, false, errorResponse.responseTime, 0);
      
      return errorResponse;
    }
  }

  /**
   * Update usage statistics for model performance tracking
   */
  private updateUsageStats(model: string, success: boolean, responseTime: number, cost: number) {
    if (!this.usageStats[model]) {
      this.usageStats[model] = {
        callCount: 0,
        successCount: 0,
        avgResponseTime: 0,
        avgCost: 0
      };
    }

    const stats = this.usageStats[model];
    stats.callCount++;
    
    if (success) {
      stats.successCount++;
    }
    
    // Update rolling averages
    stats.avgResponseTime = (stats.avgResponseTime * (stats.callCount - 1) + responseTime) / stats.callCount;
    stats.avgCost = (stats.avgCost * (stats.callCount - 1) + cost) / stats.callCount;
  }

  /**
   * Get performance metrics for all models
   */
  getPerformanceMetrics() {
    return { ...this.usageStats };
  }

  /**
   * Analyze deals with context-aware model selection
   */
  async analyzeDeal(dealData: any, context: TaskContext): Promise<ServiceResponse> {
    const prompt = `Analyze this deal: ${JSON.stringify(dealData)}`;
    return this.executeTask('deal_insights', prompt, context);
  }

  /**
   * Generate contact insights
   */
  async generateContactInsights(contacts: unknown[], context: TaskContext): Promise<ServiceResponse> {
    const prompt = `Generate insights for contacts: ${JSON.stringify(contacts)}`;
    return this.executeTask('contact_scoring', prompt, context);
  }

  /**
   * Create email content
   */
  async generateEmail(emailContext: any, context: TaskContext): Promise<ServiceResponse> {
    const prompt = `Generate email for: ${JSON.stringify(emailContext)}`;
    return this.executeTask('email_generation', prompt, context);
  }

  /**
   * Analyze pipeline performance
   */
  async analyzePipeline(pipelineData: any, context: TaskContext): Promise<ServiceResponse> {
    const prompt = `Analyze pipeline: ${JSON.stringify(pipelineData)}`;
    return this.executeTask('pipeline_analysis', prompt, context);
  }
}

export const aiOrchestratorService = new AIOrchestratorService();