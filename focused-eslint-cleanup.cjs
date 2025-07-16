#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// List of files with high concentration of unused imports (from ESLint output)
const HIGH_IMPACT_FILES = [
  './AIToolsProvider.tsx',
  './AppointmentWidget.tsx', 
  './ComposioIntegrationsModal.tsx',
  './Dashboard/AIToolsCard.tsx',
  './DealAnalytics.tsx',
  './DealDetail.tsx',
  './GoalExecutionModal.tsx',
  './InteractiveGoalCard.tsx',
  './LiveGoalExecution.tsx',
  './Navbar.tsx',
  './PipelineStats.tsx',
  './RoleBasedAccess.tsx',
  './TaskCalendar.tsx',
  './TenantProvider.tsx'
];

// Simple pattern matching for common unused import issues
function cleanUnusedLucideImports(content) {
  // Get all lucide-react imports
  const importMatch = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"`]lucide-react['"`];?/);
  if (!importMatch) return content;
  
  const allImports = importMatch[1].split(',').map(i => i.trim());
  const usedImports = [];
  
  allImports.forEach(importName => {
    // Check if used as JSX component: <Icon 
    const jsxPattern = new RegExp(`<${importName}\\s`);
    // Check if used in object destructuring or props
    const propPattern = new RegExp(`\\b${importName}\\b(?=\\s*[}:,)])`);
    
    if (jsxPattern.test(content) || propPattern.test(content)) {
      usedImports.push(importName);
    }
  });
  
  if (usedImports.length === 0) {
    return content.replace(/import\s*{\s*[^}]+\s*}\s*from\s*['"`]lucide-react['"`];?\n?/g, '');
  } else if (usedImports.length < allImports.length) {
    return content.replace(
      /import\s*{\s*[^}]+\s*}\s*from\s*['"`]lucide-react['"`];?/g,
      `import { ${usedImports.join(', ')} } from 'lucide-react';`
    );
  }
  
  return content;
}

// Fix simple explicit any types
function fixSimpleAnyTypes(content) {
  return content
    .replace(/:\s*any\[\]/g, ': unknown[]')
    .replace(/useState<any>/g, 'useState<unknown>')
    .replace(/as\s+any\b/g, 'as unknown');
}

// Fix simple unused variable declarations
function removeUnusedVars(content) {
  const lines = content.split('\n');
  const filteredLines = [];
  
  lines.forEach(line => {
    // Skip lines that declare but don't use variables (simple pattern)
    const unusedVarMatch = line.match(/^\s*(?:const|let|var)\s+(\w+)\s*=\s*[^;]+;?\s*$/);
    if (unusedVarMatch) {
      const varName = unusedVarMatch[1];
      const usageRegex = new RegExp(`\\b${varName}\\b`, 'g');
      const usages = content.match(usageRegex) || [];
      
      // If variable is only mentioned once (in declaration), it's unused
      if (usages.length <= 1) {
        return; // Skip this line
      }
    }
    filteredLines.push(line);
  });
  
  return filteredLines.join('\n');
}

// Process a single file
function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { success: false, error: 'File not found' };
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const fixes = [];
    
    // Apply fixes
    const afterLucide = cleanUnusedLucideImports(content);
    if (afterLucide !== content) {
      content = afterLucide;
      fixes.push('Cleaned lucide imports');
    }
    
    const afterAny = fixSimpleAnyTypes(content);
    if (afterAny !== content) {
      content = afterAny;
      fixes.push('Fixed any types');
    }
    
    const afterVars = removeUnusedVars(content);
    if (afterVars !== content) {
      content = afterVars;
      fixes.push('Removed unused vars');
    }
    
    // Write back if changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { success: true, fixes, changed: true };
    }
    
    return { success: true, fixes: [], changed: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Main execution
function main() {
  console.log('🎯 Running focused ESLint cleanup on high-impact files...\n');
  
  const existingFiles = HIGH_IMPACT_FILES.filter(file => fs.existsSync(file));
  console.log(`Processing ${existingFiles.length} high-impact files\n`);
  
  let processed = 0;
  let fixed = 0;
  const results = [];
  
  existingFiles.forEach(filePath => {
    const relativePath = path.relative(process.cwd(), filePath);
    process.stdout.write(`\r🔧 ${relativePath}...`);
    
    const result = processFile(filePath);
    processed++;
    
    if (result.success && result.changed) {
      fixed++;
      results.push({ file: relativePath, fixes: result.fixes });
    } else if (!result.success) {
      console.error(`\n❌ Error: ${relativePath}: ${result.error}`);
    }
  });
  
  console.log(`\n\n✅ Focused cleanup completed!`);
  console.log(`📊 Summary:`);
  console.log(`   • Files processed: ${processed}`);
  console.log(`   • Files fixed: ${fixed}`);
  console.log(`   • Success rate: ${((fixed / processed) * 100).toFixed(1)}%`);
  
  if (results.length > 0) {
    console.log(`\n🔧 Files fixed:`);
    results.forEach(result => {
      console.log(`   • ${result.file}: ${result.fixes.join(', ')}`);
    });
  }
  
  // Quick ESLint count check
  console.log('\n📊 Checking ESLint count...');
  try {
    const output = execSync('npm run lint 2>&1 | grep -c "error\\|warning"', { encoding: 'utf8' });
    console.log(`Current ESLint issues: ${output.trim()}`);
  } catch (error) {
    console.log('Could not get ESLint count');
  }
}

if (require.main === module) {
  main();
}
