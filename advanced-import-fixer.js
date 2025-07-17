#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const projectRoot = '/workspaces/update3.0-new';

// Common patterns for imports that need fixing
const importPatterns = {
  'lucide-react': {
    common: ['Plus', 'Settings', 'Video', 'X', 'User', 'Users', 'Search', 'Mail', 'Phone'],
    ui: ['Calendar', 'Clock', 'Home', 'Menu', 'Bell', 'Star', 'Heart', 'Grid3X3', 'Layout'],
    navigation: ['ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'],
    actions: ['Edit', 'Delete', 'Trash2', 'Save', 'Upload', 'Download', 'Copy', 'Share', 'Send', 'Filter'],
    data: ['BarChart3', 'PieChart', 'TrendingUp', 'TrendingDown', 'Target', 'Activity', 'Database'],
    media: ['Play', 'Pause', 'Stop', 'Volume2', 'VolumeX', 'Mic', 'MicOff', 'VideoOff', 'Camera'],
    files: ['FileText', 'Image', 'Folder', 'FolderPlus', 'File', 'Files', 'Paperclip'],
    feedback: ['CheckCircle', 'AlertTriangle', 'Info', 'XCircle', 'Eye', 'EyeOff', 'AlertCircle', 'Check'],
    advanced: ['Brain', 'Zap', 'MessageSquare', 'RefreshCw', 'RotateCcw', 'Maximize2', 'Minimize2', 'Loader2', 'Spinner'],
    system: ['Power', 'Wifi', 'WifiOff', 'Lock', 'Unlock', 'Shield', 'Key', 'Globe', 'Monitor', 'Smartphone']
  },
  'react-router-dom': ['useNavigate', 'useLocation', 'useParams', 'Link', 'Navigate', 'Outlet', 'NavLink', 'useSearchParams']
};

function getAllIcons() {
  return Object.values(importPatterns['lucide-react']).flat();
}

function fixFileImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    const changes = { icons: [], router: [] };
    
    // Skip if file doesn't contain JSX/TSX content
    if (!content.includes('tsx') && !content.includes('jsx') && !filePath.includes('.tsx') && !filePath.includes('.jsx')) {
      return { modified: false, changes };
    }
    
    // Find missing Lucide React icons
    const allIcons = getAllIcons();
    const missingIcons = [];
    
    // Check for icon usage patterns
    for (const icon of allIcons) {
      const patterns = [
        new RegExp(`<${icon}[\\s/>]`, 'g'),
        new RegExp(`${icon}\\s+size`, 'g'),
        new RegExp(`${icon}\\s+className`, 'g'),
        new RegExp(`{${icon}}`, 'g')
      ];
      
      const isUsed = patterns.some(pattern => pattern.test(content));
      const isImported = content.includes(`import.*${icon}.*lucide-react`) || 
                        content.includes(`import.*{[^}]*${icon}[^}]*}.*lucide-react`);
      
      if (isUsed && !isImported) {
        missingIcons.push(icon);
      }
    }
    
    // Find missing React Router imports
    const routerItems = importPatterns['react-router-dom'];
    const missingRouter = [];
    
    for (const item of routerItems) {
      const patterns = [
        new RegExp(`${item}\\s*\\(`, 'g'),
        new RegExp(`<${item}[\\s/>]`, 'g'),
        new RegExp(`const.*=.*${item}\\(`, 'g')
      ];
      
      const isUsed = patterns.some(pattern => pattern.test(content));
      const isImported = content.includes(`import.*${item}.*react-router`) ||
                        content.includes(`import.*{[^}]*${item}[^}]*}.*react-router`);
      
      if (isUsed && !isImported) {
        missingRouter.push(item);
      }
    }
    
    // Add missing Lucide React imports
    if (missingIcons.length > 0) {
      const lucideImportRegex = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/;
      const match = content.match(lucideImportRegex);
      
      if (match) {
        // Update existing import
        const existingIcons = match[1]
          .split(',')
          .map(icon => icon.trim().split(' as ')[0].trim())
          .filter(icon => icon.length > 0);
        
        const newIcons = missingIcons.filter(icon => !existingIcons.includes(icon));
        
        if (newIcons.length > 0) {
          const allIcons = [...existingIcons, ...newIcons].sort();
          const newImportLine = `import { ${allIcons.join(', ')} } from 'lucide-react'`;
          content = content.replace(lucideImportRegex, newImportLine);
          changes.icons = newIcons;
          modified = true;
        }
      } else {
        // Add new import
        const importLine = `import { ${missingIcons.sort().join(', ')} } from 'lucide-react';\n`;
        content = addImportLine(content, importLine);
        changes.icons = missingIcons;
        modified = true;
      }
    }
    
    // Add missing React Router imports
    if (missingRouter.length > 0) {
      const routerImportRegex = /import\s*\{([^}]+)\}\s*from\s*['"]react-router-dom['"]/;
      const match = content.match(routerImportRegex);
      
      if (match) {
        // Update existing import
        const existingItems = match[1]
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0);
        
        const newItems = missingRouter.filter(item => !existingItems.includes(item));
        
        if (newItems.length > 0) {
          const allItems = [...existingItems, ...newItems].sort();
          const newImportLine = `import { ${allItems.join(', ')} } from 'react-router-dom'`;
          content = content.replace(routerImportRegex, newImportLine);
          changes.router = newItems;
          modified = true;
        }
      } else {
        // Add new import
        const importLine = `import { ${missingRouter.sort().join(', ')} } from 'react-router-dom';\n`;
        content = addImportLine(content, importLine);
        changes.router = missingRouter;
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
    }
    
    return { modified, changes };
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return { modified: false, changes: { icons: [], router: [] } };
  }
}

function addImportLine(content, importLine) {
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // Find the best place to insert the import
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('import ')) {
      insertIndex = i + 1;
    } else if (line.trim() === '' && insertIndex > 0) {
      // Found blank line after imports
      insertIndex = i;
      break;
    } else if (!line.startsWith('import ') && insertIndex > 0) {
      // Found non-import line after imports
      break;
    }
  }
  
  lines.splice(insertIndex, 0, importLine.trimEnd());
  return lines.join('\n');
}

function findReactFiles(dir, maxFiles = 300) {
  const files = [];
  const priorityPaths = ['/src/', '/client/src/', '/components/', '/pages/', '/Dashboard/', '/modules/'];
  
  function searchDir(currentDir, depth = 0) {
    if (depth > 10 || files.length >= maxFiles) return; // Prevent infinite recursion
    
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        if (files.length >= maxFiles) break;
        
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip certain directories
          if (!item.includes('node_modules') && 
              !item.includes('.git') && 
              !item.includes('attached_assets') &&
              !item.includes('dist') &&
              !item.includes('build') &&
              !item.includes('.next')) {
            searchDir(fullPath, depth + 1);
          }
        } else if ((item.endsWith('.tsx') || item.endsWith('.jsx')) && 
                   !item.includes('.backup') &&
                   !item.includes('.temp')) {
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

function main() {
  console.log('🔧 Advanced Import Fixer - BATCH MODE for App Loading Issues...\n');
  
  const files = findReactFiles(projectRoot, 300); // Process 300 files in this aggressive batch
  console.log(`Found ${files.length} React component files to process\n`);
  
  // Prioritize critical files that affect app loading
  const criticalFiles = files.filter(file => {
    const fileName = file.toLowerCase();
    return fileName.includes('app.tsx') || 
           fileName.includes('main.tsx') || 
           fileName.includes('index.tsx') ||
           fileName.includes('navbar') ||
           fileName.includes('router') ||
           fileName.includes('provider') ||
           fileName.includes('dashboard') ||
           fileName.includes('layout');
  });
  
  const regularFiles = files.filter(file => !criticalFiles.includes(file));
  const processingOrder = [...criticalFiles, ...regularFiles];
  
  console.log(`🔥 Processing ${criticalFiles.length} critical files first, then ${regularFiles.length} regular files\n`);
  
  let totalFixed = 0;
  let totalIcons = 0;
  let totalRouter = 0;
  let criticalFixed = 0;
  
  for (const file of processingOrder) {
    const relativePath = file.replace(projectRoot, '');
    const result = fixFileImports(file);
    
    if (result.modified) {
      const isCritical = criticalFiles.includes(file);
      if (isCritical) {
        console.log(`🔥 CRITICAL Fixed ${relativePath}:`);
        criticalFixed++;
      } else {
        console.log(`✅ Fixed ${relativePath}:`);
      }
      
      if (result.changes.icons.length > 0) {
        console.log(`   🎨 Icons: ${result.changes.icons.join(', ')}`);
        totalIcons += result.changes.icons.length;
      }
      
      if (result.changes.router.length > 0) {
        console.log(`   🛣️  Router: ${result.changes.router.join(', ')}`);
        totalRouter += result.changes.router.length;
      }
      
      totalFixed++;
    }
  }
  
  console.log(`\n📊 Batch Processing Summary:`);
  console.log(`   🔥 Critical files fixed: ${criticalFixed}`);
  console.log(`   ✨ Total files fixed: ${totalFixed}`);
  console.log(`   🎨 Icon imports added: ${totalIcons}`);
  console.log(`   🛣️  Router imports added: ${totalRouter}`);
  console.log(`\n🚀 App loading issues should be resolved! Run build to test.`);
}

main();
