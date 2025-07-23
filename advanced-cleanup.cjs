#!/usr/bin/env node

/**
 * Advanced cleanup for remaining TypeScript/ESLint issues
 * This script targets specific patterns that commonly cause problems
 */

const fs = require('fs');
const path = require('path');

function findAllFiles(dir, extensions = ['.tsx', '.ts'], exclude = ['node_modules', 'dist', '.git']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!exclude.includes(item) && !item.startsWith('.')) {
          traverse(fullPath);
        }
      } else {
        if (extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

function fixSpecificIssues(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Fix 1: Remove standalone React import when not needed
  if (content.includes("import React from 'react';") && !content.includes('React.') && !content.includes('<React.')) {
    content = content.replace(/^import React from 'react';\s*$/gm, '');
    console.log(`✅ ${relativePath}: Removed unused React import`);
    modified = true;
  }
  
  // Fix 2: Clean up empty import statements
  content = content.replace(/^import\s*\{\s*\}\s*from\s*['"][^'"]*['"];\s*$/gm, '');
  
  // Fix 3: Fix common unused variables (declared but never read)
  const unusedVarPatterns = [
    // Remove unused variables in destructuring
    /const\s*\{\s*([^}]*),\s*\.\.\.rest\s*\}\s*=\s*props;/g,
    // Fix unused function parameters
    /\(\s*[^,)]+\s*,\s*([^)]*)\)\s*=>/g,
  ];
  
  // Fix 4: Common Lucide icon cleanup
  const commonUnusedIcons = [
    'DollarSign', 'Phone', 'Mail', 'Plus', 'Minus', 'Download', 'Upload', 
    'Eye', 'EyeOff', 'Edit', 'Trash', 'Copy', 'Share', 'Heart', 'Bookmark',
    'Bell', 'Home', 'Menu', 'Settings', 'User', 'Calendar', 'Clock',
    'ChevronLeft', 'ChevronRight', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
  ];
  
  // Check and fix Lucide imports
  const lucideImportMatch = content.match(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]lucide-react['"];/);
  if (lucideImportMatch) {
    const importedIcons = lucideImportMatch[1]
      .split(',')
      .map(icon => icon.trim())
      .filter(icon => icon);
    
    const usedIcons = importedIcons.filter(icon => {
      // Check if icon is actually used in the component
      const iconUsagePatterns = [
        new RegExp(`<${icon}[\\s/>]`, 'g'),
        new RegExp(`\\{${icon}\\}`, 'g'),
        new RegExp(`icon={${icon}}`, 'g'),
        new RegExp(`Icon:\\s*${icon}`, 'g'),
        new RegExp(`${icon}Icon`, 'g')
      ];
      
      return iconUsagePatterns.some(pattern => pattern.test(content));
    });
    
    if (usedIcons.length !== importedIcons.length) {
      if (usedIcons.length === 0) {
        content = content.replace(/import\s*\{\s*[^}]+\s*\}\s*from\s*['"]lucide-react['"];\s*/g, '');
        console.log(`✅ ${relativePath}: Removed all unused Lucide icons`);
      } else {
        const newImport = `import { ${usedIcons.join(', ')} } from 'lucide-react';`;
        content = content.replace(/import\s*\{\s*[^}]+\s*\}\s*from\s*['"]lucide-react['"];/, newImport);
        console.log(`✅ ${relativePath}: Cleaned up Lucide imports (${importedIcons.length - usedIcons.length} removed)`);
      }
      modified = true;
    }
  }
  
  // Fix 5: React hooks cleanup
  const reactHookImportMatch = content.match(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]react['"];/);
  if (reactHookImportMatch) {
    const importedHooks = reactHookImportMatch[1]
      .split(',')
      .map(hook => hook.trim())
      .filter(hook => hook);
    
    const usedHooks = importedHooks.filter(hook => {
      const hookUsagePatterns = [
        new RegExp(`${hook}\\s*\\(`, 'g'),
        new RegExp(`\\b${hook}\\b`, 'g')
      ];
      
      return hookUsagePatterns.some(pattern => pattern.test(content.substring(content.indexOf(reactHookImportMatch[0]) + reactHookImportMatch[0].length)));
    });
    
    if (usedHooks.length !== importedHooks.length) {
      if (usedHooks.length === 0) {
        content = content.replace(/import\s*\{\s*[^}]+\s*\}\s*from\s*['"]react['"];\s*/g, '');
        console.log(`✅ ${relativePath}: Removed all unused React hooks`);
      } else {
        const newImport = `import { ${usedHooks.join(', ')} } from 'react';`;
        content = content.replace(/import\s*\{\s*[^}]+\s*\}\s*from\s*['"]react['"];/, newImport);
        console.log(`✅ ${relativePath}: Cleaned up React hook imports (${importedHooks.length - usedHooks.length} removed)`);
      }
      modified = true;
    }
  }
  
  // Fix 6: Remove unused CSS class assignments
  content = content.replace(/className=\s*[`'"]\s*[`'"]/g, '');
  
  // Fix 7: Clean up empty lines and formatting
  content = content.replace(/^\s*\n\s*\n\s*\n/gm, '\n\n');
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main execution
console.log('🧹 Running advanced cleanup for remaining issues...');

const srcDir = path.join(process.cwd(), 'src');
const files = findAllFiles(srcDir);

console.log(`📁 Processing ${files.length} files...`);

let fixedCount = 0;

files.forEach(file => {
  if (fixSpecificIssues(file)) {
    fixedCount++;
  }
});

console.log(`\n🎯 Advanced cleanup complete!`);
console.log(`   Files processed: ${files.length}`);
console.log(`   Files fixed: ${fixedCount}`);

console.log(`\n🔄 Final steps to resolve remaining issues:`);
console.log(`   1. Restart TypeScript server: Ctrl+Shift+P → "TypeScript: Restart TS Server"`);
console.log(`   2. Restart ESLint server: Ctrl+Shift+P → "ESLint: Restart ESLint Server"`);
console.log(`   3. Reload VS Code window: Ctrl+Shift+P → "Developer: Reload Window"`);
console.log(`   4. Check Problems panel - should now show far fewer issues!`);
