#!/usr/bin/env node

/**
 * Targeted CE Reference Error Detector
 * This specifically looks for the most common patterns that cause "ce is not defined"
 */

const fs = require('fs');
const path = require('path');

function findCeReferenceErrors() {
  const suspiciousPatterns = [];
  
  function checkFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const relativePath = path.relative(process.cwd(), filePath);
      
      lines.forEach((line, index) => {
        const lineNum = index + 1;
        
        // Check for these specific patterns that cause "ce is not defined":
        
        // 1. Standalone 'ce' variable usage
        if (/\bce\b(?!\w)/.test(line) && !line.includes('const ce') && !line.includes('let ce') && !line.includes('import') && !line.includes('//')) {
          suspiciousPatterns.push({
            file: relativePath,
            line: lineNum,
            content: line.trim(),
            issue: 'Potential undefined ce variable usage',
            pattern: 'standalone_ce'
          });
        }
        
        // 2. JSX component <ce> usage
        if (/<%ce[\s>]/.test(line)) {
          suspiciousPatterns.push({
            file: relativePath,
            line: lineNum,
            content: line.trim(),
            issue: 'JSX component <ce> without proper import',
            pattern: 'jsx_component'
          });
        }
        
        // 3. Function call ce()
        if (/\bce\s*\(/.test(line) && !line.includes('replace(') && !line.includes('slice(') && !line.includes('reduce(')) {
          suspiciousPatterns.push({
            file: relativePath,
            line: lineNum,
            content: line.trim(),
            issue: 'Function call ce() without definition',
            pattern: 'function_call'
          });
        }
        
        // 4. Property access ce.something
        if (/\bce\./.test(line) && !line.includes('device(') && !line.includes('service.')) {
          suspiciousPatterns.push({
            file: relativePath,
            line: lineNum,
            content: line.trim(),
            issue: 'Property access on undefined ce variable',
            pattern: 'property_access'
          });
        }
        
        // 5. Missing import for components ending in 'ce'
        if (/<[A-Z]\w*ce[\s/>]/.test(line)) {
          const componentMatch = line.match(/<([A-Z]\w*ce)[\s/>]/);
          if (componentMatch) {
            const componentName = componentMatch[1];
            // Check if this component is imported in the same file
            if (!content.includes(`import ${componentName}`) && !content.includes(`import { ${componentName}`)) {
              suspiciousPatterns.push({
                file: relativePath,
                line: lineNum,
                content: line.trim(),
                issue: `Component ${componentName} used but not imported`,
                pattern: 'missing_import',
                component: componentName
              });
            }
          }
        }
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
          checkFile(fullPath);
        }
      });
    } catch (err) {
      // Skip directories we can't read
    }
  }
  
  console.log('🔍 Scanning for specific "ce is not defined" patterns...\n');
  scanDirectory(path.join(process.cwd(), 'src'));
  
  if (suspiciousPatterns.length === 0) {
    console.log('✅ No obvious "ce is not defined" patterns found!');
    console.log('\n💡 This suggests the error might be:');
    console.log('   1. A runtime error in a minified library');
    console.log('   2. A dynamic import issue');
    console.log('   3. A circular dependency problem');
    console.log('   4. An error in compiled/bundled code');
    console.log('\n🔧 Next steps:');
    console.log('   1. Check browser console for exact error location');
    console.log('   2. Look for any recent changes to component imports');
    console.log('   3. Try clearing browser cache and restarting dev server');
  } else {
    console.log(`⚠️  Found ${suspiciousPatterns.length} suspicious patterns:\n`);
    
    suspiciousPatterns.forEach((pattern, index) => {
      console.log(`${index + 1}. ${pattern.file}:${pattern.line}`);
      console.log(`   Issue: ${pattern.issue}`);
      console.log(`   Code: ${pattern.content}`);
      console.log(`   Pattern: ${pattern.pattern}`);
      if (pattern.component) {
        console.log(`   Component: ${pattern.component}`);
      }
      console.log('');
    });
    
    console.log('🔧 Recommended fixes:');
    console.log('   1. Add missing imports for components');
    console.log('   2. Define undefined variables');
    console.log('   3. Check for typos in variable names');
    console.log('   4. Verify component exports are correct');
  }
}

findCeReferenceErrors();
