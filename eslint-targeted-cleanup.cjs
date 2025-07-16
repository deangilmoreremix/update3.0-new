#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Targeted patterns for the most common remaining ESLint issues
const TARGETED_PATTERNS = [
  // 1. Remove unused lucide-react imports (highest frequency issue)
  {
    name: 'Remove unused lucide-react imports',
    test: (content) => /import\s*{\s*([^}]+)\s*}\s*from\s*['"`]lucide-react['"`]/.test(content),
    fix: (content) => {
      return content.replace(
        /import\s*{\s*([^}]+)\s*}\s*from\s*['"`]lucide-react['"`];?\n?/g,
        (match, imports) => {
          const usedIcons = [];
          const importList = imports.split(',').map(i => i.trim());
          
          importList.forEach(icon => {
            // Check if icon is used in JSX or as a component
            const usagePatterns = [
              new RegExp(`<${icon}\\s*[^>]*/?>`), // JSX usage like <Icon />
              new RegExp(`\\b${icon}\\s*\\(`), // Function call like Icon()
              new RegExp(`\\b${icon}\\s*\\.`), // Property access like Icon.something
              new RegExp(`\\{\\s*${icon}\\s*\\}`), // Object destructuring usage
              new RegExp(`\\b${icon}\\s*:`), // Object property like { Icon: ... }
            ];
            
            const isUsed = usagePatterns.some(pattern => pattern.test(content));
            if (isUsed) {
              usedIcons.push(icon);
            }
          });
          
          if (usedIcons.length === 0) {
            return ''; // Remove entire import line
          } else if (usedIcons.length < importList.length) {
            return `import { ${usedIcons.join(', ')} } from 'lucide-react';\n`;
          }
          return match; // Keep as-is if all icons are used
        }
      );
    }
  },

  // 2. Fix explicit any types (second most common)
  {
    name: 'Replace explicit any types',
    test: (content) => /:\s*any\b/.test(content) && !content.includes('// eslint-disable'),
    fix: (content) => {
      return content
        // Function parameters and return types
        .replace(/(\w+):\s*any(?=\s*[,)])/g, '$1: unknown')
        // Variable declarations
        .replace(/:\s*any(?=\s*[=;])/g, ': unknown')
        // Array types
        .replace(/:\s*any\[\]/g, ': unknown[]')
        // Type assertions
        .replace(/as\s+any\b/g, 'as unknown')
        // Generic constraints that are safe to change
        .replace(/<([^>]*?):\s*any>/g, '<$1: unknown>');
    }
  },

  // 3. Fix React hooks dependency arrays (specific cases)
  {
    name: 'Fix missing useEffect dependencies',
    test: (content) => /useEffect\s*\(\s*\(\s*\)\s*=>\s*{[\s\S]*?}\s*,\s*\[\s*\]\s*\)/.test(content),
    fix: (content) => {
      // Only fix simple cases where we can clearly identify the missing dependency
      return content.replace(
        /useEffect\s*\(\s*\(\s*\)\s*=>\s*{\s*(\w+)\(\);?\s*}\s*,\s*\[\s*\]\s*\)/g,
        (match, functionName) => {
          // If it's a simple function call, add it to dependencies
          return match.replace('[]', `[${functionName}]`);
        }
      );
    }
  },

  // 4. Remove unused imports from other common libraries
  {
    name: 'Remove unused React imports',
    test: (content) => /import\s*{\s*([^}]+)\s*}\s*from\s*['"`]react['"`]/.test(content),
    fix: (content) => {
      return content.replace(
        /import\s*{\s*([^}]+)\s*}\s*from\s*['"`]react['"`];?\n?/g,
        (match, imports) => {
          const usedHooks = [];
          const importList = imports.split(',').map(h => h.trim());
          
          importList.forEach(hook => {
            const hookRegex = new RegExp(`\\b${hook}\\b`, 'g');
            const matches = content.match(hookRegex);
            // If hook appears more than once (import + usage), it's used
            if (matches && matches.length > 1) {
              usedHooks.push(hook);
            }
          });
          
          if (usedHooks.length === 0) {
            return ''; // Remove entire import
          } else if (usedHooks.length < importList.length) {
            return `import { ${usedHooks.join(', ')} } from 'react';\n`;
          }
          return match;
        }
      );
    }
  },

  // 5. Convert let to const (safe cases)
  {
    name: 'Convert let to const (safe cases)',
    test: (content) => /\blet\s+\w+\s*=\s*(?:true|false|\d+|'[^']*'|"[^"]*"|`[^`]*`)/.test(content),
    fix: (content) => {
      // Only convert simple literal assignments that are clearly not reassigned
      return content.replace(
        /\blet\s+(\w+)\s*=\s*(true|false|\d+|'[^']*'|"[^"]*"|`[^`]*`)/g,
        (match, varName, value) => {
          // Check if variable is reassigned anywhere
          const reassignRegex = new RegExp(`\\b${varName}\\s*=\\s*[^=]`, 'g');
          const matches = content.match(reassignRegex);
          
          // If only one assignment (the declaration), convert to const
          if (!matches || matches.length === 1) {
            return `const ${varName} = ${value}`;
          }
          return match;
        }
      );
    }
  }
];

// Get files with specific ESLint issues
function getFilesWithIssues() {
  const { exec } = require('child_process');
  return new Promise((resolve) => {
    exec('npm run lint 2>&1', (error, stdout) => {
      const lines = stdout.split('\n');
      const filesWithIssues = new Set();
      
      lines.forEach(line => {
        if (line.includes('no-unused-vars') || 
            line.includes('no-explicit-any') || 
            line.includes('exhaustive-deps') ||
            line.includes('prefer-const')) {
          const match = line.match(/^(.+?):(\d+):/);
          if (match) {
            const filePath = match[1];
            if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
              filesWithIssues.add(filePath);
            }
          }
        }
      });
      
      resolve(Array.from(filesWithIssues));
    });
  });
}

// Apply targeted fixes to a file
function applyTargetedFixes(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const appliedFixes = [];
    
    TARGETED_PATTERNS.forEach(pattern => {
      if (pattern.test(content)) {
        const beforeContent = content;
        content = pattern.fix(content);
        
        if (content !== beforeContent) {
          appliedFixes.push(pattern.name);
        }
      }
    });
    
    // Only write if there were changes
    if (content !== originalContent && content.trim().length > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      return {
        success: true,
        fixes: appliedFixes,
        linesChanged: originalContent.split('\n').length - content.split('\n').length
      };
    }
    
    return { success: true, fixes: [], linesChanged: 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Main execution
async function main() {
  console.log('🎯 Starting targeted ESLint cleanup...\n');
  
  console.log('📊 Finding files with specific ESLint issues...');
  const filesWithIssues = await getFilesWithIssues();
  
  console.log(`Found ${filesWithIssues.length} files with targeted issues\n`);
  
  let processed = 0;
  let fixed = 0;
  let totalLinesRemoved = 0;
  const results = [];
  
  for (const filePath of filesWithIssues) {
    const relativePath = path.relative(process.cwd(), filePath);
    process.stdout.write(`\r🔧 Processing: ${relativePath} (${processed + 1}/${filesWithIssues.length})`);
    
    const result = applyTargetedFixes(filePath);
    processed++;
    
    if (result.success) {
      if (result.fixes.length > 0) {
        fixed++;
        totalLinesRemoved += Math.abs(result.linesChanged);
        results.push({
          file: relativePath,
          fixes: result.fixes,
          linesChanged: result.linesChanged
        });
      }
    } else {
      console.error(`\n❌ Error processing ${relativePath}: ${result.error}`);
    }
  }
  
  console.log(`\n\n✅ Targeted ESLint cleanup completed!`);
  console.log(`📊 Results:`);
  console.log(`   • Files processed: ${processed}`);
  console.log(`   • Files fixed: ${fixed}`);
  console.log(`   • Success rate: ${((fixed / processed) * 100).toFixed(1)}%`);
  console.log(`   • Lines cleaned: ${totalLinesRemoved}`);
  
  if (results.length > 0) {
    console.log(`\n🔧 Top fixes applied:`);
    const fixCounts = {};
    results.forEach(result => {
      result.fixes.forEach(fix => {
        fixCounts[fix] = (fixCounts[fix] || 0) + 1;
      });
    });
    
    Object.entries(fixCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([fix, count]) => {
        console.log(`   • ${fix}: ${count} files`);
      });
    
    console.log(`\n📁 Sample fixed files:`);
    results.slice(0, 8).forEach(result => {
      console.log(`   • ${result.file}: ${result.fixes.join(', ')}`);
    });
  }
  
  console.log('\n🎯 Running quick verification...');
  
  // Quick verification
  const { exec } = require('child_process');
  exec('npm run build 2>&1 | head -5', (error, stdout) => {
    if (stdout.includes('built successfully')) {
      console.log('✅ Build still successful after cleanup!');
    } else if (error) {
      console.log('⚠️  Please run "npm run build" to verify changes');
    }
  });
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { applyTargetedFixes, TARGETED_PATTERNS };
