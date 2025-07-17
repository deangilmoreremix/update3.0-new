#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const projectRoot = '/workspaces/update3.0-new';

// Comprehensive import patterns for bulk fixing
const bulkImportPatterns = {
  'lucide-react': [
    // Core UI
    'Plus', 'Settings', 'Video', 'X', 'User', 'Users', 'Search', 'Mail', 'Phone',
    'Calendar', 'Clock', 'Home', 'Menu', 'Bell', 'Star', 'Heart', 'Grid3X3', 'Layout',
    // Navigation
    'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
    'MoreHorizontal', 'MoreVertical', 'ExternalLink',
    // Actions
    'Edit', 'Delete', 'Trash2', 'Save', 'Upload', 'Download', 'Copy', 'Share', 'Send', 'Filter',
    // Data & Analytics
    'BarChart3', 'PieChart', 'TrendingUp', 'TrendingDown', 'Target', 'Activity', 'Database',
    // Media
    'Play', 'Pause', 'Stop', 'Volume2', 'VolumeX', 'Mic', 'MicOff', 'VideoOff', 'Camera',
    // Files
    'FileText', 'Image', 'Folder', 'FolderPlus', 'File', 'Files', 'Paperclip',
    // Feedback
    'CheckCircle', 'AlertTriangle', 'Info', 'XCircle', 'Eye', 'EyeOff', 'AlertCircle', 'Check',
    // Advanced
    'Brain', 'Zap', 'MessageSquare', 'RefreshCw', 'RotateCcw', 'Maximize2', 'Minimize2', 'Loader2', 'Spinner',
    // System
    'Power', 'Wifi', 'WifiOff', 'Lock', 'Unlock', 'Shield', 'Key', 'Globe', 'Monitor', 'Smartphone'
  ],
  'react-router-dom': [
    'useNavigate', 'useLocation', 'useParams', 'Link', 'Navigate', 'Outlet', 'NavLink', 'useSearchParams'
  ]
};

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    const changes = { icons: [], router: [] };
    
    // Skip non-React files
    if (!filePath.includes('.tsx') && !filePath.includes('.jsx')) {
      return { modified: false, changes };
    }
    
    // Process Lucide React icons
    const missingIcons = [];
    for (const icon of bulkImportPatterns['lucide-react']) {
      const iconPatterns = [
        new RegExp(`<${icon}[\\s/>]`, 'g'),
        new RegExp(`{${icon}}`, 'g'),
        new RegExp(`${icon}\\s*(?:size|className|color)`, 'g')
      ];
      
      const isUsed = iconPatterns.some(pattern => pattern.test(content));
      const isImported = new RegExp(`import.*{[^}]*\\b${icon}\\b[^}]*}.*['"]lucide-react['"]`).test(content);
      
      if (isUsed && !isImported) {
        missingIcons.push(icon);
      }
    }
    
    // Process React Router imports
    const missingRouter = [];
    for (const item of bulkImportPatterns['react-router-dom']) {
      const routerPatterns = [
        new RegExp(`\\b${item}\\s*\\(`, 'g'),
        new RegExp(`<${item}[\\s/>]`, 'g'),
        new RegExp(`const.*=.*${item}\\(`, 'g')
      ];
      
      const isUsed = routerPatterns.some(pattern => pattern.test(content));
      const isImported = new RegExp(`import.*{[^}]*\\b${item}\\b[^}]*}.*['"]react-router-dom['"]`).test(content);
      
      if (isUsed && !isImported) {
        missingRouter.push(item);
      }
    }
    
    // Add missing Lucide imports
    if (missingIcons.length > 0) {
      const lucideRegex = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/;
      const match = content.match(lucideRegex);
      
      if (match) {
        const existing = match[1].split(',').map(i => i.trim().split(' as ')[0].trim()).filter(i => i);
        const newIcons = missingIcons.filter(icon => !existing.includes(icon));
        
        if (newIcons.length > 0) {
          const allIcons = [...existing, ...newIcons].sort();
          content = content.replace(lucideRegex, `import { ${allIcons.join(', ')} } from 'lucide-react'`);
          changes.icons = newIcons;
          modified = true;
        }
      } else {
        const importLine = `import { ${missingIcons.sort().join(', ')} } from 'lucide-react';\n`;
        content = addImport(content, importLine);
        changes.icons = missingIcons;
        modified = true;
      }
    }
    
    // Add missing Router imports
    if (missingRouter.length > 0) {
      const routerRegex = /import\s*\{([^}]+)\}\s*from\s*['"]react-router-dom['"]/;
      const match = content.match(routerRegex);
      
      if (match) {
        const existing = match[1].split(',').map(i => i.trim()).filter(i => i);
        const newItems = missingRouter.filter(item => !existing.includes(item));
        
        if (newItems.length > 0) {
          const allItems = [...existing, ...newItems].sort();
          content = content.replace(routerRegex, `import { ${allItems.join(', ')} } from 'react-router-dom'`);
          changes.router = newItems;
          modified = true;
        }
      } else {
        const importLine = `import { ${missingRouter.sort().join(', ')} } from 'react-router-dom';\n`;
        content = addImport(content, importLine);
        changes.router = missingRouter;
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
    }
    
    return { modified, changes };
    
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    return { modified: false, changes: { icons: [], router: [] } };
  }
}

function addImport(content, importLine) {
  const lines = content.split('\n');
  let insertIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) {
      insertIndex = i + 1;
    } else if (lines[i].trim() === '' && insertIndex > 0) {
      insertIndex = i;
      break;
    } else if (!lines[i].startsWith('import ') && insertIndex > 0) {
      break;
    }
  }
  
  lines.splice(insertIndex, 0, importLine.trimEnd());
  return lines.join('\n');
}

function getAllReactFiles() {
  try {
    const result = execSync('find . -name "*.tsx" -o -name "*.jsx" | grep -v node_modules | grep -v .git | grep -v dist | head -500', {
      cwd: projectRoot,
      encoding: 'utf-8'
    });
    
    return result.split('\n')
      .filter(f => f.trim())
      .map(f => path.join(projectRoot, f.replace('./', '')));
  } catch (error) {
    console.error('Error finding files:', error.message);
    return [];
  }
}

function main() {
  console.log('🚀 BULK IMPORT FIXER - Processing ALL React files...\n');
  
  const files = getAllReactFiles();
  console.log(`Found ${files.length} React files for bulk processing\n`);
  
  let stats = {
    totalProcessed: 0,
    totalFixed: 0,
    totalIcons: 0,
    totalRouter: 0,
    criticalFixed: 0
  };
  
  for (const file of files) {
    stats.totalProcessed++;
    const relativePath = file.replace(projectRoot + '/', '');
    const result = processFile(file);
    
    if (result.modified) {
      const isCritical = relativePath.toLowerCase().includes('app.tsx') || 
                        relativePath.toLowerCase().includes('main.tsx') ||
                        relativePath.toLowerCase().includes('navbar') ||
                        relativePath.toLowerCase().includes('provider');
      
      if (isCritical) {
        console.log(`🔥 CRITICAL: ${relativePath}`);
        stats.criticalFixed++;
      } else {
        console.log(`✅ Fixed: ${relativePath}`);
      }
      
      if (result.changes.icons.length > 0) {
        console.log(`   🎨 ${result.changes.icons.length} icons: ${result.changes.icons.slice(0,5).join(', ')}${result.changes.icons.length > 5 ? '...' : ''}`);
        stats.totalIcons += result.changes.icons.length;
      }
      
      if (result.changes.router.length > 0) {
        console.log(`   🛣️  ${result.changes.router.length} router: ${result.changes.router.join(', ')}`);
        stats.totalRouter += result.changes.router.length;
      }
      
      stats.totalFixed++;
      
      // Progress indicator
      if (stats.totalProcessed % 50 === 0) {
        console.log(`\n📊 Progress: ${stats.totalProcessed}/${files.length} files processed, ${stats.totalFixed} fixed\n`);
      }
    }
  }
  
  console.log(`\n🎯 BULK PROCESSING COMPLETE:`);
  console.log(`   📁 Total files processed: ${stats.totalProcessed}`);
  console.log(`   ✅ Files fixed: ${stats.totalFixed}`);
  console.log(`   🔥 Critical files fixed: ${stats.criticalFixed}`);
  console.log(`   🎨 Icon imports added: ${stats.totalIcons}`);
  console.log(`   🛣️  Router imports added: ${stats.totalRouter}`);
  console.log(`\n🚀 App should now load without import errors!`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Run: npm run build`);
  console.log(`   2. Test the app locally`);
  console.log(`   3. Commit and deploy if successful`);
}

main();
