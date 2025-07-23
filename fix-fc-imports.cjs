#!/usr/bin/env node

/**
 * Fix missing FC imports - this is likely the cause of "ce is not defined" errors
 */

const fs = require('fs');
const path = require('path');

function fixFCImports() {
  let fixedCount = 0;
  
  function processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      // Check if file uses FC but doesn't import it
      if (content.includes(': FC<') && !content.includes('import { FC }') && !content.includes(', FC }') && !content.includes('{ FC,')) {
        
        // Find the React import line
        const lines = content.split('\n');
        let reactImportLineIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes("import React") && lines[i].includes("from 'react'")) {
            reactImportLineIndex = i;
            break;
          }
        }
        
        if (reactImportLineIndex !== -1) {
          const reactImportLine = lines[reactImportLineIndex];
          
          // Add FC to the React import
          let newImportLine;
          if (reactImportLine.includes('{ ')) {
            // Already has named imports, add FC
            newImportLine = reactImportLine.replace(/\{ ([^}]+) \}/, '{ $1, FC }');
          } else if (reactImportLine.includes('import React from')) {
            // Only default import, add named import
            newImportLine = reactImportLine.replace('import React from', 'import React, { FC } from');
          } else {
            // Complex case, try to add FC
            newImportLine = reactImportLine.replace("} from 'react'", ", FC } from 'react'");
          }
          
          if (newImportLine !== reactImportLine) {
            lines[reactImportLineIndex] = newImportLine;
            const newContent = lines.join('\n');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✅ Fixed FC import in ${relativePath}`);
            fixedCount++;
          }
        }
      }
      
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
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          processFile(fullPath);
        }
      });
    } catch (err) {
      // Skip directories we can't read
    }
  }
  
  console.log('🔧 Fixing missing FC imports...');
  scanDirectory(path.join(process.cwd(), 'src'));
  
  console.log(`\n✅ Fixed FC imports in ${fixedCount} files`);
  console.log('\n🚀 Try reloading your app - the "ce is not defined" error should be resolved!');
}

fixFCImports();
