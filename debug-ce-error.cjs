#!/usr/bin/env node

/**
 * Runtime Error Detector - Scan for common JavaScript/React runtime issues
 */

const fs = require('fs');
const path = require('path');

function findPotentialRuntimeIssues() {
  const issues = [];
  
  function scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      // Check for common patterns that cause ReferenceError
      const patterns = [
        {
          regex: /\b[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/g,
          description: 'Function calls',
          filter: (match) => {
            const funcName = match.replace(/\s*\($/, '');
            // Check if it's a potential undefined variable
            return funcName === 'ce' || funcName.endsWith('ce');
          }
        },
        {
          regex: /<[a-zA-Z_$][a-zA-Z0-9_$]*[\s/>]/g,
          description: 'JSX components',
          filter: (match) => {
            const compName = match.replace(/[<\s/>]/g, '');
            return compName === 'ce' || compName.toLowerCase().includes('ce');
          }
        },
        {
          regex: /const\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/g,
          description: 'Variable declarations',
          filter: (match) => match.includes('ce')
        },
        {
          regex: /\b[a-zA-Z_$][a-zA-Z0-9_$]*\s*\.\s*[a-zA-Z_$][a-zA-Z0-9_$]*/g,
          description: 'Property access',
          filter: (match) => match.startsWith('ce.')
        }
      ];
      
      patterns.forEach(({ regex, description, filter }) => {
        const matches = content.match(regex) || [];
        matches.forEach(match => {
          if (filter(match)) {
            const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length;
            issues.push({
              file: relativePath,
              line: lineNumber,
              match: match.trim(),
              description,
              context: content.split('\n')[lineNumber - 1]?.trim()
            });
          }
        });
      });
      
    } catch (err) {
      // Skip files we can't read
    }
  }
  
  function scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !['node_modules', 'dist', '.git'].includes(item)) {
          scanDirectory(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.jsx') || item.endsWith('.js')) {
          scanFile(fullPath);
        }
      });
    } catch (err) {
      // Skip directories we can't read
    }
  }
  
  console.log('🔍 Scanning for potential "ce" reference issues...');
  scanDirectory(path.join(process.cwd(), 'src'));
  
  if (issues.length === 0) {
    console.log('✅ No obvious "ce" reference issues found in source files');
    console.log('\n💡 The ReferenceError might be occurring at runtime. Try:');
    console.log('   1. Open browser dev tools (F12)');
    console.log('   2. Check the Console tab for error messages');
    console.log('   3. Look for stack traces that mention "ce"');
    console.log('   4. Check the Network tab for failed imports');
  } else {
    console.log(`⚠️  Found ${issues.length} potential issues:`);
    issues.forEach((issue, index) => {
      console.log(`\n${index + 1}. ${issue.file}:${issue.line}`);
      console.log(`   Pattern: ${issue.match}`);
      console.log(`   Type: ${issue.description}`);
      console.log(`   Context: ${issue.context}`);
    });
  }
}

findPotentialRuntimeIssues();
