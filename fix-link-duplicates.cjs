#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

function fixDuplicateLinks(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let hasReactRouterLink = false;
  let lucideImportLineIndex = -1;
  
  // Find react-router-dom Link import
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('from \'react-router-dom\'') && lines[i].includes('Link')) {
      hasReactRouterLink = true;
    }
    if (lines[i].includes('from \'lucide-react\'')) {
      lucideImportLineIndex = i;
    }
  }
  
  // If both exist, remove Link from lucide-react import
  if (hasReactRouterLink && lucideImportLineIndex !== -1) {
    let lucideLine = lines[lucideImportLineIndex];
    
    // Remove Link from the lucide import
    lucideLine = lucideLine.replace(/,?\s*Link\s*,?/g, '');
    
    // Clean up any extra commas or spaces
    lucideLine = lucideLine.replace(/{\s*,/g, '{');
    lucideLine = lucideLine.replace(/,\s*}/g, ' }');
    lucideLine = lucideLine.replace(/,\s*,/g, ',');
    
    lines[lucideImportLineIndex] = lucideLine;
    content = lines.join('\n');
    
    return content;
  }
  
  return content;
}

function fixMalformedImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix unclosed import statements
  content = content.replace(/import\s*{\s*([^}]+)\s*from\s*'lucide-react';\s*import\s*{\s*([^}]+)\s*}\s*from\s*'lucide-react';/g, 
    (match, first, second) => {
      const allImports = [...first.split(','), ...second.split(',')]
        .map(imp => imp.trim())
        .filter(imp => imp.length > 0)
        .filter((imp, index, arr) => arr.indexOf(imp) === index); // Remove duplicates
      
      return `import { ${allImports.join(', ')} } from 'lucide-react';`;
    });
  
  // Fix missing closing braces
  content = content.replace(/import\s*{\s*([^}]+)\s*import\s*{([^}]+)}\s*from\s*'lucide-react';/g, 
    (match, first, second) => {
      const allImports = [...first.split(','), ...second.split(',')]
        .map(imp => imp.trim())
        .filter(imp => imp.length > 0)
        .filter((imp, index, arr) => arr.indexOf(imp) === index);
      
      return `import { ${allImports.join(', ')} } from 'lucide-react';`;
    });
  
  return content;
}

console.log('🔧 Fixing all duplicate Link imports and malformed imports...\n');

const files = findTsxFiles('./src');
let fixedFiles = 0;

for (const filePath of files) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let fixedContent = fixDuplicateLinks(filePath);
    fixedContent = fixMalformedImports(filePath);
    
    if (originalContent !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✅ Fixed: ${filePath.replace(process.cwd(), '.')}`);
      fixedFiles++;
    }
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}: ${error.message}`);
  }
}

console.log(`\n📊 Summary: Fixed ${fixedFiles} files`);

if (fixedFiles > 0) {
  console.log('\n🎉 All duplicate Link imports have been resolved!');
  console.log('💡 Restart your dev server to see the changes.');
} else {
  console.log('\n✅ No issues found to fix.');
}
