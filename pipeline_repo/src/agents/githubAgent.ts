import { KimiAIService, getKimiService } from '../services/kimiAI';
import { getModelById, getRecommendedModelForTask } from '../config/aiModels';

export interface GitHubAgentConfig {
  kimiApiKey: string;
  defaultModel?: string;
  enableStreaming?: boolean;
  maxRetries?: number;
}

export interface AgentTask {
  type: 'code-analysis' | 'debug-error' | 'commit-message' | 'pr-review' | 'general-assistance';
  data: any;
  context?: string;
}

export interface AgentResponse {
  success: boolean;
  result: string;
  model: string;
  tokensUsed?: number;
  error?: string;
}

export class GitHubAgent {
  private kimiService: KimiAIService;
  private config: GitHubAgentConfig;

  constructor(config: GitHubAgentConfig) {
    this.config = {
      defaultModel: 'moonshot-v1-128k',
      enableStreaming: false,
      maxRetries: 3,
      ...config
    };
    
    // Set up environment variable for Kimi API key
    process.env.KIMI_API_KEY = config.kimiApiKey;
    this.kimiService = getKimiService();
  }

  async executeTask(task: AgentTask): Promise<AgentResponse> {
    try {
      switch (task.type) {
        case 'code-analysis':
          return await this.analyzeCode(task.data.code, task.data.language);
        
        case 'debug-error':
          return await this.debugError(task.data.error, task.data.context || task.context);
        
        case 'commit-message':
          return await this.generateCommitMessage(task.data.diff);
        
        case 'pr-review':
          return await this.reviewPullRequest(
            task.data.title,
            task.data.description,
            task.data.diff
          );
        
        case 'general-assistance':
          return await this.generalAssistance(task.data.query, task.context);
        
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }
    } catch (error) {
      return {
        success: false,
        result: '',
        model: this.config.defaultModel!,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async analyzeCode(code: string, language: string = 'typescript'): Promise<AgentResponse> {
    const result = await this.kimiService.analyzeCode(code, language);
    return {
      success: true,
      result,
      model: 'moonshot-v1-128k'
    };
  }

  private async debugError(error: string, context: string = ''): Promise<AgentResponse> {
    const result = await this.kimiService.debugError(error, context);
    return {
      success: true,
      result,
      model: 'moonshot-v1-128k'
    };
  }

  private async generateCommitMessage(diff: string): Promise<AgentResponse> {
    const result = await this.kimiService.generateCommitMessage(diff);
    return {
      success: true,
      result,
      model: 'moonshot-v1-32k'
    };
  }

  private async reviewPullRequest(
    title: string,
    description: string,
    diff: string
  ): Promise<AgentResponse> {
    const result = await this.kimiService.reviewPullRequest(title, description, diff);
    return {
      success: true,
      result,
      model: 'moonshot-v1-128k'
    };
  }

  private async generalAssistance(query: string, context: string = ''): Promise<AgentResponse> {
    const response = await this.kimiService.chatCompletion({
      model: this.config.defaultModel!,
      messages: [
        {
          role: 'system',
          content: `You are an intelligent GitHub agent assistant powered by Kimi AI. Help with:
- Code development and debugging
- Git workflows and best practices
- Technical problem solving
- Development process optimization

Be helpful, accurate, and provide actionable advice.`
        },
        {
          role: 'user',
          content: context ? `Context: ${context}\n\nQuery: ${query}` : query
        }
      ],
      temperature: 0.3,
      max_tokens: 2048
    });

    return {
      success: true,
      result: response.choices[0].message.content,
      model: this.config.defaultModel!,
      tokensUsed: response.usage.total_tokens
    };
  }

  // Streaming version for real-time responses
  async executeTaskStream(
    task: AgentTask,
    onChunk: (chunk: string) => void
  ): Promise<AgentResponse> {
    if (!this.config.enableStreaming) {
      throw new Error('Streaming is not enabled for this agent');
    }

    try {
      let fullResponse = '';
      
      await this.kimiService.streamChatCompletion(
        {
          model: this.config.defaultModel!,
          messages: this.buildMessagesForTask(task),
          temperature: 0.3,
          max_tokens: 2048
        },
        (chunk) => {
          fullResponse += chunk;
          onChunk(chunk);
        }
      );

      return {
        success: true,
        result: fullResponse,
        model: this.config.defaultModel!
      };
    } catch (error) {
      return {
        success: false,
        result: '',
        model: this.config.defaultModel!,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildMessagesForTask(task: AgentTask) {
    const systemPrompts = {
      'code-analysis': 'You are an expert code analyzer. Provide detailed code analysis with specific suggestions.',
      'debug-error': 'You are an expert debugger. Help identify and fix errors with clear explanations.',
      'commit-message': 'Generate clear, conventional commit messages based on code changes.',
      'pr-review': 'You are an expert code reviewer. Provide constructive PR feedback.',
      'general-assistance': 'You are a helpful GitHub agent assistant. Provide accurate, actionable advice.'
    };

    return [
      {
        role: 'system' as const,
        content: systemPrompts[task.type] || systemPrompts['general-assistance']
      },
      {
        role: 'user' as const,
        content: this.formatTaskData(task)
      }
    ];
  }

  private formatTaskData(task: AgentTask): string {
    switch (task.type) {
      case 'code-analysis':
        return `Analyze this ${task.data.language || 'code'}:\n\n\`\`\`\n${task.data.code}\n\`\`\``;
      
      case 'debug-error':
        return `Debug this error:\n\nError: ${task.data.error}\nContext: ${task.data.context || task.context || 'No additional context'}`;
      
      case 'commit-message':
        return `Generate a commit message for this diff:\n\n${task.data.diff}`;
      
      case 'pr-review':
        return `Review this PR:\n\nTitle: ${task.data.title}\nDescription: ${task.data.description}\n\nDiff:\n${task.data.diff}`;
      
      case 'general-assistance':
        return task.context ? `Context: ${task.context}\n\nQuery: ${task.data.query}` : task.data.query;
      
      default:
        return JSON.stringify(task.data);
    }
  }

  // Utility methods
  getAvailableModels() {
    return getRecommendedModelForTask('github-agent');
  }

  updateConfig(newConfig: Partial<GitHubAgentConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.kimiApiKey) {
      process.env.KIMI_API_KEY = newConfig.kimiApiKey;
      this.kimiService = getKimiService();
    }
  }
}

// Factory function for easy initialization
export function createGitHubAgent(apiKey: string, options?: Partial<GitHubAgentConfig>): GitHubAgent {
  return new GitHubAgent({
    kimiApiKey: apiKey,
    ...options
  });
}

export default GitHubAgent;
