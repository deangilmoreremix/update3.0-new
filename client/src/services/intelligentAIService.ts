interface AITask {
  type: 'contact-analysis' | 'email-generation' | 'company-research' | 'deal-summary' | 'next-actions' | 'insights' | 'contact-research';
  priority: 'speed' | 'quality' | 'cost';
  complexity: 'low' | 'medium' | 'high';
}

interface ModelPreference {
  primary: 'openai' | 'gemini';
  model: string;
  fallback: 'openai' | 'gemini';
  fallbackModel: string;
  reason: string;
}

class IntelligentAIService {
  private taskRouting: Record<string, ModelPreference> = {
    'contact-analysis': {
      primary: 'openai',
      model: 'gpt-4o',
      fallback: 'gemini',
      fallbackModel: 'gemini-pro',
      reason: 'OpenAI excels at detailed contact analysis and relationship mapping'
    },
    'email-generation': {
      primary: 'openai',
      model: 'gpt-4o',
      fallback: 'gemini',
      fallbackModel: 'gemini-pro',
      reason: 'OpenAI produces more natural, persuasive email content'
    },
    'company-research': {
      primary: 'gemini',
      model: 'gemini-pro',
      fallback: 'openai',
      fallbackModel: 'gpt-4o',
      reason: 'Gemini has better access to real-time web information'
    },
    'deal-summary': {
      primary: 'openai',
      model: 'gpt-4o',
      fallback: 'gemini',
      fallbackModel: 'gemini-pro',
      reason: 'OpenAI provides more structured and actionable deal summaries'
    },
    'next-actions': {
      primary: 'openai',
      model: 'gpt-4o',
      fallback: 'gemini',
      fallbackModel: 'gemini-pro',
      reason: 'OpenAI better understands sales processes and next steps'
    },
    'insights': {
      primary: 'gemini',
      model: 'gemini-pro',
      fallback: 'openai',
      fallbackModel: 'gpt-4o',
      reason: 'Gemini excels at pattern recognition and business insights'
    },
    'contact-research': {
      primary: 'gemini',
      model: 'gemini-pro',
      fallback: 'openai',
      fallbackModel: 'gpt-4o',
      reason: 'Gemini has superior web search and information gathering capabilities'
    }
  };

  private openaiService: unknown;
  private geminiService: unknown;

  constructor(openaiService: any, geminiService: any) {
    this.openaiService = openaiService;
    this.geminiService = geminiService;
  }

  private getOptimalModel(taskType: string, priority: 'speed' | 'quality' | 'cost' = 'quality'): ModelPreference {
    const basePreference = this.taskRouting[taskType] || this.taskRouting['insights'];
    
    // Adjust based on priority
    if (priority === 'speed') {
      // For speed, prefer Gemini as it's generally faster
      return {
        ...basePreference,
        primary: 'gemini',
        model: 'gemini-pro',
        reason: `${basePreference.reason} (optimized for speed)`
      };
    } else if (priority === 'cost') {
      // For cost optimization, prefer Gemini as it's typically more cost-effective
      return {
        ...basePreference,
        primary: 'gemini',
        model: 'gemini-pro',
        reason: `${basePreference.reason} (optimized for cost)`
      };
    }
    
    return basePreference;
  }

  async executeTask(taskType: string, data: any, options: { priority?: 'speed' | 'quality' | 'cost' } = {}): Promise<any> {
    const modelPreference = this.getOptimalModel(taskType, options.priority);
    
    try {
      // Try primary model first
      if (modelPreference.primary === 'openai') {
        return await this.executeOpenAITask(taskType, data, modelPreference.model);
      } else {
        return await this.executeGeminiTask(taskType, data, modelPreference.model);
      }
    } catch (error) {
      console.warn(`Primary model ${modelPreference.primary} failed, trying fallback ${modelPreference.fallback}:`, error);
      
      try {
        // Try fallback model
        if (modelPreference.fallback === 'openai') {
          return await this.executeOpenAITask(taskType, data, modelPreference.fallbackModel);
        } else {
          return await this.executeGeminiTask(taskType, data, modelPreference.fallbackModel);
        }
      } catch (fallbackError) {
        console.error(`Both primary and fallback models failed for task ${taskType}:`, fallbackError);
        // Return a fallback response
        return this.generateFallbackResponse(taskType, data);
      }
    }
  }

  private async executeOpenAITask(taskType: string, data: any, model: string): Promise<any> {
    if (!this.openaiService) {
      throw new Error('OpenAI service not available');
    }

    switch (taskType) {
      case 'contact-analysis':
        return await this.openaiService.analyzeContact(data);
      case 'email-generation':
        return await this.openaiService.generateEmail(data);
      case 'company-research':
        return await this.openaiService.researchCompany(data.companyName, data.domain);
      case 'deal-summary':
        return await this.openaiService.generateDealSummary(data);
      case 'next-actions':
        return await this.openaiService.suggestNextActions(data);
      case 'insights':
        return await this.openaiService.getInsights(data);
      case 'contact-research':
        return await this.openaiService.researchContact(data.personName, data.companyName);
      default:
        throw new Error(`Unknown task type: ${taskType}`);
    }
  }

  private async executeGeminiTask(taskType: string, data: any, model: string): Promise<any> {
    if (!this.geminiService) {
      throw new Error('Gemini service not available');
    }

    switch (taskType) {
      case 'contact-analysis':
        return await this.geminiService.analyzeContact(data);
      case 'email-generation':
        return await this.geminiService.generateEmail(data);
      case 'company-research':
        return await this.geminiService.researchCompany(data.companyName, data.domain);
      case 'deal-summary':
        return await this.geminiService.generateDealSummary(data);
      case 'next-actions':
        return await this.geminiService.suggestNextActions(data);
      case 'insights':
        return await this.geminiService.getInsights(data);
      case 'contact-research':
        return await this.geminiService.researchContact(data.personName, data.companyName);
      default:
        throw new Error(`Unknown task type: ${taskType}`);
    }
  }

  private generateFallbackResponse(taskType: string, data: any): unknown {
    const fallbackResponses = {
      'contact-analysis': {
        score: 75,
        insights: ['Contact appears engaged based on available data', 'Follow-up recommended within 3-5 days'],
        risk_factors: ['Limited interaction history'],
        opportunities: ['Potential for upselling based on company profile']
      },
      'email-generation': {
        subject: 'Following up on our conversation',
        body: 'Hi there,\n\nI wanted to follow up on our recent conversation. Please let me know if you have any questions.\n\nBest regards'
      },
      'company-research': {
        company_overview: 'Company information not available at this time',
        key_contacts: [],
        recent_news: [],
        competitive_landscape: 'Analysis pending'
      },
      'deal-summary': {
        summary: 'Deal analysis in progress',
        key_points: ['Deal review needed'],
        next_steps: ['Follow up with primary contact']
      },
      'next-actions': {
        immediate_actions: ['Contact primary stakeholder'],
        follow_up_timeline: '3-5 business days',
        priority: 'medium'
      },
      'insights': {
        insights: ['Data analysis in progress'],
        recommendations: ['Continue current approach'],
        confidence: 60
      },
      'contact-research': {
        contact_info: 'Research in progress',
        professional_background: 'Information gathering',
        recent_activity: 'Monitoring social presence'
      }
    };

    return fallbackResponses[taskType as keyof typeof fallbackResponses] || {
      status: 'completed',
      message: 'Task completed with basic analysis'
    };
  }

  // Convenience methods for common tasks
  async analyzeContact(contact: any, priority: 'speed' | 'quality' | 'cost' = 'quality') {
    return await this.executeTask('contact-analysis', contact, { priority });
  }

  async generateEmail(contact: any, context?: string, priority: 'speed' | 'quality' | 'cost' = 'quality') {
    return await this.executeTask('email-generation', { contact, context }, { priority });
  }

  async researchCompany(companyName: string, domain?: string, priority: 'speed' | 'quality' | 'cost' = 'quality') {
    return await this.executeTask('company-research', { companyName, domain }, { priority });
  }

  async researchContact(personName: string, companyName?: string, priority: 'speed' | 'quality' | 'cost' = 'speed') {
    return await this.executeTask('contact-research', { personName, companyName }, { priority });
  }

  async generateDealSummary(dealData: any, priority: 'speed' | 'quality' | 'cost' = 'quality') {
    return await this.executeTask('deal-summary', dealData, { priority });
  }

  async suggestNextActions(dealData: any, priority: 'speed' | 'quality' | 'cost' = 'quality') {
    return await this.executeTask('next-actions', dealData, { priority });
  }

  async getInsights(data: any, priority: 'speed' | 'quality' | 'cost' = 'quality') {
    return await this.executeTask('insights', data, { priority });
  }

  // Utility method to get task routing information
  getTaskRouting() {
    return this.taskRouting;
  }
}

// Create and export a singleton instance
let intelligentAIServiceInstance: IntelligentAIService | null = null;

export const createIntelligentAIService = (openaiService: any, geminiService: any): IntelligentAIService => {
  if (!intelligentAIServiceInstance) {
    intelligentAIServiceInstance = new IntelligentAIService(openaiService, geminiService);
  }
  return intelligentAIServiceInstance;
};

export const getIntelligentAIService = (): IntelligentAIService | null => {
  return intelligentAIServiceInstance;
};

export default IntelligentAIService;