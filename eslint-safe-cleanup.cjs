#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Safe patterns for final ESLint cleanup
const SAFE_CLEANUP_PATTERNS = [
  // Only fix clear unused imports at the start of lines
  {
    name: 'Remove clearly unused icon imports',
    fix: (content, filePath) => {
      // Only fix if we can verify the entire import line is unused
      const lines = content.split('\n');
      const modifiedLines = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for unused imports in a safe way
        const importMatch = line.match(/^import\s*{\s*([^}]+)\s*}\s*from\s*['"`]lucide-react['"`];?\s*$/);
        if (importMatch) {
          const imports = importMatch[1].split(',').map(imp => imp.trim());
          const usedImports = [];
          
          // Check each import
          imports.forEach(importName => {
            const cleanName = importName.trim();
            // Look for usage in the rest of the file (more conservative check)
            const restOfFile = lines.slice(i + 1).join('\n');
            const usageRegex = new RegExp(`\\b${cleanName}\\b(?![\\s]*[,}])`, 'g');
            const matches = restOfFile.match(usageRegex);
            
            if (matches && matches.length > 0) {
              usedImports.push(cleanName);
            }
          });
          
          if (usedImports.length === 0) {
            // Skip this line entirely
            continue;
          } else if (usedImports.length < imports.length) {
            // Rebuild the import with only used imports
            modifiedLines.push(`import { ${usedImports.join(', ')} } from 'lucide-react';`);
          } else {
            // Keep the original line
            modifiedLines.push(line);
          }
        } else {
          modifiedLines.push(line);
        }
      }
      
      return modifiedLines.join('\n');
    }
  },
  
  // Fix specific any types in safe contexts
  {
    name: 'Replace safe explicit any types',
    fix: (content) => {
      return content
        // Only replace specific patterns that are clearly safe
        .replace(/:\s*any\[\]\s*=/g, ': unknown[] =')
        .replace(/as\s+any\s*\)/g, 'as unknown)')
        .replace(/\(\s*\w+\s*:\s*any\s*\)\s*=>/g, (match) => {
          return match.replace(': any', ': unknown');
        });
    }
  },
  
  // Convert obvious let to const
  {
    name: 'Convert obvious let to const',
    fix: (content) => {
      const lines = content.split('\n');
      const modifiedLines = [];
      
      lines.forEach((line, index) => {
        const letMatch = line.match(/^(\s*)let\s+(\w+)\s*=\s*(.+);?\s*$/);
        if (letMatch) {
          const indent = letMatch[1];
          const varName = letMatch[2];
          const value = letMatch[3];
          
          // Check if this variable is reassigned in the rest of the file
          const restOfFile = lines.slice(index + 1).join('\n');
          const reassignRegex = new RegExp(`\\b${varName}\\s*=[^=]`, 'g');
          const reassignments = restOfFile.match(reassignRegex);
          
          if (!reassignments || reassignments.length === 0) {
            modifiedLines.push(`${indent}const ${varName} = ${value};`);
          } else {
            modifiedLines.push(line);
          }
        } else {
          modifiedLines.push(line);
        }
      });
      
      return modifiedLines.join('\n');
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

// Main cleanup function - much more conservative
function safeCleanupFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let changesApplied = [];
    
    // Apply each safe cleanup pattern
    SAFE_CLEANUP_PATTERNS.forEach(pattern => {
      const beforeContent = content;
      content = pattern.fix(content, filePath);
      
      if (beforeContent !== content) {
        changesApplied.push(pattern.name);
      }
    });
    
    // Only write if there were changes and the result looks valid
    if (content !== originalContent) {
      // Basic syntax check - ensure we didn't break basic structure
      const hasBasicSyntax = content.includes('export') || content.includes('function') || content.includes('const') || content.includes('interface');
      
      if (hasBasicSyntax || filePath.includes('.d.ts')) {
        fs.writeFileSync(filePath, content, 'utf8');
        return {
          success: true,
          changes: changesApplied,
          sizeDiff: content.length - originalContent.length
        };
      } else {
        // Don't save if it looks like we broke the file
        return { success: true, changes: [], sizeDiff: 0, skipped: 'safety check' };
      }
    }
    
    return { success: true, changes: [], sizeDiff: 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Main execution
function main() {
  console.log('🚀 Starting SAFE ESLint cleanup...\n');
  
  const rootDir = process.cwd();
  const tsFiles = getAllTSFiles(rootDir);
  
  // Filter to main source files only (be more selective)
  const filesToProcess = tsFiles.filter(file => 
    !file.includes('node_modules') &&
    !file.includes('.d.ts') &&
    !file.includes('vite-env.d.ts') &&
    !file.endsWith('.config.ts') &&
    !file.endsWith('.config.js') &&
    !file.includes('attached_assets') && // Skip attached assets
    !file.includes('pipeline_deals_new') && // Skip duplicates
    !file.includes('pipeline_repo') && // Skip duplicates
    (file.includes('/src/') || file.endsWith('.tsx') || file.endsWith('.ts'))
  );
  
  console.log(`Found ${filesToProcess.length} main source files to process safely`);
  
  let processed = 0;
  let fixed = 0;
  let errors = 0;
  let skipped = 0;
  const results = [];
  
  filesToProcess.forEach((file, index) => {
    const relativePath = path.relative(rootDir, file);
    process.stdout.write(`\r🔧 Processing: ${relativePath} (${index + 1}/${filesToProcess.length})`);
    
    const result = safeCleanupFile(file);
    processed++;
    
    if (result.success) {
      if (result.skipped) {
        skipped++;
      } else if (result.changes.length > 0) {
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
  
  console.log(`\n\n✅ Safe ESLint cleanup completed!`);
  console.log(`📊 Summary:`);
  console.log(`   • Files processed: ${processed}`);
  console.log(`   • Files fixed: ${fixed}`);
  console.log(`   • Files skipped for safety: ${skipped}`);
  console.log(`   • Errors: ${errors}`);
  console.log(`   • Success rate: ${(((fixed + skipped) / processed) * 100).toFixed(1)}%`);
  
  if (results.length > 0) {
    console.log(`\n🔧 Files with changes:`);
    results.slice(0, 15).forEach(result => {
      console.log(`   • ${result.file}: ${result.changes.join(', ')}`);
    });
    
    if (results.length > 15) {
      console.log(`   ... and ${results.length - 15} more files`);
    }
  }
  
  console.log('\n🎯 Next step: Run "npm run lint" to verify improvements');
}

if (require.main === module) {
  main();
}

module.exports = { safeCleanupFile, getAllTSFiles, SAFE_CLEANUP_PATTERNS };
