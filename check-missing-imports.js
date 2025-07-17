#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common Lucide React icons that might be missing
const commonIcons = [
  'Plus', 'Settings', 'Video', 'X', 'User', 'Users', 'Search', 'Mail', 'Phone',
  'Calendar', 'Clock', 'Home', 'Menu', 'ChevronDown', 'ChevronRight', 'ChevronLeft', 'ChevronUp',
  'Edit', 'Delete', 'Trash2', 'Save', 'Upload', 'Download', 'FileText', 'Image',
  'BarChart3', 'PieChart', 'TrendingUp', 'TrendingDown', 'Target', 'Brain', 'Zap',
  'MessageSquare', 'Bell', 'Star', 'Heart', 'Share', 'Copy', 'ExternalLink',
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'MoreHorizontal', 'MoreVertical',
  'CheckCircle', 'AlertTriangle', 'Info', 'XCircle', 'Eye', 'EyeOff',
  'Play', 'Pause', 'Stop', 'Volume2', 'VolumeX', 'Mic', 'MicOff', 'VideoOff',
  'Monitor', 'MonitorOff', 'Minimize2', 'Maximize2', 'RefreshCw', 'RotateCcw'
];

// Common React Router hooks and components
const routerImports = ['useNavigate', 'useLocation', 'useParams', 'Link', 'Navigate'];

// Common context hooks
const contextHooks = ['useNavigation', 'useVideoCall', 'useTheme', 'useAuth'];

function findTsxFiles(dir) {
  const files = [];
  
  function searchDir(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip certain directories
          if (!item.includes('node_modules') && 
              !item.includes('.git') && 
              !item.includes('attached_assets') &&
              !item.includes('dist') &&
              !item.includes('build')) {
            searchDir(fullPath);
          }
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  searchDir(dir);
  return files;
}

function checkFileForMissingImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const issues = [];
    
    // Check for Lucide React icons
    const lucideImportMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/);
    const importedIcons = lucideImportMatch ? 
      lucideImportMatch[1].split(',').map(icon => icon.trim().split(' as ')[0].trim()) : [];
    
    // Check for used icons that aren't imported
    for (const icon of commonIcons) {
      const iconUsageRegex = new RegExp(`<${icon}[\\s>]|${icon}\\s*size=|${icon}\\s*className=`, 'g');
      if (iconUsageRegex.test(content) && !importedIcons.includes(icon)) {
        issues.push({
          type: 'missing-lucide-icon',
          icon: icon,
          line: findLineNumber(content, iconUsageRegex)
        });
      }
    }
    
    // Check for React Router usage
    for (const routerItem of routerImports) {
      const routerRegex = new RegExp(`${routerItem}\\s*\\(|<${routerItem}[\\s>]`, 'g');
      if (routerRegex.test(content) && !content.includes(`import.*${routerItem}.*react-router`)) {
        issues.push({
          type: 'missing-router-import',
          item: routerItem,
          line: findLineNumber(content, routerRegex)
        });
      }
    }
    
    // Check for context hooks
    for (const hook of contextHooks) {
      const hookRegex = new RegExp(`${hook}\\s*\\(`, 'g');
      if (hookRegex.test(content) && !content.includes(`import.*${hook}`)) {
        issues.push({
          type: 'missing-context-hook',
          hook: hook,
          line: findLineNumber(content, hookRegex)
        });
      }
    }
    
    return issues;
  } catch (error) {
    return [];
  }
}

function findLineNumber(content, regex) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) {
      return i + 1;
    }
  }
  return 1;
}

function main() {
  console.log('🔍 Scanning for missing imports...\n');
  
  const projectRoot = '/workspaces/update3.0-new';
  const files = findTsxFiles(projectRoot);
  
  console.log(`Found ${files.length} TypeScript/React files to check\n`);
  
  const allIssues = {};
  let totalIssues = 0;
  
  for (const file of files) {
    const issues = checkFileForMissingImports(file);
    if (issues.length > 0) {
      const relativePath = file.replace(projectRoot, '');
      allIssues[relativePath] = issues;
      totalIssues += issues.length;
    }
  }
  
  // Report findings
  if (totalIssues === 0) {
    console.log('✅ No missing imports detected!');
  } else {
    console.log(`❌ Found ${totalIssues} potential missing imports:\n`);
    
    for (const [file, issues] of Object.entries(allIssues)) {
      console.log(`📁 ${file}`);
      
      for (const issue of issues) {
        switch (issue.type) {
          case 'missing-lucide-icon':
            console.log(`   🎨 Missing Lucide icon: ${issue.icon} (line ~${issue.line})`);
            break;
          case 'missing-router-import':
            console.log(`   🛣️  Missing React Router: ${issue.item} (line ~${issue.line})`);
            break;
          case 'missing-context-hook':
            console.log(`   🔗 Missing context hook: ${issue.hook} (line ~${issue.line})`);
            break;
        }
      }
      console.log('');
    }
    
    // Generate suggested fixes
    console.log('🛠️ Suggested fixes:\n');
    
    const missingLucideIcons = new Set();
    const missingRouterImports = new Set();
    const missingContextHooks = new Set();
    
    for (const issues of Object.values(allIssues)) {
      for (const issue of issues) {
        switch (issue.type) {
          case 'missing-lucide-icon':
            missingLucideIcons.add(issue.icon);
            break;
          case 'missing-router-import':
            missingRouterImports.add(issue.item);
            break;
          case 'missing-context-hook':
            missingContextHooks.add(issue.hook);
            break;
        }
      }
    }
    
    if (missingLucideIcons.size > 0) {
      console.log('Add to Lucide React imports:');
      console.log(`import { ${Array.from(missingLucideIcons).join(', ')} } from 'lucide-react';\n`);
    }
    
    if (missingRouterImports.size > 0) {
      console.log('Add to React Router imports:');
      console.log(`import { ${Array.from(missingRouterImports).join(', ')} } from 'react-router-dom';\n`);
    }
    
    if (missingContextHooks.size > 0) {
      console.log('Missing context hooks (check context provider setup):');
      Array.from(missingContextHooks).forEach(hook => {
        console.log(`- ${hook}`);
      });
    }
  }
}

main();
