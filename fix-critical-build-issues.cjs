#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Critical Build Issues...\n');

const fixes = [];

// Fix 1: Add missing React imports where needed
function addMissingReactImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it's a React component file that needs React import
    if (content.includes('useState') || content.includes('useEffect') || content.includes('<') && content.includes('>')) {
      if (!content.includes("import React") && !content.includes("from 'react'") && !content.includes('from "react"')) {
        const lines = content.split('\n');
        const firstImportIndex = lines.findIndex(line => line.trim().startsWith('import'));
        
        if (firstImportIndex !== -1) {
          lines.splice(firstImportIndex, 0, "import React from 'react';");
          fs.writeFileSync(filePath, lines.join('\n'));
          fixes.push(`Added React import to ${path.relative(process.cwd(), filePath)}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Fix 2: Add missing icon imports
function addMissingIconImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('from \'lucide-react\'') && !content.includes('from "lucide-react"')) {
      return;
    }
    
    // Find commonly used but potentially missing icons
    const potentiallyMissing = [];
    const iconUsagePatterns = [
      /\bVideo\b(?!['":])/g,
      /\bPhone\b(?!['":])/g,
      /\bMail\b(?!['":])/g,
      /\bCalendar\b(?!['":])/g,
      /\bCheck\b(?!['":])/g,
      /\bUser\b(?!['":])/g,
      /\bUsers\b(?!['":])/g,
      /\bSettings\b(?!['":])/g
    ];
    
    iconUsagePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        const iconName = matches[0];
        if (!content.includes(`import.*${iconName}.*from.*lucide-react`)) {
          potentiallyMissing.push(iconName);
        }
      }
    });
    
    if (potentiallyMissing.length > 0) {
      const lines = content.split('\n');
      const lucideImportIndex = lines.findIndex(line => line.includes('from \'lucide-react\'') || line.includes('from "lucide-react"'));
      
      if (lucideImportIndex !== -1) {
        const importLine = lines[lucideImportIndex];
        const existingIcons = importLine.match(/\{([^}]+)\}/)?.[1] || '';
        const iconsArray = existingIcons.split(',').map(icon => icon.trim()).filter(Boolean);
        
        potentiallyMissing.forEach(icon => {
          if (!iconsArray.includes(icon)) {
            iconsArray.push(icon);
          }
        });
        
        const newImportLine = importLine.replace(/\{[^}]+\}/, `{ ${iconsArray.join(', ')} }`);
        lines[lucideImportIndex] = newImportLine;
        
        fs.writeFileSync(filePath, lines.join('\n'));
        fixes.push(`Added missing icons [${potentiallyMissing.join(', ')}] to ${path.relative(process.cwd(), filePath)}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Fix 3: Fix double semicolons
function fixDoubleSemicolons(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(';;')) {
      const fixed = content.replace(/;;/g, ';');
      fs.writeFileSync(filePath, fixed);
      fixes.push(`Fixed double semicolons in ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Scan and fix files
function scanAndFix(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
        scanAndFix(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        // Skip type definition files
        if (!item.endsWith('.d.ts')) {
          addMissingReactImports(fullPath);
          addMissingIconImports(fullPath);
          fixDoubleSemicolons(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
}

// Run fixes
const srcDir = path.join(process.cwd(), 'src');
if (fs.existsSync(srcDir)) {
  scanAndFix(srcDir);
  
  console.log('🔧 Build Fixes Applied:\n');
  if (fixes.length > 0) {
    fixes.forEach(fix => console.log(`✅ ${fix}`));
  } else {
    console.log('✅ No critical build issues found to fix!');
  }
  
  console.log('\n💡 Next Steps:');
  console.log('1. Run: npm run build');
  console.log('2. Check for any remaining errors');
  console.log('3. Test the application');
} else {
  console.error('❌ src directory not found!');
  process.exit(1);
}
