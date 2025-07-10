import { openaiService } from './openaiService';
import { geminiService } from './geminiService';
import { edgeFunctionService } from '../edgeFunctionService';

export interface AITask {
  type: 'content-generation' | 'analysis' | 'conversation' | 'code' | 'research' | 'reasoning' | 'creative' | 'structured-data';
  complexity: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  context: string;
  customerProfile?: CustomerProfile;
  requiresRealTime?: boolean;
  needsStructuredOutput?: boolean;
  tokenLimit?: number;
}

export interface CustomerProfile {
  id: string;
  name: string;
  industry: string;
  preferences: {
    communicationStyle: 'formal' | 'casual' | 'technical';
    responseLength: 'brief' | 'detailed' | 'comprehensive';
    tone: 'professional' | 'friendly' | 'authoritative';
  };
  history: {
    previousInteractions: number;
    successfulTasks: string[];
    preferredModels: string[];
  };
  aiScore: number;
}

export interface ModelCapability {
  model: string;
  provider: 'openai' | 'gemini' | 'gemma';
  strengths: string[];
  weaknesses: string[];
  optimalFor: string[];
  costEfficiency: number; // 1-10 scale
  speed: number; // 1-10 scale
  accuracy: number; // 1-10 scale
  contextWindow: number;
}

// Define model capabilities
const modelCapabilities: ModelCapability[] = [
  {
    model: 'gpt-4o',
    provider: 'openai',
    strengths: ['reasoning', 'code-generation', 'complex-analysis', 'structured-output'],
    weaknesses: ['cost', 'speed-for-simple-tasks'],
    optimalFor: ['analysis', 'reasoning', 'structured-data', 'code'],
    costEfficiency: 4,
    speed: 6,
    accuracy: 9,
    contextWindow: 128000
  },
  {
    model: 'gpt-3.5-turbo',
    provider: 'openai',
    strengths: ['speed', 'cost-efficiency', 'conversation', 'simple-tasks'],
    weaknesses: ['complex-reasoning', 'long-context'],
    optimalFor: ['conversation', 'content-generation'],
    costEfficiency: 8,
    speed: 9,
    accuracy: 7,
    contextWindow: 16000
  },
  {
    model: 'gemini-2.5-flash',
    provider: 'gemini',
    strengths: ['speed', 'multimodal', 'real-time', 'cost-effective'],
    weaknesses: ['complex-reasoning', 'structured-output'],
    optimalFor: ['content-generation', 'research', 'creative'],
    costEfficiency: 9,
    speed: 10,
    accuracy: 8,
    contextWindow: 1000000
  },
  {
    model: 'gemini-2.5-pro',
    provider: 'gemini',
    strengths: ['reasoning', 'analysis', 'multimodal', 'large-context'],
    weaknesses: ['cost', 'speed'],
    optimalFor: ['analysis', 'reasoning', 'research'],
    costEfficiency: 6,
    speed: 7,
    accuracy: 9,
    contextWindow: 2000000
  },
  {
    model: 'gemma-2-9b',
    provider: 'gemma',
    strengths: ['efficiency', 'privacy', 'local-deployment', 'specialized-tasks'],
    weaknesses: ['general-knowledge', 'complex-reasoning'],
    optimalFor: ['conversation', 'content-generation'],
    costEfficiency: 10,
    speed: 8,
    accuracy: 6,
    contextWindow: 8000
  }
];

export class IntelligentModelSelector {
  private static instance: IntelligentModelSelector;
  private performanceHistory: Map<string, number> = new Map();
  private customerModelPreferences: Map<string, string[]> = new Map();

  static getInstance(): IntelligentModelSelector {
    if (!IntelligentModelSelector.instance) {
      IntelligentModelSelector.instance = new IntelligentModelSelector();
    }
    return IntelligentModelSelector.instance;
  }

  /**
   * Select the optimal AI model based on task requirements and customer profile
   */
  public selectOptimalModel(task: AITask): ModelCapability {
    const candidateModels = this.filterModelsByCapability(task);
    const scoredModels = this.scoreModels(candidateModels, task);
    const customerWeightedModels = this.applyCustomerPreferences(scoredModels, task.customerProfile);
    
    // Sort by score and return the best model
    const bestModel = customerWeightedModels.sort((a, b) => b.score - a.score)[0];
    
    console.log(`Selected model: ${bestModel.model.model} (${bestModel.model.provider}) with score: ${bestModel.score}`);
    
    return bestModel.model;
  }

  /**
   * Filter models based on basic task requirements
   */
  private filterModelsByCapability(task: AITask): ModelCapability[] {
    return modelCapabilities.filter(model => {
      // Check if model is optimal for this task type
      if (model.optimalFor.includes(task.type)) return true;
      
      // Check context window requirements
      if (task.tokenLimit && model.contextWindow < task.tokenLimit) return false;
      
      // Real-time requirements favor faster models
      if (task.requiresRealTime && model.speed < 7) return false;
      
      // Structured output requirements
      if (task.needsStructuredOutput && !model.strengths.includes('structured-output')) {
        // Allow if accuracy is high enough to compensate
        return model.accuracy >= 8;
      }
      
      return true;
    });
  }

  /**
   * Score models based on task requirements
   */
  private scoreModels(models: ModelCapability[], task: AITask): Array<{model: ModelCapability, score: number}> {
    return models.map(model => {
      let score = 0;
      
      // Base score from model capabilities
      score += model.accuracy * 0.3;
      score += model.speed * 0.2;
      score += model.costEfficiency * 0.2;
      
      // Task-specific bonuses
      if (model.optimalFor.includes(task.type)) score += 2;
      if (model.strengths.some(strength => task.type.includes(strength))) score += 1;
      
      // Urgency adjustments
      if (task.urgency === 'high') {
        score += model.speed * 0.3;
      } else if (task.urgency === 'low') {
        score += model.costEfficiency * 0.3;
      }
      
      // Complexity adjustments
      if (task.complexity === 'high') {
        score += model.accuracy * 0.4;
      } else if (task.complexity === 'low') {
        score += model.speed * 0.3;
        score += model.costEfficiency * 0.3;
      }
      
      // Performance history bonus
      const historyKey = `${model.provider}-${model.model}`;
      const historicalPerformance = this.performanceHistory.get(historyKey) || 5;
      score += historicalPerformance * 0.1;
      
      return { model, score };
    });
  }

  /**
   * Apply customer preferences to model selection
   */
  private applyCustomerPreferences(
    scoredModels: Array<{model: ModelCapability, score: number}>, 
    customerProfile?: CustomerProfile
  ): Array<{model: ModelCapability, score: number}> {
    if (!customerProfile) return scoredModels;
    
    return scoredModels.map(({ model, score }) => {
      let adjustedScore = score;
      
      // Customer model preferences
      if (customerProfile.history.preferredModels.includes(model.model)) {
        adjustedScore += 1;
      }
      
      // Communication style preferences
      if (customerProfile.preferences.communicationStyle === 'technical' && 
          model.strengths.includes('code-generation')) {
        adjustedScore += 0.5;
      }
      
      if (customerProfile.preferences.responseLength === 'comprehensive' && 
          model.contextWindow > 50000) {
        adjustedScore += 0.5;
      }
      
      // AI score influence
      if (customerProfile.aiScore > 80 && model.accuracy >= 9) {
        adjustedScore += 0.3;
      } else if (customerProfile.aiScore < 50 && model.speed >= 8) {
        adjustedScore += 0.3;
      }
      
      return { model, score: adjustedScore };
    });
  }

  /**
   * Execute AI task with the selected model
   */
  public async executeTask(task: AITask, prompt: string): Promise<string> {
    const selectedModel = this.selectOptimalModel(task);
    
    try {
      let result: string;
      
      switch (selectedModel.provider) {
        case 'openai':
          result = await this.executeOpenAITask(selectedModel.model, prompt, task);
          break;
        case 'gemini':
          result = await this.executeGeminiTask(selectedModel.model, prompt, task);
          break;
        case 'gemma':
          result = await this.executeGemmaTask(selectedModel.model, prompt, task);
          break;
        default:
          throw new Error(`Unsupported provider: ${selectedModel.provider}`);
      }
      
      // Record successful execution
      this.recordModelPerformance(selectedModel, true);
      
      return result;
    } catch (error) {
      console.error(`Error executing task with ${selectedModel.model}:`, error);
      
      // Record failed execution
      this.recordModelPerformance(selectedModel, false);
      
      // Fallback to a reliable model
      const fallbackModel = modelCapabilities.find(m => m.model === 'gemini-2.5-flash');
      if (fallbackModel && fallbackModel.model !== selectedModel.model) {
        return await this.executeGeminiTask(fallbackModel.model, prompt, task);
      }
      
      throw error;
    }
  }

  /**
   * Execute task using OpenAI
   */
  private async executeOpenAITask(model: string, prompt: string, task: AITask): Promise<string> {
    // Add customer context if available
    let contextualPrompt = prompt;
    if (task.customerProfile) {
      contextualPrompt = `Customer Profile: ${task.customerProfile.name} (${task.customerProfile.industry})
Communication Style: ${task.customerProfile.preferences.communicationStyle}
Response Length: ${task.customerProfile.preferences.responseLength}
Tone: ${task.customerProfile.preferences.tone}

${prompt}`;
    }
    
    return await openaiService.generateResponse(contextualPrompt);
  }

  /**
   * Execute task using Gemini
   */
  private async executeGeminiTask(model: string, prompt: string, task: AITask): Promise<string> {
    // Add customer context if available
    let contextualPrompt = prompt;
    if (task.customerProfile) {
      contextualPrompt = `Customer Profile: ${task.customerProfile.name} (${task.customerProfile.industry})
Communication Style: ${task.customerProfile.preferences.communicationStyle}
Response Length: ${task.customerProfile.preferences.responseLength}
Tone: ${task.customerProfile.preferences.tone}

${prompt}`;
    }
    
    return await geminiService.generateResponse(contextualPrompt);
  }

  /**
   * Execute task using Gemma (via edge function)
   */
  private async executeGemmaTask(model: string, prompt: string, task: AITask): Promise<string> {
    // Add customer context if available
    let contextualPrompt = prompt;
    if (task.customerProfile) {
      contextualPrompt = `Customer Profile: ${task.customerProfile.name} (${task.customerProfile.industry})
Communication Style: ${task.customerProfile.preferences.communicationStyle}
Response Length: ${task.customerProfile.preferences.responseLength}
Tone: ${task.customerProfile.preferences.tone}

${prompt}`;
    }
    
    return await edgeFunctionService.callAIFunction('gemma-chat', {
      prompt: contextualPrompt,
      model: model
    });
  }

  /**
   * Record model performance for future selections
   */
  private recordModelPerformance(model: ModelCapability, success: boolean): void {
    const key = `${model.provider}-${model.model}`;
    const currentScore = this.performanceHistory.get(key) || 5;
    
    // Adjust score based on success/failure
    const newScore = success ? 
      Math.min(10, currentScore + 0.1) : 
      Math.max(1, currentScore - 0.2);
    
    this.performanceHistory.set(key, newScore);
  }

  /**
   * Get model recommendations for a specific customer
   */
  public getModelRecommendations(customerProfile: CustomerProfile): ModelCapability[] {
    const recommendations = modelCapabilities.map(model => {
      const task: AITask = {
        type: 'analysis',
        complexity: 'medium',
        urgency: 'medium',
        context: 'general',
        customerProfile
      };
      
      const score = this.scoreModels([model], task)[0].score;
      return { model, score };
    });
    
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(r => r.model);
  }
}

export const intelligentModelSelector = IntelligentModelSelector.getInstance();