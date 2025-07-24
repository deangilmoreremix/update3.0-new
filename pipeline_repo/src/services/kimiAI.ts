import { AIModel } from '../config/aiModels';

export interface KimiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface KimiChatRequest {
  model: string;
  messages: KimiMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  tools?: any[];
  tool_choice?: string;
}

export interface KimiChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
      tool_calls?: any[];
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class KimiAIService {
  private apiKey: string;
  private baseURL: string = 'https://api.moonshot.cn/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chatCompletion(request: KimiChatRequest): Promise<KimiChatResponse> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Kimi AI API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async streamChatCompletion(
    request: KimiChatRequest,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ ...request, stream: true }),
    });

    if (!response.ok) {
      throw new Error(`Kimi AI API error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  // GitHub Agent specific methods
  async analyzeCode(code: string, language: string = 'typescript'): Promise<string> {
    const response = await this.chatCompletion({
      model: 'moonshot-v1-128k',
      messages: [
        {
          role: 'system',
          content: `You are an expert code analyzer and GitHub agent assistant. Analyze the provided ${language} code for:
- Potential bugs and issues
- Performance improvements
- Best practices violations
- Security concerns
- Code quality improvements

Provide specific, actionable feedback with line numbers when possible.`
        },
        {
          role: 'user',
          content: `Please analyze this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
        }
      ],
      temperature: 0.2,
      max_tokens: 2048
    });

    return response.choices[0].message.content;
  }

  async debugError(error: string, context: string): Promise<string> {
    const response = await this.chatCompletion({
      model: 'moonshot-v1-128k',
      messages: [
        {
          role: 'system',
          content: `You are an expert debugger and GitHub agent. Help debug errors by:
- Identifying the root cause
- Providing step-by-step debugging approach
- Suggesting specific fixes
- Recommending prevention strategies

Be precise and actionable in your suggestions.`
        },
        {
          role: 'user',
          content: `Debug this error:\n\nError: ${error}\n\nContext: ${context}`
        }
      ],
      temperature: 0.1,
      max_tokens: 2048
    });

    return response.choices[0].message.content;
  }

  async generateCommitMessage(diff: string): Promise<string> {
    const response = await this.chatCompletion({
      model: 'moonshot-v1-32k',
      messages: [
        {
          role: 'system',
          content: `Generate a clear, concise commit message following conventional commits format.
Format: <type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Keep description under 50 characters for the summary.
Add body if needed to explain the "what" and "why".`
        },
        {
          role: 'user',
          content: `Generate a commit message for this diff:\n\n${diff}`
        }
      ],
      temperature: 0.3,
      max_tokens: 256
    });

    return response.choices[0].message.content;
  }

  async reviewPullRequest(title: string, description: string, diff: string): Promise<string> {
    const response = await this.chatCompletion({
      model: 'moonshot-v1-128k',
      messages: [
        {
          role: 'system',
          content: `You are an expert code reviewer. Review this pull request and provide:
- Overall assessment
- Specific code feedback
- Security considerations
- Performance implications
- Suggestions for improvement

Be constructive and specific in your feedback.`
        },
        {
          role: 'user',
          content: `Review this pull request:

Title: ${title}
Description: ${description}

Diff:
${diff}`
        }
      ],
      temperature: 0.2,
      max_tokens: 3000
    });

    return response.choices[0].message.content;
  }
}

// Environment configuration
export const kimiConfig = {
  apiKey: process.env.KIMI_API_KEY || '',
  models: {
    coding: 'moonshot-v1-128k',
    debugging: 'moonshot-v1-128k',
    analysis: 'moonshot-v1-32k'
  }
};

// Singleton instance
let kimiService: KimiAIService | null = null;

export function getKimiService(): KimiAIService {
  if (!kimiService) {
    if (!kimiConfig.apiKey) {
      throw new Error('KIMI_API_KEY environment variable is not set');
    }
    kimiService = new KimiAIService(kimiConfig.apiKey);
  }
  return kimiService;
}

export default KimiAIService;
