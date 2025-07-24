#!/usr/bin/env node

import { GitHubAgent, createGitHubAgent, AgentTask } from '../src/agents/githubAgent';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Your Kimi API key
const KIMI_API_KEY = 'sk-dDBl3OhTNtprLJB4eurbDL5Vv5YDxkcr02h21mkNuBDIW2kT';

class GitHubAgentCLI {
  private agent: GitHubAgent;

  constructor() {
    this.agent = createGitHubAgent(KIMI_API_KEY, {
      enableStreaming: true,
      defaultModel: 'moonshot-v1-128k'
    });
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args[0];

    try {
      switch (command) {
        case 'analyze':
          await this.analyzeCode(args.slice(1));
          break;
        
        case 'debug':
          await this.debugError(args.slice(1));
          break;
        
        case 'commit':
          await this.generateCommitMessage();
          break;
        
        case 'review':
          await this.reviewPR(args.slice(1));
          break;
        
        case 'ask':
          await this.askQuestion(args.slice(1));
          break;
        
        case 'help':
        default:
          this.showHelp();
          break;
      }
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  }

  private async analyzeCode(args: string[]) {
    const filePath = args[0];
    if (!filePath) {
      console.error('❌ Please provide a file path to analyze');
      return;
    }

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return;
    }

    const code = fs.readFileSync(filePath, 'utf-8');
    const language = this.detectLanguage(filePath);

    console.log(`🔍 Analyzing ${filePath} (${language})...\n`);

    const task: AgentTask = {
      type: 'code-analysis',
      data: { code, language }
    };

    const response = await this.agent.executeTask(task);
    
    if (response.success) {
      console.log('📊 Analysis Result:');
      console.log('─'.repeat(50));
      console.log(response.result);
    } else {
      console.error('❌ Analysis failed:', response.error);
    }
  }

  private async debugError(args: string[]) {
    const error = args.join(' ');
    if (!error) {
      console.error('❌ Please provide an error message to debug');
      return;
    }

    // Try to get git context
    let context = '';
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf-8' });
      const gitLog = execSync('git log --oneline -5', { encoding: 'utf-8' });
      context = `Git Status:\n${gitStatus}\n\nRecent commits:\n${gitLog}`;
    } catch (e) {
      context = 'No git context available';
    }

    console.log(`🐛 Debugging error: "${error}"\n`);

    const task: AgentTask = {
      type: 'debug-error',
      data: { error, context }
    };

    const response = await this.agent.executeTask(task);
    
    if (response.success) {
      console.log('🔧 Debug Analysis:');
      console.log('─'.repeat(50));
      console.log(response.result);
    } else {
      console.error('❌ Debug failed:', response.error);
    }
  }

  private async generateCommitMessage() {
    console.log('📝 Generating commit message from staged changes...\n');

    try {
      const diff = execSync('git diff --staged', { encoding: 'utf-8' });
      
      if (!diff.trim()) {
        console.log('⚠️  No staged changes found. Stage some changes first with: git add <files>');
        return;
      }

      const task: AgentTask = {
        type: 'commit-message',
        data: { diff }
      };

      const response = await this.agent.executeTask(task);
      
      if (response.success) {
        console.log('💌 Suggested Commit Message:');
        console.log('─'.repeat(50));
        console.log(response.result);
        console.log('\n💡 To use this message, run:');
        console.log(`git commit -m "${response.result.split('\n')[0]}"`);
      } else {
        console.error('❌ Commit message generation failed:', response.error);
      }
    } catch (error) {
      console.error('❌ Failed to get git diff:', error);
    }
  }

  private async reviewPR(args: string[]) {
    const prNumber = args[0];
    if (!prNumber) {
      console.error('❌ Please provide a PR number or use current branch changes');
      return;
    }

    console.log(`📋 Reviewing PR #${prNumber}...\n`);

    try {
      // For now, we'll use git diff to simulate PR review
      const diff = execSync('git diff HEAD~1', { encoding: 'utf-8' });
      const title = `PR #${prNumber}`;
      const description = 'Auto-generated review from git diff';

      const task: AgentTask = {
        type: 'pr-review',
        data: { title, description, diff }
      };

      const response = await this.agent.executeTask(task);
      
      if (response.success) {
        console.log('📊 Pull Request Review:');
        console.log('─'.repeat(50));
        console.log(response.result);
      } else {
        console.error('❌ PR review failed:', response.error);
      }
    } catch (error) {
      console.error('❌ Failed to get git diff:', error);
    }
  }

  private async askQuestion(args: string[]) {
    const question = args.join(' ');
    if (!question) {
      console.error('❌ Please provide a question');
      return;
    }

    console.log(`🤔 Asking Kimi AI: "${question}"\n`);

    // Get current project context
    let context = '';
    try {
      const packageJson = fs.readFileSync('package.json', 'utf-8');
      const parsed = JSON.parse(packageJson);
      context = `Project: ${parsed.name || 'Unknown'}\nDescription: ${parsed.description || 'No description'}`;
      
      const files = fs.readdirSync('.').filter(f => 
        f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.json') || f.endsWith('.md')
      ).slice(0, 10);
      context += `\nKey files: ${files.join(', ')}`;
    } catch (e) {
      context = 'No project context available';
    }

    const task: AgentTask = {
      type: 'general-assistance',
      data: { query: question },
      context
    };

    const response = await this.agent.executeTask(task);
    
    if (response.success) {
      console.log('🎯 Kimi AI Response:');
      console.log('─'.repeat(50));
      console.log(response.result);
    } else {
      console.error('❌ Question failed:', response.error);
    }
  }

  private detectLanguage(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const langMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.py': 'python',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c',
      '.cs': 'csharp',
      '.php': 'php',
      '.rb': 'ruby',
      '.go': 'go',
      '.rs': 'rust',
      '.sql': 'sql',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.json': 'json'
    };
    return langMap[ext] || 'text';
  }

  private showHelp() {
    console.log(`
🤖 Kimi AI GitHub Agent CLI

Usage: kimi-agent <command> [options]

Commands:
  analyze <file>     Analyze code file for issues and improvements
  debug <error>      Debug an error message with context
  commit             Generate commit message from staged changes
  review [pr-num]    Review pull request or current changes
  ask <question>     Ask Kimi AI any development question
  help               Show this help message

Examples:
  kimi-agent analyze src/app.ts
  kimi-agent debug "TypeError: Cannot read property"
  kimi-agent commit
  kimi-agent review 123
  kimi-agent ask "How do I optimize this React component?"

Powered by Kimi K2 - Advanced AI for coding and reasoning
    `);
  }
}

// Run the CLI
if (require.main === module) {
  const cli = new GitHubAgentCLI();
  cli.run().catch(console.error);
}

export default GitHubAgentCLI;
