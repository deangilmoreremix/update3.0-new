#!/usr/bin/env node

/**
 * Comprehensive lint fixing strategy for remaining ESLint problems
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function runLintAnalysis() {
  console.log('🔍 Analyzing remaining lint problems...\n');
  
  try {
    // Run ESLint with JSON output to get detailed problem information
    const result = execSync('npx eslint . --format=json', { encoding: 'utf8' });
    const lintResults = JSON.parse(result);
    
    let totalProblems = 0;
    let errorCount = 0;
    let warningCount = 0;
    
    const problemsByType = {};
    const problemsByFile = {};
    
    lintResults.forEach(file => {
      if (file.messages.length > 0) {
        problemsByFile[file.filePath] = file.messages.length;
        totalProblems += file.messages.length;
        
        file.messages.forEach(message => {
          if (message.severity === 2) errorCount++;
          if (message.severity === 1) warningCount++;
          
          const ruleId = message.ruleId || 'unknown';
          problemsByType[ruleId] = (problemsByType[ruleId] || 0) + 1;
        });
      }
    });
    
    console.log(`📊 LINT ANALYSIS RESULTS:`);
    console.log(`   Total Problems: ${totalProblems}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Warnings: ${warningCount}\n`);
    
    console.log(`🔝 TOP PROBLEM TYPES:`);
    const sortedProblems = Object.entries(problemsByType)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    sortedProblems.forEach(([rule, count]) => {
      console.log(`   ${rule}: ${count} issues`);
    });
    
    console.log(`\n📁 FILES WITH MOST PROBLEMS:`);
    const sortedFiles = Object.entries(problemsByFile)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    sortedFiles.forEach(([file, count]) => {
      const relativePath = path.relative(process.cwd(), file);
      console.log(`   ${relativePath}: ${count} issues`);
    });
    
    return { totalProblems, errorCount, warningCount, problemsByType, problemsByFile };
    
  } catch (error) {
    console.log('ℹ️  No lint problems found or ESLint not configured properly');
    return { totalProblems: 0, errorCount: 0, warningCount: 0 };
  }
}

function generateFixStrategy(analysis) {
  console.log(`\n🔧 RECOMMENDED FIX STRATEGY:\n`);
  
  const { problemsByType, totalProblems } = analysis;
  
  if (totalProblems === 0) {
    console.log('✅ No lint problems detected! Your codebase is clean.');
    return;
  }
  
  console.log(`📋 PRIORITY ORDER (fix these first):\n`);
  
  // Define fix strategies for common rules
  const fixStrategies = {
    '@typescript-eslint/no-unused-vars': {
      priority: 1,
      description: 'Remove unused variables and imports',
      autoFixable: true,
      command: 'npx eslint . --fix --ext .ts,.tsx'
    },
    '@typescript-eslint/no-explicit-any': {
      priority: 2, 
      description: 'Replace any types with specific types',
      autoFixable: false,
      manual: true
    },
    'react-hooks/exhaustive-deps': {
      priority: 3,
      description: 'Fix React Hook dependency arrays',
      autoFixable: false,
      manual: true
    },
    '@typescript-eslint/ban-ts-comment': {
      priority: 4,
      description: 'Replace @ts-ignore with @ts-expect-error',
      autoFixable: true,
      command: 'Find and replace @ts-ignore with @ts-expect-error'
    },
    'no-prototype-builtins': {
      priority: 5,
      description: 'Fix Object.prototype method calls',
      autoFixable: true,
      command: 'Replace obj.hasOwnProperty(key) with Object.hasOwnProperty.call(obj, key)'
    }
  };
  
  const sortedProblems = Object.entries(problemsByType)
    .sort(([,a], [,b]) => b - a);
  
  sortedProblems.forEach(([rule, count], index) => {
    const strategy = fixStrategies[rule];
    const priority = strategy?.priority || 99;
    
    console.log(`${index + 1}. ${rule} (${count} issues)`);
    if (strategy) {
      console.log(`   📋 ${strategy.description}`);
      if (strategy.autoFixable) {
        console.log(`   🤖 Auto-fixable: ${strategy.command || 'Yes'}`);
      } else {
        console.log(`   ✋ Manual fix required`);
      }
    } else {
      console.log(`   ℹ️  Check ESLint documentation for fix guidance`);
    }
    console.log('');
  });
}

function createAutofixScript(analysis) {
  const autofixCommands = [
    '#!/bin/bash',
    '',
    '# Automated lint fixes',
    'echo "🔧 Running automated ESLint fixes..."',
    '',
    '# 1. Auto-fix what ESLint can fix automatically',
    'npx eslint . --fix --ext .ts,.tsx',
    '',
    '# 2. Fix unused imports specifically',
    'npx eslint . --fix --ext .ts,.tsx --rule "no-unused-vars: error"',
    '',
    '# 3. Format code after fixes',
    'echo "✨ Formatting code..."',
    'npx prettier --write "src/**/*.{ts,tsx}"',
    '',
    'echo "✅ Automated fixes complete!"',
    'echo "Run: npm run lint to see remaining issues"'
  ];
  
  fs.writeFileSync('autofix-lint.sh', autofixCommands.join('\n'), 'utf8');
  fs.chmodSync('autofix-lint.sh', '755');
  
  console.log(`\n📝 Created autofix-lint.sh script`);
  console.log(`   Run: ./autofix-lint.sh to apply automated fixes`);
}

// Run analysis
const analysis = runLintAnalysis();
generateFixStrategy(analysis);
createAutofixScript(analysis);

console.log(`\n🎯 NEXT STEPS:`);
console.log(`   1. Run: ./autofix-lint.sh (for auto-fixable issues)`);
console.log(`   2. Manually fix remaining type and logic issues`);
console.log(`   3. Run: npm run lint to verify fixes`);
console.log(`   4. Commit changes when clean`);
