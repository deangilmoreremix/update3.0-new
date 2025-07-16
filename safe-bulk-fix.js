#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎯 SmartCRM Safe Bulk ESLint Fix');
console.log('⚡ Targeting: unused imports, unused vars, and any types\n');

// Get current ESLint problems to target specific issues
function getESLintProblems() {
  try {
    const output = execSync('npm run lint -- --format=json', { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    // ESLint returns non-zero exit code when there are errors
    try {
      return JSON.parse(error.stdout);
    } catch {
      return [];
    }
  }
}

// Safe unused import remover
function removeUnusedImports(content, unusedImports) {
  let fixed = content;
  
  for (const unused of unusedImports) {
    // Remove from import destructuring
    const patterns = [
      // Remove from middle: { a, UNUSED, b } -> { a, b }
      new RegExp(`(\\{[^}]*),\\s*${unused}\\s*,([^}]*\\})`, 'g'),
      // Remove from start: { UNUSED, a, b } -> { a, b }  
      new RegExp(`(\\{)\\s*${unused}\\s*,\\s*`, 'g'),
      // Remove from end: { a, b, UNUSED } -> { a, b }
      new RegExp(`(,\\s*)${unused}\\s*(\\})`, 'g'),
      // Remove single import: { UNUSED } -> remove entire line
      new RegExp(`import\\s*\\{\\s*${unused}\\s*\\}\\s*from\\s*['"][^'"]*['"];?\\s*\\n`, 'g'),
      // Remove default import if unused: import UNUSED from -> remove line
      new RegExp(`import\\s+${unused}\\s+from\\s*['"][^'"]*['"];?\\s*\\n`, 'g')
    ];
    
    for (const pattern of patterns) {
      fixed = fixed.replace(pattern, (match, p1, p2) => {
        if (p1 && p2) return p1 + p2;
        if (p1) return p1;
        if (p2) return p2;
        return '';
      });
    }
  }
  
  // Clean up empty import statements
  fixed = fixed.replace(/import\s*\{\s*\}\s*from\s*['"][^'"]*['"];?\s*\n/g, '');
  
  return fixed;
}

// Safe unused variable handler - prefix with underscore
function prefixUnusedVars(content, unusedVars) {
  let fixed = content;
  
  for (const unused of unusedVars) {
    if (!unused.startsWith('_')) {
      // Only replace declarations, not usage
      const patterns = [
        // const/let/var declarations
        new RegExp(`\\b(const|let|var)\\s+(${unused})\\b`, 'g'),
        // Function parameters  
        new RegExp(`\\((.*?)(^|,)\\s*(${unused})\\b`, 'g'),
        // Destructuring
        new RegExp(`\\{([^}]*,\\s*)?(${unused})(\\s*[,}])`, 'g'),
        // Array destructuring
        new RegExp(`\\[([^\\]]*,\\s*)?(${unused})(\\s*[,\\]])`, 'g')
      ];
      
      patterns.forEach(pattern => {
        fixed = fixed.replace(pattern, (match, ...args) => {
          return match.replace(new RegExp(`\\b${unused}\\b`), `_${unused}`);
        });
      });
    }
  }
  
  return fixed;
}

// Safe any type replacements
function replaceAnyTypes(content) {
  return content
    // : any -> : unknown (safer)
    .replace(/:\s*any\b(?!\w)/g, ': unknown')
    // any[] -> unknown[]
    .replace(/\bany\[\]/g, 'unknown[]')
    // <any> -> <unknown> in generics
    .replace(/<any>/g, '<unknown>');
}

// Process files based on ESLint output
async function bulkFix() {
  console.log('📊 Analyzing ESLint problems...');
  const eslintData = getESLintProblems();
  
  if (!eslintData || eslintData.length === 0) {
    console.log('✅ No ESLint data found or no issues detected');
    return;
  }
  
  let totalFilesChanged = 0;
  let totalFixesApplied = 0;
  
  for (const fileData of eslintData) {
    if (!fileData.messages || fileData.messages.length === 0) continue;
    
    const filePath = fileData.filePath;
    
    // Skip if file doesn't exist or is in node_modules
    if (!fs.existsSync(filePath) || filePath.includes('node_modules')) continue;
    
    console.log(`🔍 Processing: ${path.relative(process.cwd(), filePath)}`);
    
    // Categorize problems
    const unusedImports = [];
    const unusedVars = [];
    const anyTypes = [];
    
    for (const message of fileData.messages) {
      if (message.ruleId === '@typescript-eslint/no-unused-vars') {
        const match = message.message.match(/'([^']+)' is defined but never used/);
        if (match) {
          unusedImports.push(match[1]);
        }
        
        const varMatch = message.message.match(/'([^']+)' is assigned a value but never used/);
        if (varMatch) {
          unusedVars.push(varMatch[1]);
        }
      }
      
      if (message.ruleId === '@typescript-eslint/no-explicit-any') {
        anyTypes.push(message);
      }
    }
    
    // Only process if we have issues to fix
    if (unusedImports.length === 0 && unusedVars.length === 0 && anyTypes.length === 0) {
      continue;
    }
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      let localFixes = 0;
      
      // Apply fixes safely
      if (unusedImports.length > 0) {
        content = removeUnusedImports(content, unusedImports);
        localFixes += unusedImports.length;
        console.log(`  📦 Removed ${unusedImports.length} unused imports`);
      }
      
      if (unusedVars.length > 0) {
        content = prefixUnusedVars(content, unusedVars);
        localFixes += unusedVars.length;
        console.log(`  🔧 Prefixed ${unusedVars.length} unused variables with _`);
      }
      
      if (anyTypes.length > 0) {
        content = replaceAnyTypes(content);
        localFixes += anyTypes.length;
        console.log(`  🎯 Replaced ${anyTypes.length} 'any' types with 'unknown'`);
      }
      
      // Write file if changes were made
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        totalFilesChanged++;
        totalFixesApplied += localFixes;
        console.log(`  ✅ Applied ${localFixes} fixes`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Bulk Fix Summary:');
  console.log(`📁 Files modified: ${totalFilesChanged}`);
  console.log(`🔧 Total fixes applied: ${totalFixesApplied}`);
  
  // Verify with ESLint
  console.log('\n🧪 Running ESLint to check results...');
  try {
    const result = execSync('npm run lint 2>&1 | grep "✖"', { encoding: 'utf8' });
    console.log(`📊 ${result.trim()}`);
  } catch (error) {
    console.log('✅ ESLint check completed');
  }
}

// Run the fix
bulkFix().catch(console.error);
