/**
 * Kimi AI Integration for GitHub Agent
 * Uses Kimi-K2 model for advanced code analysis and debugging
 */

class KimiAIAgent {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.moonshot.cn/v1';
    this.model = 'moonshot-v1-128k'; // Kimi-K2 model with 128K context
  }

  async chat(messages, options = {}) {
    const payload = {
      model: this.model,
      messages,
      temperature: options.temperature || 0.3,
      max_tokens: options.maxTokens || 4000,
      stream: options.stream || false,
      tools: options.tools || []
    };

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Kimi API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async analyzeCode(code, language, context = '') {
    const messages = [
      {
        role: 'system',
        content: `You are an expert code analyzer using Kimi-K2 capabilities. Analyze the provided ${language} code for:
        - Potential bugs and issues
        - Performance optimizations
        - Code quality improvements
        - Security vulnerabilities
        - Best practices recommendations
        
        Provide specific, actionable feedback with line numbers when possible.`
      },
      {
        role: 'user',
        content: `Context: ${context}\n\nCode to analyze:\n\`\`\`${language}\n${code}\n\`\`\``
      }
    ];

    return await this.chat(messages, { temperature: 0.2 });
  }

  async debugError(errorMessage, code, stackTrace = '') {
    const messages = [
      {
        role: 'system',
        content: 'You are a debugging expert using Kimi-K2\'s advanced reasoning. Help identify the root cause of errors and provide solutions.'
      },
      {
        role: 'user',
        content: `Error: ${errorMessage}\n\nStack Trace: ${stackTrace}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nPlease help debug this issue and suggest fixes.`
      }
    ];

    return await this.chat(messages, { temperature: 0.1 });
  }

  async generateCommitMessage(diff) {
    const messages = [
      {
        role: 'system',
        content: 'Generate a concise, descriptive commit message following conventional commits format based on the code changes.'
      },
      {
        role: 'user',
        content: `Generate a commit message for these changes:\n\`\`\`diff\n${diff}\n\`\`\``
      }
    ];

    return await this.chat(messages, { temperature: 0.3, maxTokens: 200 });
  }

  async reviewPR(prDiff, prDescription) {
    const messages = [
      {
        role: 'system',
        content: 'You are conducting a thorough code review. Analyze the PR for code quality, potential issues, and provide constructive feedback.'
      },
      {
        role: 'user',
        content: `PR Description: ${prDescription}\n\nChanges:\n\`\`\`diff\n${prDiff}\n\`\`\`\n\nPlease provide a detailed code review.`
      }
    ];

    return await this.chat(messages, { temperature: 0.2 });
  }

  async suggestRefactoring(code, language) {
    const messages = [
      {
        role: 'system',
        content: 'Suggest refactoring improvements for better code quality, maintainability, and performance.'
      },
      {
        role: 'user',
        content: `Refactor this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``
      }
    ];

    return await this.chat(messages, { temperature: 0.4 });
  }
}

// Export for use in GitHub Actions or other automation
module.exports = { KimiAIAgent };

// Example usage
if (require.main === module) {
  const agent = new KimiAIAgent('sk-dDBl3OhTNtprLJB4eurbDL5Vv5YDxkcr02h21mkNuBDIW2kT');
  
  // Example: Analyze a piece of code
  const sampleCode = `
    function processData(data) {
      for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
      }
    }
  `;
  
  agent.analyzeCode(sampleCode, 'javascript', 'Function to process array data')
    .then(result => console.log('Analysis:', result.choices[0].message.content))
    .catch(err => console.error('Error:', err));
}
