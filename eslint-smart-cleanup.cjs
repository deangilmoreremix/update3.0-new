#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get files with specific issues from ESLint output
function getFilesWithSpecificIssues() {
  try {
    const lintOutput = execSync('npm run lint 2>&1', { encoding: 'utf8' });
    const lines = lintOutput.split('\n');
    
    const fileIssues = new Map();
    let currentFile = null;
    
    lines.forEach(line => {
      // Check if line is a file path
      if (line.match(/^\/.*\.(tsx?|jsx?)$/)) {
        currentFile = line.trim();
        fileIssues.set(currentFile, []);
      }
      // Check if line contains ESLint errors we can fix
      else if (currentFile && line.includes('error')) {
        if (line.includes('is defined but never used') && line.includes('@typescript-eslint/no-unused-vars')) {
          fileIssues.get(currentFile).push('unused-vars');
        }
        if (line.includes('Unexpected any') && line.includes('@typescript-eslint/no-explicit-any')) {
          fileIssues.get(currentFile).push('explicit-any');
        }
      }
      else if (currentFile && line.includes('warning') && line.includes('react-hooks/exhaustive-deps')) {
        fileIssues.get(currentFile).push('missing-deps');
      }
    });
    
    // Filter to files that have issues we can fix
    const result = [];
    fileIssues.forEach((issues, filePath) => {
      if (issues.length > 0) {
        result.push({ filePath, issues });
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error getting lint output:', error.message);
    return [];
  }
}

// Fix unused lucide-react imports
function fixUnusedLucideImports(content) {
  return content.replace(
    /import\s*{\s*([^}]+)\s*}\s*from\s*['"`]lucide-react['"`];?\n?/g,
    (match, imports) => {
      const importList = imports.split(',').map(i => i.trim());
      const usedImports = [];
      
      importList.forEach(importName => {
        // Check if the import is used as a JSX component
        const jsxPattern = new RegExp(`<${importName}\\s*[^>]*/?>`);
        const propPattern = new RegExp(`\\b${importName}\\b(?=\\s*[=:])`);
        const objectPattern = new RegExp(`{[^}]*\\b${importName}\\b[^}]*}`);
        
        if (jsxPattern.test(content) || propPattern.test(content) || objectPattern.test(content)) {
          usedImports.push(importName);
        }
      });
      
      if (usedImports.length === 0) {
        return ''; // Remove the entire import
      } else if (usedImports.length < importList.length) {
        return `import { ${usedImports.join(', ')} } from 'lucide-react';\n`;
      }
      return match; // Keep unchanged if all are used
    }
  );
}

// Fix explicit any types (conservative approach)
function fixExplicitAny(content) {
  return content
    .replace(/:\s*any\[\]/g, ': unknown[]')
    .replace(/:\s*any(?=\s*[=;,)])/g, ': unknown')
    .replace(/as\s+any\b/g, 'as unknown');
}

// Fix simple unused imports from other libraries
function fixUnusedImports(content) {
  // Fix unused react-router-dom imports
  content = content.replace(
    /import\s*{\s*([^}]+)\s*}\s*from\s*['"`]react-router-dom['"`];?\n?/g,
    (match, imports) => {
      const importList = imports.split(',').map(i => i.trim());
      const usedImports = [];
      
      importList.forEach(importName => {
        const usageRegex = new RegExp(`\\b${importName}\\b`, 'g');
        const matches = content.match(usageRegex) || [];
        if (matches.length > 1) { // More than just the import declaration
          usedImports.push(importName);
        }
      });
      
      if (usedImports.length === 0) {
        return '';
      } else if (usedImports.length < importList.length) {
        return `import { ${usedImports.join(', ')} } from 'react-router-dom';\n`;
      }
      return match;
    }
  );
  
  return content;
}

// Apply fixes to a single file
function fixFile(filePath, issues) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const appliedFixes = [];
    
    if (issues.includes('unused-vars')) {
      const beforeContent = content;
      content = fixUnusedLucideImports(content);
      content = fixUnusedImports(content);
      if (content !== beforeContent) {
        appliedFixes.push('Removed unused imports');
      }
    }
    
    if (issues.includes('explicit-any')) {
      const beforeContent = content;
      content = fixExplicitAny(content);
      if (content !== beforeContent) {
        appliedFixes.push('Fixed explicit any types');
      }
    }
    
    // Write back if changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { success: true, fixes: appliedFixes };
    }
    
    return { success: true, fixes: [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Main execution
function main() {
  console.log('🎯 Running targeted ESLint cleanup...\n');
  
  const filesWithIssues = getFilesWithSpecificIssues();
  console.log(`Found ${filesWithIssues.length} files with fixable issues\n`);
  
  if (filesWithIssues.length === 0) {
    console.log('No fixable issues found!');
    return;
  }
  
  let processed = 0;
  let fixed = 0;
  const results = [];
  
  filesWithIssues.forEach(({ filePath, issues }) => {
    const relativePath = path.relative(process.cwd(), filePath);
    process.stdout.write(`\r🔧 ${relativePath} (${processed + 1}/${filesWithIssues.length})`);
    
    const result = fixFile(filePath, issues);
    processed++;
    
    if (result.success) {
      if (result.fixes.length > 0) {
        fixed++;
        results.push({
          file: relativePath,
          fixes: result.fixes,
          originalIssues: issues
        });
      }
    } else {
      console.error(`\n❌ Error fixing ${relativePath}: ${result.error}`);
    }
  });
  
  console.log(`\n\n✅ Targeted cleanup completed!`);
  console.log(`📊 Summary:`);
  console.log(`   • Files processed: ${processed}`);
  console.log(`   • Files fixed: ${fixed}`);
  console.log(`   • Success rate: ${((fixed / processed) * 100).toFixed(1)}%`);
  
  if (results.length > 0) {
    console.log(`\n🔧 Fixed files:`);
    results.slice(0, 10).forEach(result => {
      console.log(`   • ${result.file}: ${result.fixes.join(', ')}`);
    });
    
    if (results.length > 10) {
      console.log(`   ... and ${results.length - 10} more`);
    }
  }
  
  console.log('\n🎯 Verifying build...');
  try {
    execSync('npm run build > /dev/null 2>&1');
    console.log('✅ Build successful after cleanup!');
  } catch (error) {
    console.log('⚠️  Build check failed - please verify manually');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixFile, getFilesWithSpecificIssues };
