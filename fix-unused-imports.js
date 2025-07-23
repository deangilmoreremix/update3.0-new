#!/usr/bin/env node

/**
 * Comprehensive unused import fixer for React/TypeScript projects
 * This script will fix the most common causes of the 220 problems in your workspace
 */

const fs = require('fs');
const path = require('path');

// Common unused imports to remove
const COMMON_UNUSED_PATTERNS = [
  // React patterns
  /import React from 'react';\s*\n/g,
  /import React, \{ ([^}]*) \} from 'react';/g,
  
  // Individual unused React hooks and functions
  /,\s*useEffect(?=\s*[,}])/g,
  /,\s*useState(?=\s*[,}])/g,
  /,\s*useCallback(?=\s*[,}])/g,
  /,\s*useMemo(?=\s*[,}])/g,
  /,\s*useRef(?=\s*[,}])/g,
  /,\s*useContext(?=\s*[,}])/g,
  
  // Common unused Lucide icons
  /,\s*DollarSign(?=\s*[,}])/g,
  /,\s*Phone(?=\s*[,}])/g,
  /,\s*Mail(?=\s*[,}])/g,
  /,\s*Plus(?=\s*[,}])/g,
  /,\s*Minus(?=\s*[,}])/g,
  /,\s*Download(?=\s*[,}])/g,
  /,\s*Upload(?=\s*[,}])/g,
  /,\s*Eye(?=\s*[,}])/g,
  /,\s*EyeOff(?=\s*[,}])/g,
  /,\s*Edit(?=\s*[,}])/g,
  /,\s*Trash(?=\s*[,}])/g,
  /,\s*Copy(?=\s*[,}])/g,
];

// Patterns to fix specific import issues
const IMPORT_FIXES = [
  {
    // Remove React import when only using JSX
    pattern: /^import React from 'react';\s*\n/gm,
    replacement: '',
    condition: (content) => !content.includes('React.') && !content.includes('<React.')
  },
  {
    // Fix React import with unused hooks
    pattern: /import React, \{ ([^}]*) \} from 'react';/g,
    replacement: (match, hooks) => {
      // Remove unused hooks from the import
      const usedHooks = [];
      const hookList = hooks.split(',').map(h => h.trim());
      
      hookList.forEach(hook => {
        if (content.includes(hook + '(')) {
          usedHooks.push(hook);
        }
      });
      
      if (usedHooks.length === 0) {
        return "import { } from 'react';";
      } else {
        return `import { ${usedHooks.join(', ')} } from 'react';`;
      }
    }
  }
];

function findTsxFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
      findTsxFiles(fullPath, files);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for unused React import
  if (content.includes("import React from 'react';") && 
      !content.includes('React.') && 
      !content.includes('<React.')) {
    issues.push('unused-react-import');
  }
  
  // Check for unused hooks
  const hooksMatch = content.match(/import.*\{([^}]*)\}.*from 'react'/);
  if (hooksMatch) {
    const hooks = hooksMatch[1].split(',').map(h => h.trim());
    hooks.forEach(hook => {
      if (!content.includes(`${hook}(`)) {
        issues.push(`unused-hook-${hook}`);
      }
    });
  }
  
  // Check for unused Lucide icons
  const lucideMatch = content.match(/import.*\{([^}]*)\}.*from 'lucide-react'/);
  if (lucideMatch) {
    const icons = lucideMatch[1].split(',').map(i => i.trim());
    icons.forEach(icon => {
      if (!content.includes(`<${icon}`) && !content.includes(`{${icon}}`)) {
        issues.push(`unused-icon-${icon}`);
      }
    });
  }
  
  return { content, issues };
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fixed = false;
  
  // Fix React imports
  if (content.includes("import React from 'react';") && 
      !content.includes('React.') && 
      !content.includes('<React.')) {
    content = content.replace(/^import React from 'react';\s*\n/gm, '');
    fixed = true;
  }
  
  // Fix React hooks imports
  const reactImportMatch = content.match(/import React, \{ ([^}]*) \} from 'react';/);
  if (reactImportMatch) {
    const hooks = reactImportMatch[1].split(',').map(h => h.trim());
    const usedHooks = hooks.filter(hook => 
      content.includes(`${hook}(`) || 
      content.includes(`${hook}<`) ||
      content.includes(`${hook} `)
    );
    
    if (usedHooks.length === 0) {
      content = content.replace(/import React, \{ [^}]* \} from 'react';/, "import { } from 'react';");
      fixed = true;
    } else if (usedHooks.length !== hooks.length) {
      content = content.replace(
        /import React, \{ [^}]* \} from 'react';/, 
        `import { ${usedHooks.join(', ')} } from 'react';`
      );
      fixed = true;
    }
  }
  
  // Fix hook-only imports
  const hookOnlyMatch = content.match(/import \{ ([^}]*) \} from 'react';/);
  if (hookOnlyMatch) {
    const hooks = hookOnlyMatch[1].split(',').map(h => h.trim());
    const usedHooks = hooks.filter(hook => 
      content.includes(`${hook}(`) || 
      content.includes(`${hook}<`) ||
      content.includes(`${hook} `)
    );
    
    if (usedHooks.length === 0) {
      content = content.replace(/import \{ [^}]* \} from 'react';\s*\n/, '');
      fixed = true;
    } else if (usedHooks.length !== hooks.length) {
      content = content.replace(
        /import \{ [^}]* \} from 'react';/, 
        `import { ${usedHooks.join(', ')} } from 'react';`
      );
      fixed = true;
    }
  }
  
  // Fix Lucide icons
  const lucideMatch = content.match(/import \{ ([^}]*) \} from 'lucide-react';/);
  if (lucideMatch) {
    const icons = lucideMatch[1].split(',').map(i => i.trim());
    const usedIcons = icons.filter(icon => 
      content.includes(`<${icon}`) || 
      content.includes(`{${icon}}`) ||
      content.includes(`${icon},`) ||
      content.includes(`icon={${icon}}`) ||
      content.includes(`Icon: ${icon}`)
    );
    
    if (usedIcons.length === 0) {
      content = content.replace(/import \{ [^}]* \} from 'lucide-react';\s*\n/, '');
      fixed = true;
    } else if (usedIcons.length !== icons.length) {
      content = content.replace(
        /import \{ [^}]* \} from 'lucide-react';/, 
        `import { ${usedIcons.join(', ')} } from 'lucide-react';`
      );
      fixed = true;
    }
  }
  
  if (fixed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main execution
console.log('🔧 Starting comprehensive unused import cleanup...');

const projectRoot = process.cwd();
const files = findTsxFiles(path.join(projectRoot, 'src'));

console.log(`📁 Found ${files.length} TypeScript/React files to analyze`);

let totalFixed = 0;
let totalIssues = 0;

files.forEach(file => {
  const relativePath = path.relative(projectRoot, file);
  const { issues } = analyzeFile(file);
  
  if (issues.length > 0) {
    console.log(`🔍 ${relativePath}: ${issues.length} issues found`);
    totalIssues += issues.length;
    
    if (fixFile(file)) {
      console.log(`✅ ${relativePath}: Fixed!`);
      totalFixed++;
    }
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Files processed: ${files.length}`);
console.log(`   Files with issues: ${totalIssues}`);
console.log(`   Files fixed: ${totalFixed}`);
console.log(`\n🎉 Cleanup complete! This should resolve many of the 220 problems.`);
console.log(`\n💡 Next steps:`);
console.log(`   1. Restart TypeScript server: Ctrl+Shift+P -> "TypeScript: Restart TS Server"`);
console.log(`   2. Check Problems panel for remaining issues`);
console.log(`   3. Run 'npm run build' to verify all fixes`);
