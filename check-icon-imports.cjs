#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Common Lucide React icons that are frequently used
const COMMON_ICONS = [
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
  'ChevronRight', 'ChevronLeft', 'ChevronUp', 'ChevronDown',
  'TrendingUp', 'TrendingDown',
  'CheckCircle', 'AlertCircle', 'XCircle', 'Circle',
  'Calendar', 'Clock', 'Timer',
  'Mail', 'Phone', 'PhoneCall', 'MessageSquare',
  'User', 'Users', 'UserPlus',
  'Settings', 'Search', 'Filter',
  'Eye', 'EyeOff',
  'Edit', 'Trash', 'Trash2', 'Delete',
  'Plus', 'Minus', 'X',
  'Save', 'Download', 'Upload',
  'Home', 'Menu', 'Grid', 'List',
  'Star', 'Heart', 'ThumbsUp', 'ThumbsDown',
  'Play', 'Pause', 'Stop',
  'Volume2', 'VolumeX', 'Mic', 'MicOff',
  'Bell', 'BellOff',
  'Lock', 'Unlock',
  'Share', 'Link', 'Copy',
  'Refresh', 'RefreshCw', 'RotateCcw',
  'Zap', 'Battery', 'Wifi', 'WifiOff',
  'Globe', 'MapPin', 'Navigation',
  'Building', 'Building2', 'Home',
  'Briefcase', 'Folder', 'File', 'FileText',
  'Image', 'Camera', 'Video',
  'DollarSign', 'CreditCard', 'ShoppingCart',
  'BarChart', 'BarChart2', 'BarChart3', 'PieChart', 'LineChart',
  'Target', 'Award', 'Trophy', 'Medal',
  'Brain', 'Lightbulb', 'Sparkles',
  'Database', 'Server', 'Cloud',
  'Monitor', 'Smartphone', 'Tablet',
  'Facebook', 'Twitter', 'Instagram', 'Linkedin',
  'Github', 'Gitlab', 'Youtube',
  'Check', 'X', 'Info', 'HelpCircle',
  'More', 'MoreHorizontal', 'MoreVertical',
  'Activity', 'Loader', 'Loader2',
  'ShieldCheck', 'Shield', 'ShieldAlert'
];

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

function analyzeTsxFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Find lucide-react import line
  let importLineIndex = -1;
  let currentImports = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("from 'lucide-react'")) {
      importLineIndex = i;
      // Extract current imports
      const importMatch = line.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"]/);
      if (importMatch) {
        currentImports = importMatch[1]
          .split(',')
          .map(imp => imp.trim())
          .filter(imp => imp.length > 0);
      }
      break;
    }
  }
  
  // Find all icon usages in the file
  const usedIcons = new Set();
  
  // Look for icon usage patterns
  const iconPatterns = [
    /icon:\s*([A-Z][a-zA-Z0-9]*)/g,  // icon: IconName
    /<([A-Z][a-zA-Z0-9]*)\s/g,       // <IconName
    /([A-Z][a-zA-Z0-9]*)\s*className/g, // IconName className
    /const\s+Icon\s*=\s*([A-Z][a-zA-Z0-9]*)/g // const Icon = IconName
  ];
  
  for (const pattern of iconPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const iconName = match[1];
      if (COMMON_ICONS.includes(iconName)) {
        usedIcons.add(iconName);
      }
    }
  }
  
  // Check for missing imports
  const missingImports = Array.from(usedIcons).filter(icon => !currentImports.includes(icon));
  
  return {
    filePath,
    importLineIndex,
    currentImports,
    usedIcons: Array.from(usedIcons),
    missingImports,
    hasLucideImport: importLineIndex !== -1
  };
}

function fixImports(analysis) {
  if (analysis.missingImports.length === 0) return false;
  
  const content = fs.readFileSync(analysis.filePath, 'utf8');
  const lines = content.split('\n');
  
  if (analysis.importLineIndex === -1) {
    // No lucide-react import found, add it
    let insertIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ') && !lines[i].includes('react')) {
        insertIndex = i;
        break;
      }
    }
    
    const newImport = `import { ${analysis.missingImports.join(', ')} } from 'lucide-react';`;
    lines.splice(insertIndex, 0, newImport);
  } else {
    // Update existing import
    const allImports = [...analysis.currentImports, ...analysis.missingImports]
      .filter((imp, index, arr) => arr.indexOf(imp) === index) // Remove duplicates
      .sort();
    
    const newImportLine = `import { ${allImports.join(', ')} } from 'lucide-react';`;
    lines[analysis.importLineIndex] = newImportLine;
  }
  
  fs.writeFileSync(analysis.filePath, lines.join('\n'));
  return true;
}

console.log('🔍 Scanning for missing icon imports...\n');

const tsxFiles = findTsxFiles('./src');
let totalFiles = 0;
let filesWithIssues = 0;
let totalFixed = 0;

for (const file of tsxFiles) {
  totalFiles++;
  const analysis = analyzeTsxFile(file);
  
  if (analysis.missingImports.length > 0) {
    filesWithIssues++;
    console.log(`❌ ${file.replace(process.cwd(), '.')}`);
    console.log(`   Missing: ${analysis.missingImports.join(', ')}`);
    
    if (fixImports(analysis)) {
      totalFixed++;
      console.log(`   ✅ Fixed!`);
    }
    console.log('');
  } else if (analysis.usedIcons.length > 0) {
    console.log(`✅ ${file.replace(process.cwd(), '.')} - All imports OK`);
  }
}

console.log('\n📊 Summary:');
console.log(`   Files scanned: ${totalFiles}`);
console.log(`   Files with issues: ${filesWithIssues}`);
console.log(`   Files fixed: ${totalFixed}`);

if (filesWithIssues === 0) {
  console.log('\n🎉 No missing icon imports found!');
} else {
  console.log('\n🔧 All missing imports have been fixed!');
  console.log('💡 Tip: Restart your dev server to see changes.');
}
