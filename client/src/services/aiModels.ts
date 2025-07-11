export interface AIModel {
  id: string;
  name: string;
  family: 'gemini' | 'gemma' | 'openai' | 'anthropic';
  version: string;
  pricing: {
    input: number;
    output: number;
  };
  capabilities: string[];
  maxTokens: number;
  recommended?: boolean;
  description: string;
}

export type AIModelRecommendation = 
  | 'contact_scoring' 
  | 'categorization' 
  | 'tagging' 
  | 'lead_qualification'
  | 'content_generation'
  | 'data_enrichment';

export const AI_MODELS: Record<string, AIModel> = {
  'gemini-pro': {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    family: 'gemini',
    version: '1.0',
    pricing: { input: 0.50, output: 1.50 },
    capabilities: ['text-generation', 'analysis', 'reasoning'],
    maxTokens: 32768,
    recommended: true,
    description: 'Advanced reasoning and analysis'
  },
  'gemini-flash': {
    id: 'gemini-flash',
    name: 'Gemini Flash',
    family: 'gemini',
    version: '1.5',
    pricing: { input: 0.075, output: 0.30 },
    capabilities: ['fast-processing', 'text-generation'],
    maxTokens: 1048576,
    description: 'Fast, cost-effective processing'
  },
  'gemma-2-27b': {
    id: 'gemma-2-27b',
    name: 'Gemma 2 27B',
    family: 'gemma',
    version: '2.0',
    pricing: { input: 0.27, output: 0.27 },
    capabilities: ['lightweight', 'efficient', 'reasoning'],
    maxTokens: 8192,
    recommended: true,
    description: 'Lightweight model optimized for efficiency'
  },
  'gemma-2-9b': {
    id: 'gemma-2-9b',
    name: 'Gemma 2 9B',
    family: 'gemma',
    version: '2.0',
    pricing: { input: 0.20, output: 0.20 },
    capabilities: ['ultra-fast', 'basic-tasks'],
    maxTokens: 8192,
    description: 'Ultra-fast processing for simple tasks'
  },
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    family: 'openai',
    version: '2024-08-06',
    pricing: { input: 2.50, output: 10.00 },
    capabilities: ['high-accuracy', 'complex-reasoning', 'multimodal'],
    maxTokens: 128000,
    recommended: true,
    description: 'Highest accuracy for complex tasks'
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    family: 'openai',
    version: '2024-07-18',
    pricing: { input: 0.15, output: 0.60 },
    capabilities: ['balanced', 'cost-effective'],
    maxTokens: 128000,
    description: 'Balanced performance and cost'
  }
};

export const MODEL_CATEGORIES = {
  recommended: 'Recommended',
  gemini: 'Gemini Models',
  gemma: 'Gemma Models', 
  openai: 'OpenAI Models',
  anthropic: 'Anthropic Models'
};

export const AI_MODEL_RECOMMENDATIONS: Record<AIModelRecommendation, string[]> = {
  contact_scoring: ['gemma-2-27b', 'gemini-flash', 'gpt-4o-mini'],
  categorization: ['gemma-2-9b', 'gemini-flash'],
  tagging: ['gemma-2-9b', 'gemini-flash'],
  lead_qualification: ['gemini-pro', 'gpt-4o', 'gemma-2-27b'],
  content_generation: ['gpt-4o', 'gemini-pro'],
  data_enrichment: ['gpt-4o', 'gemini-pro', 'gemma-2-27b']
};

export const getModelsByCategory = (category: string): AIModel[] => {
  if (category === 'recommended') {
    return Object.values(AI_MODELS).filter(model => model.recommended);
  }
  return Object.values(AI_MODELS).filter(model => model.family === category);
};

export const getOptimalModel = (
  useCase: AIModelRecommendation,
  urgency: 'low' | 'medium' | 'high' = 'medium'
): string => {
  const recommendations = AI_MODEL_RECOMMENDATIONS[useCase];
  
  if (urgency === 'high') {
    // Prioritize accuracy
    return recommendations.find(id => AI_MODELS[id].family === 'openai') || recommendations[0];
  } else if (urgency === 'low') {
    // Prioritize cost
    return recommendations.find(id => AI_MODELS[id].family === 'gemma') || recommendations[recommendations.length - 1];
  }
  
  // Balanced approach
  return recommendations[0];
};