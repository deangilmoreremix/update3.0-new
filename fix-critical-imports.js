#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// High-priority files to fix first (core components that affect the entire app)
const priorityFiles = [
  '/App.tsx',
  '/Navbar.tsx',
  '/AIToolsProvider.tsx',
  '/client/src/App.tsx',
  '/client/src/components/layout/ExactNavbar.tsx',
  '/src/components/Navbar.tsx',
  '/modules/dashboard-v3/src/components/dashboard/',
  '/client/src/pages/SuperAdminDashboard.tsx',
];

// Most commonly missing imports that cause immediate runtime errors
const criticalImports = {
  'lucide-react': [
    'Settings', 'Plus', 'Video', 'X', 'User', 'Users', 'Search', 'Mail', 'Phone',
    'Calendar', 'Clock', 'Home', 'Menu', 'ChevronDown', 'ChevronRight', 'Edit',
    'Trash2', 'Save', 'Upload', 'Download', 'FileText', 'BarChart3', 'PieChart',
    'TrendingUp', 'Target', 'Brain', 'Zap', 'MessageSquare', 'Bell', 'Star',
    'ArrowRight', 'CheckCircle', 'XCircle', 'Eye', 'Play', 'Pause'
  ],
  'react-router-dom': [
    'useNavigate', 'useLocation', 'useParams', 'Link', 'Navigate'
  ]
};

function addMissingImports(filePath, missingIcons, missingRouter) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // Handle Lucide React imports
    if (missingIcons.length > 0) {
      const lucideImportRegex = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/;
      const match = content.match(lucideImportRegex);
      
      if (match) {
        // Add to existing import
        const existingIcons = match[1].split(',').map(icon => icon.trim().split(' as ')[0].trim());
        const newIcons = missingIcons.filter(icon => !existingIcons.includes(icon));
        
        if (newIcons.length > 0) {
          const allIcons = [...existingIcons, ...newIcons].sort();
          const newImportLine = `import { ${allIcons.join(', ')} } from 'lucide-react'`;
          content = content.replace(lucideImportRegex, newImportLine);
          modified = true;
        }
      } else {
        // Add new import at the top
        const importLine = `import { ${missingIcons.sort().join(', ')} } from 'lucide-react';\n`;
        // Insert after other imports
        const lines = content.split('\n');
        let insertIndex = 0;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ')) {
            insertIndex = i + 1;
          } else if (lines[i].trim() === '' && insertIndex > 0) {
            break;
          }
        }
        
        lines.splice(insertIndex, 0, importLine);
        content = lines.join('\n');
        modified = true;
      }
    }
    
    // Handle React Router imports
    if (missingRouter.length > 0) {
      const routerImportRegex = /import\s*\{([^}]+)\}\s*from\s*['"]react-router-dom['"]/;
      const match = content.match(routerImportRegex);
      
      if (match) {
        // Add to existing import
        const existingItems = match[1].split(',').map(item => item.trim());
        const newItems = missingRouter.filter(item => !existingItems.includes(item));
        
        if (newItems.length > 0) {
          const allItems = [...existingItems, ...newItems].sort();
          const newImportLine = `import { ${allItems.join(', ')} } from 'react-router-dom'`;
          content = content.replace(routerImportRegex, newImportLine);
          modified = true;
        }
      } else if (missingRouter.length > 0) {
        // Add new import
        const importLine = `import { ${missingRouter.sort().join(', ')} } from 'react-router-dom';\n`;
        const lines = content.split('\n');
        let insertIndex = 0;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ')) {
            insertIndex = i + 1;
          }
        }
        
        lines.splice(insertIndex, 0, importLine);
        content = lines.join('\n');
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    }
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
  
  return false;
}

function fixCriticalFiles() {
  console.log('🔧 Fixing critical missing imports...\n');
  
  const projectRoot = '/workspaces/update3.0-new';
  let fixedFiles = 0;
  
  // Critical files that need immediate fixing
  const criticalFiles = [
    '/App.tsx',
    '/Navbar.tsx', 
    '/client/src/components/layout/ExactNavbar.tsx',
    '/src/components/Navbar.tsx',
    '/client/src/pages/SuperAdminDashboard.tsx',
    '/pages/SuperAdminDashboard.tsx',
    '/AIToolsProvider.tsx'
  ];
  
  for (const file of criticalFiles) {
    const fullPath = path.join(projectRoot, file);
    
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // Check for missing icons
      const missingIcons = [];
      const missingRouter = [];
      
      // Check for common missing icons
      for (const icon of criticalImports['lucide-react']) {
        const iconRegex = new RegExp(`<${icon}[\\s>]|${icon}\\s*size=|${icon}\\s*className=`, 'g');
        if (iconRegex.test(content) && !content.includes(`import.*${icon}.*lucide-react`)) {
          missingIcons.push(icon);
        }
      }
      
      // Check for missing router imports
      for (const routerItem of criticalImports['react-router-dom']) {
        const routerRegex = new RegExp(`${routerItem}\\s*\\(|<${routerItem}[\\s>]`, 'g');
        if (routerRegex.test(content) && !content.includes(`import.*${routerItem}.*react-router`)) {
          missingRouter.push(routerItem);
        }
      }
      
      if (missingIcons.length > 0 || missingRouter.length > 0) {
        const fixed = addMissingImports(fullPath, missingIcons, missingRouter);
        if (fixed) {
          console.log(`✅ Fixed ${file}:`);
          if (missingIcons.length > 0) {
            console.log(`   🎨 Added icons: ${missingIcons.join(', ')}`);
          }
          if (missingRouter.length > 0) {
            console.log(`   🛣️  Added router: ${missingRouter.join(', ')}`);
          }
          fixedFiles++;
        }
      }
    }
  }
  
  console.log(`\n✨ Fixed ${fixedFiles} critical files with missing imports`);
  console.log('\n🚀 Run the build to test the fixes');
}

fixCriticalFiles();
