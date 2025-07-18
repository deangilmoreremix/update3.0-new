#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Scanning for potential "not defined" icon errors...\n');

// Common icon names that might be used without imports
const commonIcons = [
  'Video', 'Phone', 'Mail', 'Calendar', 'Clock', 'User', 'Users', 'Settings',
  'Search', 'Bell', 'CheckCircle', 'AlertCircle', 'FileText', 'Image',
  'Download', 'Upload', 'Edit', 'Trash2', 'Plus', 'Minus', 'X', 'Check',
  'TrendingUp', 'TrendingDown', 'BarChart', 'BarChart3', 'LineChart',
  'PieChart', 'Activity', 'Target', 'Zap', 'Star', 'Heart', 'ThumbsUp',
  'ThumbsDown', 'Eye', 'EyeOff', 'Lock', 'Unlock', 'Globe', 'MapPin',
  'Home', 'Building', 'Car', 'Plane', 'Train', 'Ship', 'Bike'
];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];
    
    // Check if it's a React component file
    if (!content.includes('from \'lucide-react\'') && !content.includes('from "lucide-react"')) {
      return issues;
    }
    
    // Extract imported icons
    const importMatches = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g);
    const importedIcons = new Set();
    
    if (importMatches) {
      importMatches.forEach(match => {
        const iconsPart = match.match(/\{([^}]+)\}/)[1];
        const icons = iconsPart.split(',').map(icon => icon.trim());
        icons.forEach(icon => {
          // Handle aliases like "BarChart as BarChartIcon"
          const cleanIcon = icon.split(' as ')[0].trim();
          importedIcons.add(cleanIcon);
        });
      });
    }
    
    // Check for icon usage without imports
    commonIcons.forEach(icon => {
      if (!importedIcons.has(icon)) {
        // Look for usage patterns
        const usagePatterns = [
          new RegExp(`case\\s+['"](\\w+)['"]\\s*:\\s*return\\s+${icon}\\s*[;,]`, 'g'),
          new RegExp(`icon:\\s*${icon}\\s*[,}]`, 'g'),
          new RegExp(`<${icon}\\s`, 'g'),
          new RegExp(`\\b${icon}\\s*\\\(`, 'g')
        ];
        
        usagePatterns.forEach((pattern, patternIndex) => {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            const lineContent = lines[lineNumber - 1].trim();
            
            issues.push({
              file: filePath,
              line: lineNumber,
              icon: icon,
              content: lineContent,
              type: ['case return', 'icon property', 'JSX usage', 'function call'][patternIndex]
            });
          }
        });
      }
    });
    
    return issues;
  } catch (error) {
    return [];
  }
}

function scanDirectory(dir, issues = []) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
        scanDirectory(fullPath, issues);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const fileIssues = scanFile(fullPath);
        issues.push(...fileIssues);
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
  
  return issues;
}

// Start scanning from src directory
const srcDir = path.join(process.cwd(), 'src');
const issues = scanDirectory(srcDir);

if (issues.length === 0) {
  console.log('✅ No potential "not defined" icon issues found!');
} else {
  console.log(`⚠️  Found ${issues.length} potential "not defined" icon issues:\n`);
  
  // Group by file
  const issuesByFile = {};
  issues.forEach(issue => {
    if (!issuesByFile[issue.file]) {
      issuesByFile[issue.file] = [];
    }
    issuesByFile[issue.file].push(issue);
  });
  
  Object.keys(issuesByFile).forEach(file => {
    const relativeFile = path.relative(process.cwd(), file);
    console.log(`📄 ${relativeFile}:`);
    
    issuesByFile[file].forEach(issue => {
      console.log(`   Line ${issue.line}: Missing '${issue.icon}' import (${issue.type})`);
      console.log(`   Code: ${issue.content}`);
    });
    console.log('');
  });
  
  console.log('💡 Recommendations:');
  console.log('1. Add missing icon imports to the lucide-react import statements');
  console.log('2. Run this script again after fixing imports');
  console.log('3. Test the application to ensure no runtime errors');
}
