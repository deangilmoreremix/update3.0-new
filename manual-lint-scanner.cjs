#!/usr/bin/env node

/**
 * Manual lint problem scanner and fixer
 * Since ESLint might not be reporting properly, let's scan manually
 */

const fs = require('fs');
const path = require('path');

function scanForCommonLintIssues() {
  console.log('🔍 Scanning for common lint problems manually...\n');
  
  const srcDir = path.join(process.cwd(), 'src');
  const issues = {
    unusedImports: [],
    noExplicitAny: [],
    unusedVars: [],
    missingDeps: [],
    tsIgnoreComments: [],
    prototypeBuiltins: []
  };
  
  function scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      // Check for unused imports (basic pattern)
      const importMatches = content.match(/^import.*from.*$/gm) || [];
      importMatches.forEach((importLine, index) => {
        const importMatch = importLine.match(/import\s+\{([^}]+)\}\s+from/);
        if (importMatch) {
          const imports = importMatch[1].split(',').map(i => i.trim());
          imports.forEach(imp => {
            const cleanImp = imp.replace(/\s+as\s+\w+/, '');
            if (!content.includes(cleanImp.split(' ')[0]) || 
                content.split('\n').indexOf(importLine) === content.lastIndexOf(cleanImp.split(' ')[0])) {
              // Might be unused
            }
          });
        }
      });
      
      // Check for explicit any types
      const anyMatches = content.match(/:\s*any\b/g) || [];
      if (anyMatches.length > 0) {
        issues.noExplicitAny.push({
          file: relativePath,
          count: anyMatches.length,
          line: content.split('\n').findIndex(line => line.includes(': any')) + 1
        });
      }
      
      // Check for @ts-ignore comments
      const tsIgnoreMatches = content.match(/\/\/\s*@ts-ignore/g) || [];
      if (tsIgnoreMatches.length > 0) {
        issues.tsIgnoreComments.push({
          file: relativePath,
          count: tsIgnoreMatches.length
        });
      }
      
      // Check for Object.prototype usage
      const prototypeMatches = content.match(/\.hasOwnProperty\(/g) || [];
      if (prototypeMatches.length > 0) {
        issues.prototypeBuiltins.push({
          file: relativePath,
          count: prototypeMatches.length
        });
      }
      
      // Check for unused variables (basic pattern)
      const varMatches = content.match(/const\s+(\w+)\s*=/g) || [];
      varMatches.forEach(match => {
        const varName = match.match(/const\s+(\w+)/)[1];
        const occurrences = (content.match(new RegExp(varName, 'g')) || []).length;
        if (occurrences === 1) {
          issues.unusedVars.push({
            file: relativePath,
            variable: varName
          });
        }
      });
      
    } catch (err) {
      // Skip files that can't be read
    }
  }
  
  function traverseDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !['node_modules', '.git', 'dist'].includes(item)) {
          traverseDirectory(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          scanFile(fullPath);
        }
      }
    } catch (err) {
      // Skip directories we can't read
    }
  }
  
  traverseDirectory(srcDir);
  
  // Report findings
  console.log('📊 MANUAL SCAN RESULTS:\n');
  
  let totalIssues = 0;
  
  if (issues.noExplicitAny.length > 0) {
    console.log(`🔴 Explicit 'any' types: ${issues.noExplicitAny.length} files`);
    totalIssues += issues.noExplicitAny.reduce((sum, item) => sum + item.count, 0);
    issues.noExplicitAny.slice(0, 5).forEach(item => {
      console.log(`   ${item.file}: ${item.count} issues`);
    });
    console.log('');
  }
  
  if (issues.tsIgnoreComments.length > 0) {
    console.log(`🟡 @ts-ignore comments: ${issues.tsIgnoreComments.length} files`);
    totalIssues += issues.tsIgnoreComments.reduce((sum, item) => sum + item.count, 0);
    issues.tsIgnoreComments.slice(0, 5).forEach(item => {
      console.log(`   ${item.file}: ${item.count} issues`);
    });
    console.log('');
  }
  
  if (issues.prototypeBuiltins.length > 0) {
    console.log(`🟠 Object.prototype usage: ${issues.prototypeBuiltins.length} files`);
    totalIssues += issues.prototypeBuiltins.reduce((sum, item) => sum + item.count, 0);
    issues.prototypeBuiltins.slice(0, 5).forEach(item => {
      console.log(`   ${item.file}: ${item.count} issues`);
    });
    console.log('');
  }
  
  if (issues.unusedVars.length > 0) {
    console.log(`🔵 Potentially unused variables: ${issues.unusedVars.length}`);
    issues.unusedVars.slice(0, 10).forEach(item => {
      console.log(`   ${item.file}: ${item.variable}`);
    });
    console.log('');
  }
  
  console.log(`📊 ESTIMATED TOTAL ISSUES: ${totalIssues + issues.unusedVars.length}`);
  
  return issues;
}

function createFixScript(issues) {
  const fixCommands = [
    '#!/usr/bin/env node',
    '',
    '// Automated lint fixes based on manual scan',
    'const fs = require("fs");',
    'const path = require("path");',
    '',
    'console.log("🔧 Applying automated lint fixes...");',
    '',
    '// Fix @ts-ignore -> @ts-expect-error',
    'function fixTsIgnoreComments() {',
    '  const files = [',
    ...issues.tsIgnoreComments.map(item => `    "${item.file}",`),
    '  ];',
    '  ',
    '  files.forEach(file => {',
    '    try {',
    '      const filePath = path.join(process.cwd(), file);',
    '      let content = fs.readFileSync(filePath, "utf8");',
    '      content = content.replace(/\\/\\/\\s*@ts-ignore/g, "// @ts-expect-error");',
    '      fs.writeFileSync(filePath, content, "utf8");',
    '      console.log(`✅ Fixed @ts-ignore in ${file}`);',
    '    } catch (err) {',
    '      console.log(`❌ Could not fix ${file}: ${err.message}`);',
    '    }',
    '  });',
    '}',
    '',
    '// Fix Object.prototype usage',
    'function fixPrototypeBuiltins() {',
    '  const files = [',
    ...issues.prototypeBuiltins.map(item => `    "${item.file}",`),
    '  ];',
    '  ',
    '  files.forEach(file => {',
    '    try {',
    '      const filePath = path.join(process.cwd(), file);',
    '      let content = fs.readFileSync(filePath, "utf8");',
    '      content = content.replace(/(\\w+)\\.hasOwnProperty\\(/g, "Object.prototype.hasOwnProperty.call($1, ");',
    '      fs.writeFileSync(filePath, content, "utf8");',
    '      console.log(`✅ Fixed prototype usage in ${file}`);',
    '    } catch (err) {',
    '      console.log(`❌ Could not fix ${file}: ${err.message}`);',
    '    }',
    '  });',
    '}',
    '',
    '// Run fixes',
    'fixTsIgnoreComments();',
    'fixPrototypeBuiltins();',
    '',
    'console.log("✅ Automated fixes complete!");'
  ];
  
  fs.writeFileSync('apply-lint-fixes.cjs', fixCommands.join('\n'), 'utf8');
  console.log('\n📝 Created apply-lint-fixes.cjs script');
}

// Run the scan
const issues = scanForCommonLintIssues();
createFixScript(issues);

console.log('\n🎯 NEXT STEPS:');
console.log('1. Run: node apply-lint-fixes.cjs (for auto-fixable issues)');
console.log('2. Manually review and fix "any" types to specific types');
console.log('3. Check React Hook dependency arrays manually');
console.log('4. Run: npx eslint . to verify remaining issues');
