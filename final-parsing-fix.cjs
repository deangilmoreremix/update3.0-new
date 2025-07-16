const fs = require('fs');
const path = require('path');

// Files with critical parsing errors that need basic structure fixes
const criticalFixes = [
  // Fix files that lost their export statements
  {
    filePath: 'AIToolsProvider.tsx',
    fixes: [
      { find: /^\s*const\s+AIToolsProvider/m, replace: 'export const AIToolsProvider' },
      { find: /^\s*function\s+AIToolsProvider/m, replace: 'export function AIToolsProvider' }
    ]
  },
  {
    filePath: 'AppointmentWidget.tsx', 
    fixes: [
      { find: /^\s*const\s+AppointmentWidget/m, replace: 'export const AppointmentWidget' },
      { find: /^\s*function\s+AppointmentWidget/m, replace: 'export function AppointmentWidget' }
    ]
  },
  {
    filePath: 'ComposioIntegrationsModal.tsx',
    fixes: [
      { find: /^\s*const\s+ComposioIntegrationsModal/m, replace: 'export const ComposioIntegrationsModal' },
      { find: /^\s*function\s+ComposioIntegrationsModal/m, replace: 'export function ComposioIntegrationsModal' }
    ]
  }
];

// Generic fixes for common parsing issues
const genericFixes = [
  // Fix incomplete destructuring assignments
  { find: /(\w+):\s*{\s*$/, replace: '$1: {' },
  // Fix missing commas in object destructuring
  { find: /(\w+)\s+(\w+)\s*=/, replace: '$1, $2 =' },
  // Fix broken property assignments
  { find: /(\w+):\s*(\w+)\s*=\s*([^,\n}]+)(\s*[,}])/, replace: '$1: $2 = $3$4' },
  // Fix incomplete arrow functions
  { find: /=>\s*{\s*$/, replace: '=> {' },
];

async function fixParsingErrors() {
  console.log('🔧 Fixing critical parsing errors...');
  
  let fixCount = 0;
  
  // Apply critical fixes
  for (const { filePath, fixes } of criticalFixes) {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      for (const { find, replace } of fixes) {
        if (content.match(find)) {
          content = content.replace(find, replace);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`✅ Fixed critical parsing in: ${filePath}`);
        fixCount++;
      }
    }
  }
  
  // Apply generic fixes to all TypeScript files
  const allFiles = await getTypeScriptFiles();
  for (const file of allFiles) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;
      
      for (const { find, replace } of genericFixes) {
        const newContent = content.replace(find, replace);
        if (newContent !== content) {
          content = newContent;
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(file, content);
        fixCount++;
      }
      
    } catch (error) {
      console.log(`⚠️  Error processing ${file}: ${error.message}`);
    }
  }
  
  console.log(`\n🎯 Parsing error fixes completed: ${fixCount} files fixed`);
}

async function getTypeScriptFiles() {
  const { exec } = require('child_process');
  return new Promise((resolve, reject) => {
    exec('find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v .git | head -50', (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      
      const files = stdout.trim().split('\n').filter(file => file.length > 0);
      resolve(files);
    });
  });
}

// Run the fixes
fixParsingErrors().catch(console.error);
