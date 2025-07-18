#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔍 Analyzing ESLint issues for Netlify build impact...\n');

// Get ESLint results
let eslintOutput;
try {
  eslintOutput = execSync('npx eslint src/ --max-warnings 0 2>&1', { 
    encoding: 'utf8',
    cwd: process.cwd()
  });
} catch (error) {
  eslintOutput = error.stdout;
}

// Categorize issues by severity for build impact
const categories = {
  'BUILD_BREAKING': [],
  'BUILD_WARNING': [],
  'STYLE_ONLY': []
};

const lines = eslintOutput.split('\n').filter(line => line.trim());

// Rules that typically break builds in strict environments
const buildBreakingRules = [
  '@typescript-eslint/no-unused-expressions',
  '@typescript-eslint/no-require-imports',
  'import/no-unresolved',
  'import/no-duplicates'
];

// Rules that might cause build warnings but usually don't break builds
const buildWarningRules = [
  '@typescript-eslint/no-explicit-any',
  '@typescript-eslint/ban-ts-comment',
  '@typescript-eslint/no-empty-object-type'
];

// Rules that are typically style/code quality only
const styleOnlyRules = [
  '@typescript-eslint/no-unused-vars'
];

let currentFile = '';
let totalErrors = 0;

for (const line of lines) {
  if (line.startsWith('/workspaces/')) {
    currentFile = line.replace('/workspaces/update3.0-new/', '');
  } else if (line.includes('error')) {
    totalErrors++;
    const rule = line.match(/@typescript-eslint\/[a-z-]+/);
    if (rule) {
      const ruleName = rule[0];
      const errorInfo = {
        file: currentFile,
        line: line.trim(),
        rule: ruleName
      };

      if (buildBreakingRules.includes(ruleName)) {
        categories.BUILD_BREAKING.push(errorInfo);
      } else if (buildWarningRules.includes(ruleName)) {
        categories.BUILD_WARNING.push(errorInfo);
      } else if (styleOnlyRules.includes(ruleName)) {
        categories.STYLE_ONLY.push(errorInfo);
      } else {
        categories.BUILD_WARNING.push(errorInfo); // Default to warning
      }
    }
  }
}

// Generate report
console.log('📊 ESLint Issues Analysis for Netlify Build Impact\n');

console.log('🚨 BUILD-BREAKING Issues (Will likely fail Netlify build):');
if (categories.BUILD_BREAKING.length === 0) {
  console.log('   ✅ None found!');
} else {
  categories.BUILD_BREAKING.forEach(issue => {
    console.log(`   ❌ ${issue.file}: ${issue.rule}`);
  });
}

console.log(`\n⚠️  BUILD-WARNING Issues (Might cause warnings): ${categories.BUILD_WARNING.length}`);
if (categories.BUILD_WARNING.length > 0) {
  console.log('   Most common:');
  const warningCounts = {};
  categories.BUILD_WARNING.forEach(issue => {
    warningCounts[issue.rule] = (warningCounts[issue.rule] || 0) + 1;
  });
  Object.entries(warningCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .forEach(([rule, count]) => {
      console.log(`   - ${rule}: ${count} occurrences`);
    });
}

console.log(`\n💅 STYLE-ONLY Issues (Won't break build): ${categories.STYLE_ONLY.length}`);
if (categories.STYLE_ONLY.length > 0) {
  const styleCounts = {};
  categories.STYLE_ONLY.forEach(issue => {
    styleCounts[issue.rule] = (styleCounts[issue.rule] || 0) + 1;
  });
  Object.entries(styleCounts).forEach(([rule, count]) => {
    console.log(`   - ${rule}: ${count} occurrences`);
  });
}

console.log('\n📋 Summary:');
console.log(`   Total ESLint errors: ${totalErrors}`);
console.log(`   Build-breaking: ${categories.BUILD_BREAKING.length}`);
console.log(`   Build-warning: ${categories.BUILD_WARNING.length}`);
console.log(`   Style-only: ${categories.STYLE_ONLY.length}`);

console.log('\n🚀 Netlify Build Prediction:');
if (categories.BUILD_BREAKING.length === 0) {
  console.log('   ✅ LIKELY TO SUCCEED - No build-breaking errors found');
  if (categories.BUILD_WARNING.length > 0) {
    console.log('   ⚠️  May show warnings, but should complete successfully');
  }
} else {
  console.log('   ❌ LIKELY TO FAIL - Build-breaking errors detected');
  console.log('   🔧 Fix build-breaking issues before deploying');
}

console.log('\n💡 Recommendations:');
if (categories.BUILD_BREAKING.length > 0) {
  console.log('   1. Fix build-breaking errors immediately');
}
if (categories.BUILD_WARNING.length > 10) {
  console.log('   2. Consider fixing warning-level issues for cleaner builds');
}
if (categories.STYLE_ONLY.length > 50) {
  console.log('   3. Run "npm run lint:fix" to auto-fix style issues');
}
console.log('   4. Test build locally: npm run build');
