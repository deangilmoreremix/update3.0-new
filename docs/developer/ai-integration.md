# AI Integration Guide

This guide covers the AI services, tools, and integration patterns used in the Smart CRM application, including OpenAI GPT-4, Google Gemini, and custom AI workflows.

## 📋 Table of Contents

1. [Overview](#overview)
2. [AI Services Setup](#ai-services-setup)
3. [OpenAI Integration](#openai-integration)
4. [Google Gemini Integration](#google-gemini-integration)
5. [AI Orchestration Service](#ai-orchestration-service)
6. [AI Components](#ai-components)
7. [AI Tools System](#ai-tools-system)
8. [Prompt Engineering](#prompt-engineering)
9. [Error Handling & Fallbacks](#error-handling--fallbacks)
10. [Performance & Caching](#performance--caching)

## 🌐 Overview

### AI Services Architecture
```
Frontend Components
       ↓
AI Orchestrator Service
       ↓
┌──────────────┬──────────────┬──────────────┐
│ OpenAI GPT-4 │ Google Gemini│ Edge Functions│
└──────────────┴──────────────┴──────────────┘
       ↓              ↓              ↓
   Content Gen.   Analysis     Custom Logic
```

### Key AI Features
- **Content Generation**: Marketing copy, emails, proposals
- **Data Analysis**: Business insights, competitor analysis
- **Goal Tracking**: AI-powered goal suggestions and progress
- **Conversational AI**: Customer support and assistance
- **Document Processing**: Summarization and extraction

### Supported AI Models
- **OpenAI GPT-4**: Advanced reasoning and content generation
- **OpenAI GPT-3.5**: Fast responses and cost-effective operations
- **Google Gemini Pro**: Multimodal AI capabilities
- **Custom Models**: Domain-specific fine-tuned models

## ⚙️ AI Services Setup

### Environment Configuration

#### Required API Keys
```bash
# .env
VITE_OPENAI_API_KEY=sk-your-openai-api-key
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key  # Optional

# Server-side (for Edge Functions)
OPENAI_API_KEY=sk-your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
```

#### Service Configuration
```typescript
// src/config/aiConfig.ts
export interface AIConfig {
  openai: {
    apiKey: string;
    baseURL: string;
    defaultModel: string;
    maxTokens: number;
    temperature: number;
  };
  gemini: {
    apiKey: string;
    baseURL: string;
    defaultModel: string;
    maxTokens: number;
    temperature: number;
  };
  features: {
    contentGeneration: boolean;
    dataAnalysis: boolean;
    goalTracking: boolean;
    conversationalAI: boolean;
  };
}

const aiConfig: AIConfig = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    baseURL: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-pro',
    maxTokens: 2048,
    temperature: 0.7,
  },
  features: {
    contentGeneration: true,
    dataAnalysis: true,
    goalTracking: true,
    conversationalAI: true,
  },
};

// Validate configuration
const validateAIConfig = (config: AIConfig): void => {
  if (!config.openai.apiKey && !config.gemini.apiKey) {
    console.warn('No AI API keys configured. AI features will be disabled.');
  }
  
  if (config.openai.apiKey && !config.openai.apiKey.startsWith('sk-')) {
    throw new Error('Invalid OpenAI API key format');
  }
};

validateAIConfig(aiConfig);

export default aiConfig;
```

## 🤖 OpenAI Integration

### OpenAI Service Implementation

#### Core Service Class
```typescript
// src/services/openaiService.ts
import aiConfig from '../config/aiConfig';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: OpenAIMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GenerationOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  context?: Record<string, any>;
}

export class OpenAIService {
  private static readonly baseURL = aiConfig.openai.baseURL;
  private static readonly apiKey = aiConfig.openai.apiKey;

  // Generate text completion
  static async generateCompletion(
    prompt: string,
    options: GenerationOptions = {}
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const messages: OpenAIMessage[] = [];
    
    // Add system prompt if provided
    if (options.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt,
      });
    }

    // Add context if provided
    if (options.context) {
      const contextString = Object.entries(options.context)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n');
      
      messages.push({
        role: 'system',
        content: `Context:\n${contextString}`,
      });
    }

    // Add user prompt
    messages.push({
      role: 'user',
      content: prompt,
    });

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options.model || aiConfig.openai.defaultModel,
          messages,
          max_tokens: options.maxTokens || aiConfig.openai.maxTokens,
          temperature: options.temperature || aiConfig.openai.temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || '';

    } catch (error) {
      console.error('OpenAI generation failed:', error);
      throw error;
    }
  }

  // Generate content for specific use cases
  static async generateBusinessContent(
    type: 'email' | 'proposal' | 'marketing' | 'summary',
    topic: string,
    context?: Record<string, any>
  ): Promise<string> {
    const systemPrompts = {
      email: 'You are a professional business communication expert. Generate clear, concise, and engaging email content.',
      proposal: 'You are a business proposal specialist. Create compelling and professional proposals that highlight value propositions.',
      marketing: 'You are a marketing copywriter. Create engaging marketing content that drives action and builds brand awareness.',
      summary: 'You are an expert at creating concise, informative summaries that capture key points and insights.',
    };

    return this.generateCompletion(
      `Create ${type} content about: ${topic}`,
      {
        systemPrompt: systemPrompts[type],
        context,
        temperature: type === 'marketing' ? 0.8 : 0.7,
      }
    );
  }

  // Analyze data and provide insights
  static async analyzeData(
    data: any,
    analysisType: 'trends' | 'performance' | 'opportunities' | 'risks'
  ): Promise<string> {
    const systemPrompt = `You are a business data analyst. Provide clear, actionable insights based on the provided data. Focus on ${analysisType} analysis.`;

    return this.generateCompletion(
      `Analyze this data and provide insights: ${JSON.stringify(data, null, 2)}`,
      {
        systemPrompt,
        temperature: 0.3, // Lower temperature for more factual analysis
      }
    );
  }

  // Generate goal suggestions
  static async generateGoalSuggestions(
    category: string,
    currentGoals: string[],
    userContext?: Record<string, any>
  ): Promise<string[]> {
    const systemPrompt = `You are an AI goal-setting assistant. Generate 3-5 specific, measurable, achievable, relevant, and time-bound (SMART) goals for the ${category} category.`;

    const prompt = `
Current goals: ${currentGoals.join(', ')}
Generate new goal suggestions that complement existing goals and drive business growth.
Return the goals as a JSON array of strings.
`;

    const response = await this.generateCompletion(prompt, {
      systemPrompt,
      context: userContext,
      temperature: 0.8,
    });

    try {
      return JSON.parse(response);
    } catch {
      // Fallback: split by lines and clean up
      return response
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .slice(0, 5);
    }
  }

  // Stream completion for real-time responses
  static async streamCompletion(
    prompt: string,
    options: GenerationOptions,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const messages: OpenAIMessage[] = [
      ...(options.systemPrompt ? [{ role: 'system' as const, content: options.systemPrompt }] : []),
      { role: 'user' as const, content: prompt },
    ];

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || aiConfig.openai.defaultModel,
        messages,
        max_tokens: options.maxTokens || aiConfig.openai.maxTokens,
        temperature: options.temperature || aiConfig.openai.temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Failed to get response reader');

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch {
              // Ignore parsing errors for malformed chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
```

### OpenAI React Hooks

#### useOpenAI Hook
```typescript
// src/hooks/useOpenAI.ts
import { useState, useCallback } from 'react';
import { OpenAIService, GenerationOptions } from '../services/openaiService';

export interface UseOpenAIReturn {
  generateContent: (prompt: string, options?: GenerationOptions) => Promise<string>;
  streamContent: (
    prompt: string, 
    options: GenerationOptions,
    onChunk: (chunk: string) => void
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
  usage: { tokens: number; cost: number } | null;
}

export const useOpenAI = (): UseOpenAIReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ tokens: number; cost: number } | null>(null);

  const generateContent = useCallback(async (
    prompt: string, 
    options?: GenerationOptions
  ): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const content = await OpenAIService.generateCompletion(prompt, options);
      
      // Estimate cost (approximate)
      const estimatedTokens = prompt.length / 4 + content.length / 4;
      const estimatedCost = estimatedTokens * 0.00003; // GPT-4 pricing
      setUsage({ tokens: Math.round(estimatedTokens), cost: estimatedCost });

      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const streamContent = useCallback(async (
    prompt: string,
    options: GenerationOptions,
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await OpenAIService.streamCompletion(prompt, options, onChunk);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generateContent,
    streamContent,
    loading,
    error,
    usage,
  };
};
```

## 🧠 Google Gemini Integration

### Gemini Service Implementation

#### Core Gemini Service
```typescript
// src/services/geminiService.ts
import aiConfig from '../config/aiConfig';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
      role: string;
    };
    finishReason: string;
    index: number;
  }[];
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export interface GeminiOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

export class GeminiService {
  private static readonly baseURL = aiConfig.gemini.baseURL;
  private static readonly apiKey = aiConfig.gemini.apiKey;

  // Generate content with Gemini
  static async generateContent(
    prompt: string,
    options: GeminiOptions = {}
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const model = options.model || aiConfig.gemini.defaultModel;
    const url = `${this.baseURL}/models/${model}:generateContent?key=${this.apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: options.temperature || aiConfig.gemini.temperature,
            maxOutputTokens: options.maxOutputTokens || aiConfig.gemini.maxTokens,
            topP: options.topP || 0.95,
            topK: options.topK || 64,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || '';

    } catch (error) {
      console.error('Gemini generation failed:', error);
      throw error;
    }
  }

  // Analyze images with Gemini Pro Vision
  static async analyzeImage(
    imageData: string,
    prompt: string,
    options: GeminiOptions = {}
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const model = 'gemini-pro-vision';
    const url = `${this.baseURL}/models/${model}:generateContent?key=${this.apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: imageData, // Base64 encoded image
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: options.temperature || 0.4,
            maxOutputTokens: options.maxOutputTokens || 2048,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini Vision API error: ${error.error?.message || response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || '';

    } catch (error) {
      console.error('Gemini image analysis failed:', error);
      throw error;
    }
  }

  // Multi-turn conversation
  static async continueConversation(
    messages: GeminiMessage[],
    newPrompt: string,
    options: GeminiOptions = {}
  ): Promise<{ response: string; updatedMessages: GeminiMessage[] }> {
    const model = options.model || aiConfig.gemini.defaultModel;
    const url = `${this.baseURL}/models/${model}:generateContent?key=${this.apiKey}`;

    // Add new user message
    const updatedMessages = [
      ...messages,
      { role: 'user' as const, parts: [{ text: newPrompt }] },
    ];

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: updatedMessages,
          generationConfig: {
            temperature: options.temperature || aiConfig.gemini.temperature,
            maxOutputTokens: options.maxOutputTokens || aiConfig.gemini.maxTokens,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      const responseText = data.candidates[0]?.content?.parts[0]?.text || '';

      // Add model response to conversation
      const finalMessages = [
        ...updatedMessages,
        { role: 'model' as const, parts: [{ text: responseText }] },
      ];

      return {
        response: responseText,
        updatedMessages: finalMessages,
      };

    } catch (error) {
      console.error('Gemini conversation failed:', error);
      throw error;
    }
  }
}
```

### Enhanced Gemini Service

#### Advanced Gemini Features
```typescript
// src/services/enhancedGeminiService.ts
import { GeminiService, GeminiOptions } from './geminiService';

export class EnhancedGeminiService extends GeminiService {
  // Competitor analysis with structured output
  static async analyzeCompetitor(
    competitorData: {
      name: string;
      website?: string;
      description?: string;
      products?: string[];
    },
    analysisType: 'strengths' | 'weaknesses' | 'opportunities' | 'threats'
  ): Promise<{
    analysis: string;
    recommendations: string[];
    score: number;
  }> {
    const prompt = `
Analyze the competitor "${competitorData.name}" and provide a detailed ${analysisType} analysis.

Competitor Information:
${JSON.stringify(competitorData, null, 2)}

Please provide:
1. A comprehensive analysis of their ${analysisType}
2. 3-5 specific recommendations for competitive advantage
3. A competitive threat score from 1-10 (10 being highest threat)

Format the response as JSON with the following structure:
{
  "analysis": "detailed analysis text",
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "score": number
}
`;

    try {
      const response = await this.generateContent(prompt, {
        temperature: 0.3, // Lower temperature for more structured output
      });

      const parsed = JSON.parse(response);
      return {
        analysis: parsed.analysis || '',
        recommendations: parsed.recommendations || [],
        score: parsed.score || 5,
      };
    } catch (error) {
      // Fallback to unstructured response
      const analysis = await this.generateContent(
        `Analyze competitor "${competitorData.name}" for ${analysisType}`,
        { temperature: 0.3 }
      );

      return {
        analysis,
        recommendations: [],
        score: 5,
      };
    }
  }

  // Business reasoning and decision support
  static async generateBusinessReasoning(
    scenario: string,
    context: Record<string, any>,
    options?: {
      perspective?: 'financial' | 'strategic' | 'operational' | 'risk';
      depth?: 'overview' | 'detailed' | 'comprehensive';
    }
  ): Promise<{
    reasoning: string;
    pros: string[];
    cons: string[];
    recommendation: string;
    confidence: number;
  }> {
    const perspective = options?.perspective || 'strategic';
    const depth = options?.depth || 'detailed';

    const prompt = `
As a ${perspective} business advisor, analyze the following scenario and provide ${depth} reasoning:

Scenario: ${scenario}

Context:
${JSON.stringify(context, null, 2)}

Please provide:
1. Comprehensive reasoning and analysis
2. Key advantages (pros)
3. Potential drawbacks (cons)
4. Clear recommendation
5. Confidence level (1-100)

Format as JSON:
{
  "reasoning": "detailed analysis",
  "pros": ["advantage 1", "advantage 2", ...],
  "cons": ["drawback 1", "drawback 2", ...],
  "recommendation": "clear recommendation",
  "confidence": number
}
`;

    try {
      const response = await this.generateContent(prompt, {
        temperature: 0.4,
        maxOutputTokens: 2048,
      });

      const parsed = JSON.parse(response);
      return {
        reasoning: parsed.reasoning || '',
        pros: parsed.pros || [],
        cons: parsed.cons || [],
        recommendation: parsed.recommendation || '',
        confidence: parsed.confidence || 70,
      };
    } catch (error) {
      console.error('Business reasoning generation failed:', error);
      throw error;
    }
  }

  // Document summarization
  static async summarizeDocument(
    content: string,
    summaryType: 'executive' | 'detailed' | 'bullet-points' | 'key-insights',
    maxLength?: number
  ): Promise<string> {
    const summaryPrompts = {
      executive: 'Create a concise executive summary highlighting the most critical information for decision-makers.',
      detailed: 'Provide a comprehensive summary that captures all important details and nuances.',
      'bullet-points': 'Summarize the content as clear, actionable bullet points.',
      'key-insights': 'Extract and present the key insights, findings, and takeaways.',
    };

    const lengthInstruction = maxLength 
      ? `Keep the summary under ${maxLength} words.`
      : 'Provide an appropriately-sized summary.';

    const prompt = `
${summaryPrompts[summaryType]}

Document Content:
${content}

${lengthInstruction}

Please ensure the summary is accurate, well-structured, and captures the essence of the original content.
`;

    return this.generateContent(prompt, {
      temperature: 0.3,
      maxOutputTokens: maxLength ? Math.min(maxLength * 2, 2048) : 1024,
    });
  }
}
```

## 🎯 AI Orchestration Service

### Central AI Management

#### AI Orchestrator Service
```typescript
// src/services/aiOrchestratorService.ts
import { OpenAIService } from './openaiService';
import { EnhancedGeminiService } from './enhancedGeminiService';
import { EdgeFunctionService } from './edgeFunctionService';

export type AIProvider = 'openai' | 'gemini' | 'edge-function';

export interface AIRequest {
  prompt: string;
  provider?: AIProvider;
  options?: any;
  context?: Record<string, any>;
  fallbackProvider?: AIProvider;
}

export interface AIResponse<T = string> {
  content: T;
  provider: AIProvider;
  usage?: {
    tokens: number;
    cost: number;
  };
  processingTime: number;
}

export class AIOrchestratorService {
  // Main orchestration method
  static async processRequest<T = string>(
    request: AIRequest
  ): Promise<AIResponse<T>> {
    const startTime = Date.now();
    const provider = request.provider || this.selectOptimalProvider(request);

    try {
      const content = await this.executeRequest(request, provider);
      const processingTime = Date.now() - startTime;

      return {
        content: content as T,
        provider,
        processingTime,
      };

    } catch (error) {
      console.error(`AI request failed with ${provider}:`, error);

      // Try fallback provider if specified
      if (request.fallbackProvider && request.fallbackProvider !== provider) {
        try {
          const content = await this.executeRequest(request, request.fallbackProvider);
          const processingTime = Date.now() - startTime;

          return {
            content: content as T,
            provider: request.fallbackProvider,
            processingTime,
          };
        } catch (fallbackError) {
          console.error(`Fallback provider ${request.fallbackProvider} also failed:`, fallbackError);
        }
      }

      throw error;
    }
  }

  // Execute request with specific provider
  private static async executeRequest(
    request: AIRequest,
    provider: AIProvider
  ): Promise<string> {
    switch (provider) {
      case 'openai':
        return OpenAIService.generateCompletion(request.prompt, {
          systemPrompt: request.options?.systemPrompt,
          context: request.context,
          ...request.options,
        });

      case 'gemini':
        return EnhancedGeminiService.generateContent(request.prompt, request.options);

      case 'edge-function':
        return EdgeFunctionService.generateContent(
          request.prompt,
          request.options?.type || 'content',
          request.context
        );

      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  // Select optimal provider based on request characteristics
  private static selectOptimalProvider(request: AIRequest): AIProvider {
    const promptLength = request.prompt.length;
    const hasContext = request.context && Object.keys(request.context).length > 0;

    // Use OpenAI for complex reasoning and long prompts
    if (promptLength > 2000 || (hasContext && promptLength > 1000)) {
      return 'openai';
    }

    // Use Gemini for medium complexity tasks
    if (promptLength > 500) {
      return 'gemini';
    }

    // Use edge functions for simple, fast responses
    return 'edge-function';
  }

  // Batch processing for multiple requests
  static async processBatch(
    requests: AIRequest[]
  ): Promise<AIResponse[]> {
    const results = await Promise.allSettled(
      requests.map(request => this.processRequest(request))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Batch request ${index} failed:`, result.reason);
        return {
          content: '',
          provider: 'openai' as AIProvider,
          processingTime: 0,
          error: result.reason.message,
        };
      }
    });
  }

  // Specific business use cases
  static async generateBusinessContent(
    type: 'email' | 'proposal' | 'marketing' | 'summary',
    topic: string,
    context?: Record<string, any>
  ): Promise<AIResponse> {
    return this.processRequest({
      prompt: `Generate ${type} content about: ${topic}`,
      provider: 'openai', // OpenAI excels at content generation
      context,
      fallbackProvider: 'gemini',
    });
  }

  static async analyzeCompetitor(
    competitorData: any,
    analysisType: string
  ): Promise<AIResponse<any>> {
    return this.processRequest({
      prompt: `Analyze competitor for ${analysisType}`,
      provider: 'gemini', // Gemini good for analysis
      context: { competitor: competitorData },
      fallbackProvider: 'openai',
    });
  }

  static async generateGoalSuggestions(
    category: string,
    userContext: Record<string, any>
  ): Promise<AIResponse<string[]>> {
    const response = await this.processRequest({
      prompt: `Generate SMART goal suggestions for ${category}`,
      provider: 'openai',
      context: userContext,
      fallbackProvider: 'gemini',
    });

    try {
      const goals = JSON.parse(response.content);
      return { ...response, content: goals };
    } catch {
      // Parse as text and split
      const goals = response.content
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .slice(0, 5);
      
      return { ...response, content: goals };
    }
  }
}
```

## 🧩 AI Components

### AI Goals Panel

#### Interactive Goals Component
```typescript
// src/components/aiTools/AIGoalsPanel.tsx
import React, { useState, useEffect } from 'react';
import { AIOrchestratorService } from '../../services/aiOrchestratorService';
import { GoalService, Goal } from '../../services/goalService';
import { useAuth } from '../../contexts/AuthContext';

interface AIGoalsPanelProps {
  category?: string;
  onGoalComplete?: (goal: Goal) => void;
}

export const AIGoalsPanel: React.FC<AIGoalsPanelProps> = ({ 
  category, 
  onGoalComplete 
}) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user, category]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userGoals = category 
        ? await GoalService.getGoalsByCategory(user.id, user.tenantId!, category)
        : await GoalService.getUserGoals(user.id, user.tenantId!);
      
      setGoals(userGoals);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = async () => {
    if (!user) return;

    try {
      setGeneratingSuggestions(true);
      
      const currentGoals = goals.map(g => g.title);
      const context = {
        existingGoals: currentGoals,
        category: category || 'general',
        userRole: user.role,
        completedGoals: goals.filter(g => g.status === 'completed').length,
      };

      const response = await AIOrchestratorService.generateGoalSuggestions(
        category || 'business',
        context
      );

      setSuggestions(response.content);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const createGoalFromSuggestion = async (suggestion: string) => {
    if (!user) return;

    try {
      const newGoal = await GoalService.createGoal({
        title: suggestion,
        description: `AI-suggested goal for ${category || 'business'} improvement`,
        category: category || 'general',
        status: 'active',
        priority: 3,
        progress: 0,
        user_id: user.id,
        tenant_id: user.tenantId!,
        metadata: { aiGenerated: true },
      });

      setGoals(prev => [newGoal, ...prev]);
      setSuggestions(prev => prev.filter(s => s !== suggestion));
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const updateGoalProgress = async (goalId: string, progress: number) => {
    try {
      const updatedGoal = await GoalService.updateGoalProgress(goalId, progress);
      
      setGoals(prev => 
        prev.map(g => g.id === goalId ? updatedGoal : g)
      );

      if (updatedGoal.status === 'completed' && onGoalComplete) {
        onGoalComplete(updatedGoal);
      }
    } catch (error) {
      console.error('Failed to update goal progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            AI Goals {category && `- ${category}`}
          </h2>
          <button
            onClick={generateSuggestions}
            disabled={generatingSuggestions}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {generatingSuggestions ? 'Generating...' : 'Get AI Suggestions'}
          </button>
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              AI Suggested Goals
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {suggestion}
                  </span>
                  <button
                    onClick={() => createGoalFromSuggestion(suggestion)}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Goal
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Goals */}
        <div className="space-y-4">
          {goals.map(goal => (
            <div 
              key={goal.id}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {goal.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  goal.status === 'completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {goal.status}
                </span>
              </div>

              {goal.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {goal.description}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                {goal.status === 'active' && (
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 25))}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      +25%
                    </button>
                    <button
                      onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 10))}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      +10%
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No goals yet. Get started with AI suggestions!
            </p>
            <button
              onClick={generateSuggestions}
              disabled={generatingSuggestions}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {generatingSuggestions ? 'Generating...' : 'Generate AI Goals'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```

### Competitor Analysis Component

#### Advanced Competitor Analysis
```typescript
// src/components/aiTools/CompetitorAnalysisContent.tsx
import React, { useState } from 'react';
import { EnhancedGeminiService } from '../../services/enhancedGeminiService';

interface CompetitorData {
  name: string;
  website?: string;
  description?: string;
  products?: string[];
}

interface AnalysisResult {
  analysis: string;
  recommendations: string[];
  score: number;
}

export const CompetitorAnalysisContent: React.FC = () => {
  const [competitorData, setCompetitorData] = useState<CompetitorData>({
    name: '',
    website: '',
    description: '',
    products: [],
  });

  const [analysisType, setAnalysisType] = useState<'strengths' | 'weaknesses' | 'opportunities' | 'threats'>('strengths');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!competitorData.name.trim()) return;

    try {
      setLoading(true);
      const analysis = await EnhancedGeminiService.analyzeCompetitor(
        competitorData,
        analysisType
      );
      setResult(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = () => {
    setCompetitorData(prev => ({
      ...prev,
      products: [...(prev.products || []), ''],
    }));
  };

  const updateProduct = (index: number, value: string) => {
    setCompetitorData(prev => ({
      ...prev,
      products: prev.products?.map((p, i) => i === index ? value : p) || [],
    }));
  };

  const removeProduct = (index: number) => {
    setCompetitorData(prev => ({
      ...prev,
      products: prev.products?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        AI Competitor Analysis
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Competitor Name *
            </label>
            <input
              type="text"
              value={competitorData.name}
              onChange={(e) => setCompetitorData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter competitor name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website
            </label>
            <input
              type="url"
              value={competitorData.website}
              onChange={(e) => setCompetitorData(prev => ({ ...prev, website: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              placeholder="https://competitor.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={competitorData.description}
              onChange={(e) => setCompetitorData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              placeholder="Brief description of the competitor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Products/Services
            </label>
            <div className="space-y-2">
              {competitorData.products?.map((product, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => updateProduct(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Product/service name"
                  />
                  <button
                    onClick={() => removeProduct(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addProduct}
                className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500"
              >
                + Add Product/Service
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Analysis Type
            </label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value as any)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="strengths">Strengths Analysis</option>
              <option value="weaknesses">Weaknesses Analysis</option>
              <option value="opportunities">Opportunities Analysis</option>
              <option value="threats">Threats Analysis</option>
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !competitorData.name.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze Competitor'}
          </button>
        </div>

        {/* Results */}
        <div>
          {result && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Analysis Results
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Threat Score:
                  </span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    result.score >= 8 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : result.score >= 6
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {result.score}/10
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Analysis
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {result.analysis}
                  </p>
                </div>

                {result.recommendations.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li 
                          key={index}
                          className="flex items-start space-x-2"
                        >
                          <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {rec}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {!result && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Enter competitor information and click "Analyze Competitor" to get AI-powered insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

## 🎯 Best Practices

### Do's ✅
- Implement proper error handling and fallbacks
- Use appropriate AI models for specific tasks
- Cache expensive AI operations
- Implement rate limiting for API calls
- Validate and sanitize AI inputs
- Provide loading states and progress indicators
- Use structured prompts for consistent outputs
- Monitor AI usage and costs

### Don'ts ❌
- Don't expose API keys in client-side code
- Don't trust AI outputs without validation
- Don't make AI calls without user consent
- Don't ignore rate limits and quotas
- Don't use AI for sensitive operations without review
- Don't forget to handle edge cases and errors
- Don't make blocking AI calls in critical paths

## 🔗 Related Documentation

- [Project Structure](./project-structure.md) - Understanding the codebase organization
- [Frontend Guide](./frontend-guide.md) - React patterns and component architecture
- [Supabase Integration](./supabase-integration.md) - Backend services and data management
- [Code Standards](./code-standards.md) - Development guidelines and conventions
