import { createClient } from '@supabase/supabase-js';

// Kimi AI Service for debugging assistance
class KimiDebugService {
  private apiKey: string;
  private baseUrl: string;
  private modelName: string;

  constructor() {
    this.apiKey = (import.meta as any).env?.VITE_KIMI_API_KEY || '';
    this.baseUrl = 'https://platform.moonshot.ai/v1';
    this.modelName = 'kimi-k2-instruct';
    
    if (!this.apiKey) {
      console.warn('Kimi API key not found. Set VITE_KIMI_API_KEY in environment variables.');
    }
  }

  // Debug tool definitions for Kimi-K2
  private debugTools = [
    {
      type: 'function',
      function: {
        name: 'analyze_error',
        description: 'Analyze JavaScript/TypeScript errors and provide solutions',
        parameters: {
          type: 'object',
          required: ['error_message', 'code_context'],
          properties: {
            error_message: {
              type: 'string',
              description: 'The error message or stack trace'
            },
            code_context: {
              type: 'string', 
              description: 'The relevant code where the error occurred'
            },
            file_path: {
              type: 'string',
              description: 'The file path where the error occurred'
            }
          }
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'suggest_fix',
        description: 'Suggest code fixes and improvements',
        parameters: {
          type: 'object',
          required: ['code', 'issue_description'],
          properties: {
            code: {
              type: 'string',
              description: 'The problematic code snippet'
            },
            issue_description: {
              type: 'string',
              description: 'Description of the issue or desired improvement'
            },
            framework: {
              type: 'string',
              description: 'Framework being used (React, Vue, etc.)'
            }
          }
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'explain_code',
        description: 'Explain complex code sections for debugging understanding',
        parameters: {
          type: 'object',
          required: ['code'],
          properties: {
            code: {
              type: 'string',
              description: 'The code to explain'
            },
            language: {
              type: 'string',
              description: 'Programming language (javascript, typescript, etc.)'
            }
          }
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'performance_analysis',
        description: 'Analyze code performance and suggest optimizations',
        parameters: {
          type: 'object',
          required: ['code'],
          properties: {
            code: {
              type: 'string',
              description: 'Code to analyze for performance issues'
            },
            performance_metrics: {
              type: 'string',
              description: 'Any performance metrics or issues observed'
            }
          }
        }
      }
    }
  ];

  // Tool implementations
  private toolMap = {
    analyze_error: (args: any) => {
      return {
        analysis: `Analyzing error: ${args.error_message}`,
        context: args.code_context,
        suggestions: []
      };
    },
    suggest_fix: (args: any) => {
      return {
        original_code: args.code,
        suggested_fixes: [],
        explanation: `Analyzing code for: ${args.issue_description}`
      };
    },
    explain_code: (args: any) => {
      return {
        code: args.code,
        explanation: 'Code explanation will be provided by Kimi AI',
        complexity: 'medium'
      };
    },
    performance_analysis: (args: any) => {
      return {
        code: args.code,
        performance_issues: [],
        optimizations: []
      };
    }
  };

  // Main debug method with streaming support
  async debugWithKimi(
    problem: string,
    codeContext: string,
    filePath?: string,
    onStream?: (chunk: string) => void
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Kimi API key not configured');
    }

    const messages = [
      {
        role: 'system',
        content: `You are Kimi, an expert debugging assistant. You specialize in:
- Analyzing JavaScript/TypeScript errors
- React component debugging  
- Performance optimization
- Code quality improvements
- Build and deployment issues

Provide clear, actionable solutions with code examples when possible.`
      },
      {
        role: 'user',
        content: `Debug this issue:

Problem: ${problem}

Code Context:
\`\`\`
${codeContext}
\`\`\`

${filePath ? `File: ${filePath}` : ''}

Please analyze the issue and provide a solution.`
      }
    ];

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.modelName,
          messages,
          temperature: 0.6,
          tools: this.debugTools,
          tool_choice: 'auto',
          stream: !!onStream,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        throw new Error(`Kimi API error: ${response.statusText}`);
      }

      if (onStream) {
        return this.handleStreamingResponse(response, onStream);
      } else {
        const data = await response.json();
        return this.processResponse(data);
      }
    } catch (error) {
      console.error('Kimi debug error:', error);
      throw error;
    }
  }

  // Handle streaming responses
  private async handleStreamingResponse(
    response: Response,
    onStream: (chunk: string) => void
  ): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    let fullResponse = '';
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            if (jsonStr.trim() === '[DONE]') continue;

            try {
              const data = JSON.parse(jsonStr);
              const content = data.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
                onStream(content);
              }

              // Handle tool calls if present
              const toolCalls = data.choices?.[0]?.delta?.tool_calls;
              if (toolCalls) {
                // Process tool calls here if needed
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

    return fullResponse;
  }

  // Process non-streaming responses
  private processResponse(data: any): string {
    const choice = data.choices?.[0];
    if (!choice) return 'No response from Kimi AI';

    let response = choice.message?.content || '';

    // Handle tool calls if present
    if (choice.message?.tool_calls) {
      for (const toolCall of choice.message.tool_calls) {
        const toolName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        
        if (this.toolMap[toolName as keyof typeof this.toolMap]) {
          const result = this.toolMap[toolName as keyof typeof this.toolMap](args);
          response += `\n\nTool Result (${toolName}):\n${JSON.stringify(result, null, 2)}`;
        }
      }
    }

    return response;
  }

  // Quick error analysis method
  async analyzeError(
    errorMessage: string,
    stackTrace?: string,
    codeContext?: string
  ): Promise<{
    analysis: string;
    suggestions: string[];
    severity: 'low' | 'medium' | 'high';
  }> {
    const context = codeContext || stackTrace || 'No additional context provided';
    
    try {
      const response = await this.debugWithKimi(
        `Error Analysis: ${errorMessage}`,
        context
      );

      return {
        analysis: response,
        suggestions: this.extractSuggestions(response),
        severity: this.determineSeverity(errorMessage)
      };
    } catch (error) {
      return {
        analysis: 'Error analysis failed. Please check your Kimi API configuration.',
        suggestions: ['Check network connectivity', 'Verify API key', 'Review error manually'],
        severity: 'medium'
      };
    }
  }

  // Extract actionable suggestions from AI response
  private extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];
    const lines = response.split('\n');
    
    for (const line of lines) {
      if (line.includes('suggestion:') || line.includes('fix:') || line.includes('solution:')) {
        suggestions.push(line.trim());
      }
    }
    
    return suggestions.length > 0 ? suggestions : ['Review the detailed analysis above'];
  }

  // Determine error severity
  private determineSeverity(errorMessage: string): 'low' | 'medium' | 'high' {
    const highSeverityKeywords = ['cannot read', 'undefined is not', 'null is not', 'reference error'];
    const mediumSeverityKeywords = ['warning', 'deprecated', 'type error'];
    
    const message = errorMessage.toLowerCase();
    
    if (highSeverityKeywords.some(keyword => message.includes(keyword))) {
      return 'high';
    }
    
    if (mediumSeverityKeywords.some(keyword => message.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }

  // Check API health
  async checkApiHealth(): Promise<boolean> {
    if (!this.apiKey) return false;
    
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const kimiDebugService = new KimiDebugService();
