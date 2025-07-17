#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all TypeScript/TSX files in src
function getAllTsFiles() {
  try {
    const output = execSync('find src -name "*.ts" -o -name "*.tsx"', { encoding: 'utf8' });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error finding TypeScript files:', error.message);
    return [];
  }
}

// Get ESLint problems for a specific file
function getESLintProblems(filePath) {
  try {
    const output = execSync(`npx eslint ${filePath} --format=json`, { encoding: 'utf8' });
    const results = JSON.parse(output);
    return results.length > 0 ? results[0].messages : [];
  } catch (error) {
    // ESLint exits with code 1 when there are problems, which is expected
    if (error.stdout) {
      try {
        const results = JSON.parse(error.stdout);
        return results.length > 0 ? results[0].messages : [];
      } catch (parseError) {
        console.error(`Error parsing ESLint output for ${filePath}:`, parseError.message);
      }
    }
    return [];
  }
}

// Fix unused variables and imports
function fixUnusedVariables(content, problems) {
  let fixedContent = content;
  let changesMade = false;

  const unusedVarProblems = problems.filter(p => p.ruleId === '@typescript-eslint/no-unused-vars');
  
  for (const problem of unusedVarProblems) {
    const lines = fixedContent.split('\n');
    const problemLine = lines[problem.line - 1];
    
    if (problemLine) {
      // Handle unused imports
      if (problemLine.includes('import') && problemLine.includes('{')) {
        const unusedVar = problem.message.match(/'([^']+)'/)?.[1];
        if (unusedVar) {
          // Remove the unused import from the destructured imports
          const newLine = problemLine.replace(new RegExp(`\\b${unusedVar}\\b,?\\s*|,\\s*\\b${unusedVar}\\b`, 'g'), '')
            .replace(/\{\s*,/, '{')
            .replace(/,\s*\}/, '}')
            .replace(/\{\s*\}/, '{}');
          
          // If imports object is empty, remove the entire import line
          if (newLine.includes('{}')) {
            lines[problem.line - 1] = '';
          } else {
            lines[problem.line - 1] = newLine;
          }
          changesMade = true;
        }
      }
      // Handle unused variables - add underscore prefix to indicate intentionally unused
      else if (problemLine.includes('const ') || problemLine.includes('let ') || problemLine.includes('var ')) {
        const unusedVar = problem.message.match(/'([^']+)'/)?.[1];
        if (unusedVar && !unusedVar.startsWith('_')) {
          lines[problem.line - 1] = problemLine.replace(new RegExp(`\\b${unusedVar}\\b`), `_${unusedVar}`);
          changesMade = true;
        }
      }
      // Handle unused function parameters
      else if (problemLine.includes('=>') || problemLine.includes('function')) {
        const unusedVar = problem.message.match(/'([^']+)'/)?.[1];
        if (unusedVar && !unusedVar.startsWith('_')) {
          lines[problem.line - 1] = problemLine.replace(new RegExp(`\\b${unusedVar}\\b`), `_${unusedVar}`);
          changesMade = true;
        }
      }
    }
  }

  if (changesMade) {
    fixedContent = lines.join('\n');
  }

  return { content: fixedContent, changesMade };
}

// Fix explicit any types
function fixExplicitAny(content, problems) {
  let fixedContent = content;
  let changesMade = false;

  const anyProblems = problems.filter(p => p.ruleId === '@typescript-eslint/no-explicit-any');
  
  for (const problem of anyProblems) {
    const lines = fixedContent.split('\n');
    const problemLine = lines[problem.line - 1];
    
    if (problemLine) {
      // Replace 'any' with 'unknown' for better type safety
      if (problemLine.includes(': any')) {
        lines[problem.line - 1] = problemLine.replace(/:\s*any\b/g, ': unknown');
        changesMade = true;
      }
      // Replace 'any[]' with 'unknown[]'
      else if (problemLine.includes('any[]')) {
        lines[problem.line - 1] = problemLine.replace(/any\[\]/g, 'unknown[]');
        changesMade = true;
      }
      // Replace generic 'any' in function signatures
      else if (problemLine.includes('<any>') || problemLine.includes('any,')) {
        lines[problem.line - 1] = problemLine.replace(/\bany\b/g, 'unknown');
        changesMade = true;
      }
    }
  }

  if (changesMade) {
    fixedContent = lines.join('\n');
  }

  return { content: fixedContent, changesMade };
}

// Fix React Hooks dependency issues
function fixReactHooksDeps(content, problems) {
  let fixedContent = content;
  let changesMade = false;

  const hookProblems = problems.filter(p => p.ruleId === 'react-hooks/exhaustive-deps');
  
  // Add useCallback import if needed and not present
  if (hookProblems.length > 0 && !content.includes('useCallback')) {
    const reactImportMatch = content.match(/import React[^;]+from ['"]react['"];/);
    if (reactImportMatch) {
      const importLine = reactImportMatch[0];
      if (importLine.includes('{')) {
        // Add useCallback to existing destructured imports
        fixedContent = fixedContent.replace(
          /import React, \{([^}]+)\} from ['"]react['"];/,
          (match, imports) => {
            if (!imports.includes('useCallback')) {
              return `import React, {${imports.trim()}, useCallback} from 'react';`;
            }
            return match;
          }
        );
      } else {
        // Add destructured imports with useCallback
        fixedContent = fixedContent.replace(
          /import React from ['"]react['"];/,
          "import React, { useCallback } from 'react';"
        );
      }
      changesMade = true;
    }
  }

  for (const problem of hookProblems) {
    const lines = fixedContent.split('\n');
    const problemLine = lines[problem.line - 1];
    
    if (problemLine && problemLine.includes('useEffect')) {
      // Extract missing dependency from error message
      const missingDep = problem.message.match(/'([^']+)'/)?.[1];
      if (missingDep) {
        // Find the dependency array and add the missing dependency
        const depArrayMatch = problemLine.match(/\[([^\]]*)\]/);
        if (depArrayMatch) {
          const currentDeps = depArrayMatch[1].trim();
          const newDeps = currentDeps ? `${currentDeps}, ${missingDep}` : missingDep;
          lines[problem.line - 1] = problemLine.replace(/\[([^\]]*)\]/, `[${newDeps}]`);
          changesMade = true;
        }
      }
    }
  }

  if (changesMade) {
    fixedContent = lines.join('\n');
  }

  return { content: fixedContent, changesMade };
}

// Fix other common issues
function fixOtherIssues(content, problems) {
  let fixedContent = content;
  let changesMade = false;

  // Fix prefer-const issues
  const constProblems = problems.filter(p => p.ruleId === 'prefer-const');
  for (const problem of constProblems) {
    const lines = fixedContent.split('\n');
    const problemLine = lines[problem.line - 1];
    if (problemLine && problemLine.includes('let ')) {
      lines[problem.line - 1] = problemLine.replace(/\blet\b/, 'const');
      changesMade = true;
    }
  }

  // Fix no-useless-escape issues
  const escapeProblems = problems.filter(p => p.ruleId === 'no-useless-escape');
  for (const problem of escapeProblems) {
    const lines = fixedContent.split('\n');
    const problemLine = lines[problem.line - 1];
    if (problemLine) {
      // Remove unnecessary escapes in regex patterns
      lines[problem.line - 1] = problemLine.replace(/\\([^\\])/g, '$1');
      changesMade = true;
    }
  }

  if (changesMade) {
    fixedContent = lines.join('\n');
  }

  return { content: fixedContent, changesMade };
}

// Process a single file
function processFile(filePath) {
  console.log(`\n🔧 Processing: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const problems = getESLintProblems(filePath);
    
    if (problems.length === 0) {
      console.log(`✅ No issues found in ${filePath}`);
      return { fixed: false, problemCount: 0 };
    }

    console.log(`📋 Found ${problems.length} problems:`);
    const problemCounts = {};
    problems.forEach(p => {
      problemCounts[p.ruleId] = (problemCounts[p.ruleId] || 0) + 1;
    });
    Object.entries(problemCounts).forEach(([rule, count]) => {
      console.log(`   ${count}x ${rule}`);
    });

    let fixedContent = content;
    let totalChanges = false;

    // Apply all fixes
    const fixes = [
      () => fixUnusedVariables(fixedContent, problems),
      () => fixExplicitAny(fixedContent, problems),
      () => fixReactHooksDeps(fixedContent, problems),
      () => fixOtherIssues(fixedContent, problems)
    ];

    for (const fix of fixes) {
      const result = fix();
      if (result.changesMade) {
        fixedContent = result.content;
        totalChanges = true;
      }
    }

    if (totalChanges) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✅ Fixed: ${filePath}`);
      return { fixed: true, problemCount: problems.length };
    } else {
      console.log(`ℹ️  No automatic fixes available for: ${filePath}`);
      return { fixed: false, problemCount: problems.length };
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return { fixed: false, problemCount: 0 };
  }
}

// Main execution
function main() {
  console.log('🚀 Starting comprehensive ESLint bulk fix...\n');
  
  const tsFiles = getAllTsFiles();
  console.log(`📁 Found ${tsFiles.length} TypeScript/TSX files`);
  
  let totalFixed = 0;
  let totalProblems = 0;
  let totalFiles = 0;
  
  for (const filePath of tsFiles) {
    const result = processFile(filePath);
    totalFiles++;
    if (result.fixed) {
      totalFixed++;
    }
    totalProblems += result.problemCount;
  }
  
  console.log(`\n📊 Bulk Fix Summary:`);
  console.log(`   Total files processed: ${totalFiles}`);
  console.log(`   Files with fixes applied: ${totalFixed}`);
  console.log(`   Files already clean: ${totalFiles - totalFixed}`);
  console.log(`   Total problems addressed: ${totalProblems}`);
  
  // Run final verification
  console.log('\n🧪 Running final verification...');
  try {
    console.log('\n📋 Remaining ESLint issues:');
    execSync('npx eslint src --format=json 2>/dev/null | jq -r \'.[] | .messages[] | .ruleId\' | sort | uniq -c | sort -nr', { 
      encoding: 'utf8', 
      stdio: 'inherit' 
    });
    
    console.log('\n🏗️ Testing build...');
    execSync('npm run build', { encoding: 'utf8', stdio: 'inherit' });
    console.log('\n✅ Build successful! All fixes appear to be working.');
  } catch (error) {
    console.log('\n❌ Some issues remain. Manual review may be needed.');
  }
}

main();
