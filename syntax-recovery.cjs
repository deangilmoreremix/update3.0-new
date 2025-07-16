const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Recovery patterns for common syntax issues
const syntaxFixes = [
  // Fix missing semicolons after destructuring/imports
  {
    pattern: /^(\s*)(import\s+[^;]+)(\s*)$/gm,
    replacement: '$1$2;$3'
  },
  // Fix missing semicolons after variable declarations
  {
    pattern: /^(\s*)(const|let|var)\s+([^=\n]+)=([^;\n]+)(\s*)$/gm,
    replacement: '$1$2 $3=$4;$5'
  },
  // Fix missing function declaration syntax
  {
    pattern: /^(\s*)export\s+(?!default|function|const|class)([A-Z][a-zA-Z0-9_]*)\s*=/gm,
    replacement: '$1export const $2 ='
  },
  // Fix malformed React component exports
  {
    pattern: /^(\s*)export\s+([A-Z][a-zA-Z0-9_]*)\s*\(/gm,
    replacement: '$1export const $2 = ('
  }
];

// Files with critical syntax errors that need manual attention
const criticalFiles = [
  'ui/ContextualTour.tsx',
  'ui/ComprehensiveTour.tsx', 
  'ui/EnhancedHelpTooltip.tsx',
  'ui/HelpTooltip.tsx'
];

async function recoverSyntax() {
  console.log('🔧 Starting syntax recovery...');
  
  const files = await getTypeScriptFiles();
  let recoveredCount = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let fixed = content;
      
      // Apply syntax fixes
      for (const fix of syntaxFixes) {
        fixed = fixed.replace(fix.pattern, fix.replacement);
      }
      
      // Check for empty files or files with only whitespace
      if (fixed.trim().length === 0) {
        console.log(`⚠️  Empty file detected: ${file}`);
        continue;
      }
      
      // Only write if changes were made
      if (fixed !== content) {
        fs.writeFileSync(file, fixed);
        recoveredCount++;
        console.log(`✅ Fixed syntax in: ${path.relative(process.cwd(), file)}`);
      }
      
    } catch (error) {
      console.log(`❌ Error processing ${file}: ${error.message}`);
    }
  }
  
  console.log(`\n🎯 Syntax recovery completed: ${recoveredCount} files fixed`);
  
  // Handle critical files
  console.log('\n🚨 Critical files that may need manual review:');
  for (const criticalFile of criticalFiles) {
    const fullPath = path.join(process.cwd(), criticalFile);
    if (fs.existsSync(fullPath)) {
      console.log(`   - ${criticalFile}`);
    }
  }
}

async function getTypeScriptFiles() {
  return new Promise((resolve, reject) => {
    exec('find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v .git', (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      
      const files = stdout.trim().split('\n').filter(file => file.length > 0);
      resolve(files);
    });
  });
}

// Run the recovery
recoverSyntax().catch(console.error);
