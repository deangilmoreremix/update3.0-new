#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of files to fix
const filesToFix = [
  'src/components/ComposioIntegrationsModal.tsx',
  'src/components/GoalExecutionModalComplete.tsx',
  'src/components/Landing/FeatureDemo.tsx',
  'src/components/Landing/ParallaxHero.tsx',
  'src/components/PreCallSetup.tsx',
  'src/components/aiTools/AIAssistantChat.tsx',
  'src/components/aiTools/InstantAIResponseGenerator.tsx',
  'src/components/aiTools/RealTimeEmailComposer.tsx',
  'src/components/aiTools/SemanticSearchContent.tsx',
  'src/components/aiTools/SmartSearchRealtime.tsx',
  'src/components/aiTools/StreamingChat.tsx',
  'src/hooks/useSmartAI.ts',
  'src/pages/Appointments.tsx',
  'src/pages/BusinessAnalysis/BusinessAnalyzer.tsx',
  'src/pages/Contacts.tsx',
  'src/pages/ContentLibrary/ContentLibrary.tsx',
  'src/pages/FAQ.tsx',
  'src/pages/FormsAndSurveys.tsx',
  'src/pages/Pipeline.tsx',
  'src/pages/VideoEmail.tsx',
  'src/pages/VoiceProfiles/VoiceProfiles.tsx',
  'src/pages/WhiteLabelCustomization.tsx'
];

function getDependencyIssues(filePath) {
  try {
    const output = execSync(`npx eslint ${filePath} --format=json`, { encoding: 'utf8' });
    const results = JSON.parse(output);
    
    if (results.length > 0) {
      return results[0].messages.filter(msg => msg.ruleId === 'react-hooks/exhaustive-deps');
    }
    return [];
  } catch (error) {
    console.error(`Error checking ${filePath}:`, error.message);
    return [];
  }
}

function fixCommonPatterns(content, filePath) {
  console.log(`\n🔧 Fixing: ${filePath}`);
  
  // Pattern 1: useEffect with missing function dependencies
  content = content.replace(
    /useEffect\(\(\) => \{\s*([^}]*(?:fetch|load|get|set|update|handle)[^}]*)\s*\}, \[\]\)/gs,
    (match, body) => {
      // Extract function calls from the body
      const functionNames = [];
      const functionRegex = /\b(fetch\w+|load\w+|get\w+|set\w+|update\w+|handle\w+)\b/g;
      let funcMatch;
      while ((funcMatch = functionRegex.exec(body)) !== null) {
        if (!functionNames.includes(funcMatch[1])) {
          functionNames.push(funcMatch[1]);
        }
      }
      
      if (functionNames.length > 0) {
        const deps = functionNames.join(', ');
        console.log(`  ✓ Added dependencies: ${deps}`);
        return `useEffect(() => {\n    ${body.trim()}\n  }, [${deps}])`;
      }
      return match;
    }
  );

  // Pattern 2: Functions that should be wrapped in useCallback
  content = content.replace(
    /(\s+)(const\s+(\w+)\s*=\s*(async\s+)?\([^)]*\)\s*=>\s*\{[^}]*\})/g,
    (match, indent, funcDef, funcName, isAsync) => {
      // Don't wrap if already wrapped in useCallback
      if (content.includes(`useCallback(${funcName}`) || content.includes(`${funcName} = useCallback`)) {
        return match;
      }
      
      // Common function patterns that should be memoized
      const shouldMemoize = /^(fetch|load|get|set|update|handle|submit|save|delete|create|send|process)/i.test(funcName);
      
      if (shouldMemoize) {
        console.log(`  ✓ Wrapped ${funcName} in useCallback`);
        return `${indent}const ${funcName} = useCallback(${isAsync || ''}(${funcDef.match(/\(([^)]*)\)/)[1]}) => {${funcDef.match(/\{(.*)\}/s)[1]}}, [])`;
      }
      
      return match;
    }
  );

  // Pattern 3: Add useCallback import if needed
  if (content.includes('useCallback') && !content.includes('import') && !content.includes('useCallback')) {
    content = content.replace(
      /(import.*React.*from\s+['"]react['"])/,
      (match) => {
        if (match.includes('useCallback')) return match;
        
        if (match.includes('{')) {
          return match.replace(/(\{[^}]*)(}\s+from\s+['"]react['"])/, '$1, useCallback$2');
        } else {
          return match.replace(/(import\s+React)(\s+from\s+['"]react['"])/, '$1, { useCallback }$2');
        }
      }
    );
  }

  return content;
}

function processFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const fixedContent = fixCommonPatterns(content, filePath);
    
    if (content !== fixedContent) {
      fs.writeFileSync(fullPath, fixedContent);
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🚀 Starting automated React Hooks dependency fix...\n');
  
  let fixedCount = 0;
  let totalFiles = filesToFix.length;
  
  for (const filePath of filesToFix) {
    const issues = getDependencyIssues(filePath);
    if (issues.length > 0) {
      console.log(`📋 Issues found in ${filePath}:`);
      issues.forEach(issue => {
        console.log(`   Line ${issue.line}: ${issue.message}`);
      });
      
      if (processFile(filePath)) {
        fixedCount++;
      }
    } else {
      console.log(`✅ No issues in: ${filePath}`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total files processed: ${totalFiles}`);
  console.log(`   Files with fixes applied: ${fixedCount}`);
  console.log(`   Files already clean: ${totalFiles - fixedCount}`);
  
  // Run final verification
  console.log('\n🧪 Running final verification...');
  try {
    execSync('npm run build', { encoding: 'utf8', stdio: 'inherit' });
    console.log('\n✅ Build successful! All fixes appear to be working.');
  } catch (error) {
    console.log('\n❌ Build failed. Some manual fixes may be needed.');
  }
}

main();
