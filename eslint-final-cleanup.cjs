#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Enhanced patterns for remaining ESLint issues
const CLEANUP_PATTERNS = [
  // Remove unused imports from lucide-react and other icon libraries
  {
    name: 'Remove unused icon imports',
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"`]lucide-react['"`];?/g,
    fix: (content) => {
      return content.replace(
        /import\s*{\s*([^}]+)\s*}\s*from\s*['"`]lucide-react['"`];?/g,
        (match, imports) => {
          // Find all icon usages in the file
          const usedIcons = [];
          const importList = imports.split(',').map(i => i.trim());
          
          importList.forEach(icon => {
            const iconRegex = new RegExp(`\\b${icon}\\b(?!\\s*[,:])`, 'g');
            const matches = content.match(iconRegex);
            if (matches && matches.length > 1) { // More than just the import
              usedIcons.push(icon);
            }
          });
          
          if (usedIcons.length === 0) {
            return ''; // Remove entire import if no icons used
          } else if (usedIcons.length < importList.length) {
            return `import { ${usedIcons.join(', ')} } from 'lucide-react';`;
          }
          return match; // Keep as-is if all icons are used
        }
      );
    }
  },
  
  // Remove unused React imports
  {
    name: 'Clean unused React imports',
    pattern: /import\s+React,?\s*{\s*([^}]+)\s*}\s*from\s*['"`]react['"`];?/g,
    fix: (content) => {
      return content.replace(
        /import\s+React,?\s*{\s*([^}]+)\s*}\s*from\s*['"`]react['"`];?/g,
        (match, hooks) => {
          const usedHooks = [];
          const hookList = hooks.split(',').map(h => h.trim());
          
          hookList.forEach(hook => {
            const hookRegex = new RegExp(`\\b${hook}\\b(?!\\s*[,:])`, 'g');
            const matches = content.match(hookRegex);
            if (matches && matches.length > 1) {
              usedHooks.push(hook);
            }
          });
          
          // Check if React is used
          const reactUsed = /\bReact\.\w+|\bReact\s*\</.test(content);
          
          if (usedHooks.length === 0 && !reactUsed) {
            return '';
          } else if (usedHooks.length === 0 && reactUsed) {
            return "import React from 'react';";
          } else if (!reactUsed && usedHooks.length > 0) {
            return `import { ${usedHooks.join(', ')} } from 'react';`;
          } else {
            return `import React, { ${usedHooks.join(', ')} } from 'react';`;
          }
        }
      );
    }
  },
  
  // Fix explicit any types with better types
  {
    name: 'Replace explicit any with proper types',
    pattern: /:\s*any\b/g,
    fix: (content) => {
      return content
        .replace(/:\s*any\[\]/g, ': unknown[]')
        .replace(/:\s*any(?=\s*[,;=)])/g, ': unknown')
        .replace(/as\s+any\b/g, 'as unknown')
        .replace(/\(.*?\)\s*:\s*any\s*=>/g, (match) => {
          return match.replace(': any', ': unknown');
        });
    }
  },
  
  // Remove unused variables and parameters
  {
    name: 'Remove unused variables',
    pattern: /(?:const|let|var)\s+(\w+)\s*(?::\s*[^=]+)?\s*=\s*[^;,\n]+[;,]?/g,
    fix: (content) => {
      const lines = content.split('\n');
      const usedLines = [];
      
      lines.forEach(line => {
        // Check for unused variable declarations
        const varMatch = line.match(/(?:const|let|var)\s+(\w+)\s*(?::\s*[^=]+)?\s*=/);
        if (varMatch) {
          const varName = varMatch[1];
          // Check if variable is used elsewhere in the file
          const varRegex = new RegExp(`\\b${varName}\\b(?!\\s*(?::|=))`, 'g');
          const usages = content.match(varRegex);
          
          if (usages && usages.length > 1) {
            usedLines.push(line);
          } else if (varName.startsWith('_')) {
            // Keep variables prefixed with underscore (intentionally unused)
            usedLines.push(line);
          }
          // Skip unused variables
        } else {
          usedLines.push(line);
        }
      });
      
      return usedLines.join('\n');
    }
  },
  
  // Fix prefer-const issues
  {
    name: 'Convert let to const where appropriate',
    pattern: /\blet\s+(\w+)(?:\s*:\s*[^=]+)?\s*=\s*([^;,\n]+)/g,
    fix: (content) => {
      return content.replace(
        /\blet\s+(\w+)(?:\s*:\s*[^=]+)?\s*=\s*([^;,\n]+)/g,
        (match, varName, value) => {
          // Check if variable is reassigned
          const reassignRegex = new RegExp(`\\b${varName}\\s*=\\s*[^=]`, 'g');
          const reassignments = content.match(reassignRegex);
          
          if (!reassignments || reassignments.length <= 1) {
            return match.replace(/\blet\b/, 'const');
          }
          return match;
        }
      );
    }
  }
];

// Helper function to get all TypeScript/TSX files
function getAllTSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      getAllTSFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main cleanup function
function cleanupFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let changesApplied = [];
    
    // Apply each cleanup pattern
    CLEANUP_PATTERNS.forEach(pattern => {
      const beforeLength = content.length;
      content = pattern.fix(content);
      const afterLength = content.length;
      
      if (beforeLength !== afterLength) {
        changesApplied.push(pattern.name);
      }
    });
    
    // Only write if there were changes
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return {
        success: true,
        changes: changesApplied,
        sizeDiff: content.length - originalContent.length
      };
    }
    
    return { success: true, changes: [], sizeDiff: 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Main execution
function main() {
  console.log('🚀 Starting comprehensive ESLint cleanup...\n');
  
  const rootDir = process.cwd();
  const tsFiles = getAllTSFiles(rootDir);
  
  // Filter out files that might cause issues
  const filesToProcess = tsFiles.filter(file => 
    !file.includes('node_modules') &&
    !file.includes('.d.ts') &&
    !file.includes('vite-env.d.ts') &&
    !file.endsWith('.config.ts') &&
    !file.endsWith('.config.js')
  );
  
  console.log(`Found ${filesToProcess.length} TypeScript files to process`);
  
  let processed = 0;
  let fixed = 0;
  let errors = 0;
  const results = [];
  
  filesToProcess.forEach((file, index) => {
    const relativePath = path.relative(rootDir, file);
    process.stdout.write(`\r🔧 Processing: ${relativePath} (${index + 1}/${filesToProcess.length})`);
    
    const result = cleanupFile(file);
    processed++;
    
    if (result.success) {
      if (result.changes.length > 0) {
        fixed++;
        results.push({
          file: relativePath,
          changes: result.changes,
          sizeDiff: result.sizeDiff
        });
      }
    } else {
      errors++;
      console.error(`\n❌ Error processing ${relativePath}: ${result.error}`);
    }
  });
  
  console.log(`\n\n✅ ESLint cleanup completed!`);
  console.log(`📊 Summary:`);
  console.log(`   • Files processed: ${processed}`);
  console.log(`   • Files fixed: ${fixed}`);
  console.log(`   • Errors: ${errors}`);
  console.log(`   • Success rate: ${((fixed / processed) * 100).toFixed(1)}%`);
  
  if (results.length > 0) {
    console.log(`\n🔧 Files with changes:`);
    results.slice(0, 10).forEach(result => {
      console.log(`   • ${result.file}: ${result.changes.join(', ')}`);
    });
    
    if (results.length > 10) {
      console.log(`   ... and ${results.length - 10} more files`);
    }
  }
  
  console.log('\n🎯 Next step: Run "npm run lint" to verify remaining issues');
}

if (require.main === module) {
  main();
}

module.exports = { cleanupFile, getAllTSFiles, CLEANUP_PATTERNS };
