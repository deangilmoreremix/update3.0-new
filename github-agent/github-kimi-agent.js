#!/usr/bin/env node

/**
 * GitHub Actions Workflow Integration for Kimi AI
 * Use this script in GitHub Actions to leverage Kimi AI for code analysis
 */

const { KimiAIAgent } = require('./kimi-integration');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GitHubKimiAgent {
  constructor() {
    this.kimiAgent = new KimiAIAgent(process.env.KIMI_API_KEY);
    this.githubToken = process.env.GITHUB_TOKEN;
    this.repoOwner = process.env.GITHUB_REPOSITORY_OWNER;
    this.repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
    this.prNumber = process.env.GITHUB_PR_NUMBER;
  }

  async analyzePullRequest() {
    try {
      console.log('🤖 Kimi AI: Analyzing Pull Request...');
      
      // Get PR diff
      const diff = this.getPRDiff();
      
      // Get PR description
      const prDescription = await this.getPRDescription();
      
      // Analyze with Kimi AI
      const review = await this.kimiAgent.reviewPR(diff, prDescription);
      
      // Post review as comment
      await this.postPRComment(review.choices[0].message.content);
      
      console.log('✅ Kimi AI review completed and posted');
      
    } catch (error) {
      console.error('❌ Error in Kimi AI analysis:', error);
      process.exit(1);
    }
  }

  async analyzeCommit() {
    try {
      console.log('🤖 Kimi AI: Analyzing latest commit...');
      
      // Get commit diff
      const diff = execSync('git diff HEAD~1', { encoding: 'utf8' });
      
      // Analyze with Kimi AI
      const analysis = await this.kimiAgent.analyzeCode(diff, 'diff', 'Latest commit changes');
      
      console.log('📊 Kimi AI Analysis:');
      console.log(analysis.choices[0].message.content);
      
      // Generate commit message suggestion
      const commitSuggestion = await this.kimiAgent.generateCommitMessage(diff);
      console.log('💬 Suggested commit message:');
      console.log(commitSuggestion.choices[0].message.content);
      
    } catch (error) {
      console.error('❌ Error in commit analysis:', error);
      process.exit(1);
    }
  }

  async debugErrors() {
    try {
      console.log('🔍 Kimi AI: Scanning for potential errors...');
      
      // Find JavaScript/TypeScript files
      const files = this.findCodeFiles();
      
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Simple error pattern detection
        if (this.hasErrorPatterns(content)) {
          console.log(`🚨 Analyzing potential issues in: ${file}`);
          
          const analysis = await this.kimiAgent.analyzeCode(
            content, 
            this.getFileLanguage(file),
            `Error analysis for ${file}`
          );
          
          console.log(`📋 Analysis for ${file}:`);
          console.log(analysis.choices[0].message.content);
          console.log('---');
        }
      }
      
    } catch (error) {
      console.error('❌ Error in debugging:', error);
      process.exit(1);
    }
  }

  getPRDiff() {
    try {
      return execSync(`git diff origin/main...HEAD`, { encoding: 'utf8' });
    } catch (error) {
      console.error('Failed to get PR diff:', error);
      return '';
    }
  }

  async getPRDescription() {
    // This would typically use GitHub API to get PR description
    // For now, return a placeholder
    return process.env.GITHUB_PR_DESCRIPTION || 'No description provided';
  }

  async postPRComment(comment) {
    // This would post to GitHub API
    // For now, just log it
    console.log('📝 Kimi AI Review Comment:');
    console.log('='.repeat(50));
    console.log(comment);
    console.log('='.repeat(50));
  }

  findCodeFiles() {
    const extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c'];
    const files = [];
    
    function scanDir(dir) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDir(fullPath);
        } else if (stat.isFile() && extensions.includes(path.extname(item))) {
          files.push(fullPath);
        }
      }
    }
    
    scanDir('./src');
    return files.slice(0, 10); // Limit to prevent API overuse
  }

  hasErrorPatterns(content) {
    const errorPatterns = [
      /console\.error/,
      /throw new Error/,
      /catch\s*\(/,
      /try\s*{/,
      /TODO|FIXME|BUG/i,
      /undefined|null/
    ];
    
    return errorPatterns.some(pattern => pattern.test(content));
  }

  getFileLanguage(filePath) {
    const ext = path.extname(filePath);
    const langMap = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.jsx': 'javascript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c'
    };
    return langMap[ext] || 'text';
  }
}

// CLI interface
const command = process.argv[2];
const agent = new GitHubKimiAgent();

switch (command) {
  case 'pr-review':
    agent.analyzePullRequest();
    break;
  case 'commit-analysis':
    agent.analyzeCommit();
    break;
  case 'debug-scan':
    agent.debugErrors();
    break;
  default:
    console.log(`
🤖 Kimi AI GitHub Agent

Usage:
  node github-kimi-agent.js <command>

Commands:
  pr-review        Analyze and review a pull request
  commit-analysis  Analyze the latest commit
  debug-scan       Scan code for potential errors

Environment Variables:
  KIMI_API_KEY           Your Kimi AI API key
  GITHUB_TOKEN           GitHub API token
  GITHUB_REPOSITORY      Repository name (owner/repo)
  GITHUB_PR_NUMBER       PR number (for PR reviews)
    `);
}

module.exports = { GitHubKimiAgent };
