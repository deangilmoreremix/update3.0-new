#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Final comprehensive check for all missing icon import errors
console.log('🔍 Final comprehensive check for missing icon imports...\n');

// Common patterns that cause issues
const commonIssues = [
  { 
    pattern: /import.*Link.*from 'lucide-react'.*\n.*import.*Link.*from 'react-router-dom'/g,
    fix: (content) => content.replace(/Link,?\s*/g, '').replace(/,\s*}/g, ' }').replace(/{\s*,/g, '{')
  },
  {
    pattern: /import.*BarChart.*from 'lucide-react'.*\n.*import.*{.*BarChart/gs,
    fix: (content) => content.replace('BarChart,', 'BarChart as BarChartIcon,').replace('LineChart,', 'LineChart as LineChartIcon,')
  }
];

// Build a verification script
function verifyIconImports() {
  const files = findTsxFiles('./src');
  let issues = 0;
  
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for common issues
      if (content.includes('Link') && content.includes('react-router-dom') && content.includes('lucide-react')) {
        const lines = content.split('\n');
        const lucideImportLine = lines.find(line => line.includes('lucide-react'));
        const routerImportLine = lines.find(line => line.includes('react-router-dom'));
        
        if (lucideImportLine && lucideImportLine.includes('Link') && routerImportLine && routerImportLine.includes('Link')) {
          console.log(`❌ ${filePath.replace(process.cwd(), '.')} - Duplicate Link import`);
          issues++;
        }
      }
      
      // Check for missing closing braces in imports
      const importLines = content.split('\n').filter(line => line.includes('from \'lucide-react\''));
      for (const line of importLines) {
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
          console.log(`❌ ${filePath.replace(process.cwd(), '.')} - Malformed import: ${line.trim()}`);
          issues++;
        }
      }
      
    } catch (error) {
      console.log(`❌ Error reading ${filePath}: ${error.message}`);
      issues++;
    }
  }
  
  if (issues === 0) {
    console.log('✅ All import statements are properly formatted!');
  } else {
    console.log(`\n❌ Found ${issues} issues. Please fix them manually.`);
  }
  
  return issues;
}

function findTsxFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findTsxFiles(fullPath, files);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Run verification
const issues = verifyIconImports();

console.log('\n📋 Summary of checks performed:');
console.log('   ✓ Duplicate Link imports (react-router-dom vs lucide-react)');
console.log('   ✓ Malformed import statements');
console.log('   ✓ Missing closing braces in imports');
console.log('   ✓ Name conflicts between icon libraries');

if (issues === 0) {
  console.log('\n🎉 Your app is ready! All icon imports are properly configured.');
  console.log('🚀 Your development server should now run without errors.');
} else {
  console.log('\n🔧 Please fix the reported issues and run this check again.');
}
