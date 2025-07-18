#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Comprehensive Component Analysis for Build Issues\n');

class ComponentAnalyzer {
  constructor() {
    this.issues = [];
    this.stats = {
      totalFiles: 0,
      withIssues: 0,
      criticalIssues: 0,
      warningIssues: 0
    };
  }

  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const relativeFile = path.relative(process.cwd(), filePath);
      const fileIssues = [];

      this.stats.totalFiles++;

      // 1. Check for missing imports
      this.checkMissingImports(content, lines, relativeFile, fileIssues);
      
      // 2. Check for hooks outside components
      this.checkHooksOutsideComponents(content, lines, relativeFile, fileIssues);
      
      // 3. Check for syntax errors
      this.checkSyntaxErrors(content, lines, relativeFile, fileIssues);
      
      // 4. Check for undefined variables/functions
      this.checkUndefinedUsage(content, lines, relativeFile, fileIssues);
      
      // 5. Check for circular dependencies
      this.checkCircularDependencies(content, lines, relativeFile, fileIssues);
      
      // 6. Check for incomplete JSX
      this.checkIncompleteJSX(content, lines, relativeFile, fileIssues);

      if (fileIssues.length > 0) {
        this.stats.withIssues++;
        this.issues.push({
          file: relativeFile,
          issues: fileIssues
        });
      }

      return fileIssues;
    } catch (error) {
      return [{
        type: 'critical',
        category: 'File Error',
        message: `Cannot read file: ${error.message}`,
        line: 0
      }];
    }
  }

  checkMissingImports(content, lines, file, issues) {
    // Check for common patterns that indicate missing imports
    const importPatterns = [
      { pattern: /import.*from ['"]react['"]/, missing: /useState|useEffect|useCallback|useMemo/, import: 'React hooks' },
      { pattern: /import.*from ['"]lucide-react['"]/, missing: /\b[A-Z][a-zA-Z]*\s*[,;})]/, import: 'Lucide icons' },
      { pattern: /import.*Link.*from ['"]react-router-dom['"]/, missing: /navigate\(|useNavigate/, import: 'useNavigate hook' }
    ];

    importPatterns.forEach(({ pattern, missing, import: importName }) => {
      if (!pattern.test(content) && missing.test(content)) {
        issues.push({
          type: 'critical',
          category: 'Missing Import',
          message: `Possibly missing ${importName} import`,
          line: 1
        });
      }
    });

    // Check for specific undefined usage
    const undefinedPatterns = [
      /\bVideo\b.*[^=]/,
      /\bPhone\b.*[^=]/,
      /\bMail\b.*[^=]/,
      /\bCalendar\b.*[^=]/,
      /\bCheck\b.*[^=]/
    ];

    lines.forEach((line, index) => {
      undefinedPatterns.forEach(pattern => {
        if (pattern.test(line) && !line.includes('import') && !line.includes('=')) {
          const iconName = line.match(/\b(Video|Phone|Mail|Calendar|Check)\b/)?.[1];
          if (iconName && !content.includes(`import.*${iconName}.*from.*lucide-react`)) {
            issues.push({
              type: 'critical',
              category: 'Missing Icon Import',
              message: `${iconName} used but not imported from lucide-react`,
              line: index + 1,
              code: line.trim()
            });
          }
        }
      });
    });
  }

  checkHooksOutsideComponents(content, lines, file, issues) {
    // Check for React hooks called outside component functions
    const hookPatterns = [
      /const\s+\[.*\]\s*=\s*useState/,
      /const\s+.*=\s*useEffect/,
      /const\s+.*=\s*useCallback/,
      /const\s+.*=\s*useMemo/,
      /const\s+.*=\s*useContext/
    ];

    let insideComponent = false;
    let componentDepth = 0;

    lines.forEach((line, index) => {
      // Track if we're inside a component function
      if (/^(export\s+)?(const|function)\s+[A-Z]/.test(line.trim())) {
        insideComponent = true;
        componentDepth = 0;
      }
      
      if (line.includes('{')) componentDepth++;
      if (line.includes('}')) {
        componentDepth--;
        if (componentDepth <= 0) insideComponent = false;
      }

      hookPatterns.forEach(pattern => {
        if (pattern.test(line) && !insideComponent) {
          issues.push({
            type: 'critical',
            category: 'Invalid Hook Usage',
            message: 'React hook called outside component function',
            line: index + 1,
            code: line.trim()
          });
        }
      });
    });
  }

  checkSyntaxErrors(content, lines, file, issues) {
    // Check for common syntax errors
    const syntaxChecks = [
      { pattern: /;;/, message: 'Double semicolon found' },
      { pattern: /}\s*{/, message: 'Possible missing operator between braces' },
      { pattern: /\(\s*\)/, message: 'Empty parentheses - check if intentional' },
      { pattern: /import\s*{[^}]*}[^;]*$/, message: 'Possibly incomplete import statement' },
      { pattern: /export\s*{[^}]*}[^;]*$/, message: 'Possibly incomplete export statement' }
    ];

    lines.forEach((line, index) => {
      syntaxChecks.forEach(({ pattern, message }) => {
        if (pattern.test(line)) {
          issues.push({
            type: 'warning',
            category: 'Syntax Warning',
            message,
            line: index + 1,
            code: line.trim()
          });
        }
      });
    });
  }

  checkUndefinedUsage(content, lines, file, issues) {
    // Check for potentially undefined variables/functions
    const definedVars = new Set();
    const usedVars = new Set();

    // Extract defined variables
    const definePatterns = [
      /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      /let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      /var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g
    ];

    definePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        definedVars.add(match[1]);
      }
    });

    // Extract used variables
    const usePattern = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
    let match;
    while ((match = usePattern.exec(content)) !== null) {
      usedVars.add(match[1]);
    }

    // Check for potentially undefined usage
    usedVars.forEach(varName => {
      if (!definedVars.has(varName) && 
          !content.includes(`import.*${varName}`) &&
          !['console', 'window', 'document', 'alert', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'].includes(varName)) {
        const lineIndex = content.indexOf(varName + '(');
        if (lineIndex !== -1) {
          const lineNumber = content.substring(0, lineIndex).split('\n').length;
          issues.push({
            type: 'warning',
            category: 'Undefined Usage',
            message: `Function '${varName}' used but not defined or imported`,
            line: lineNumber
          });
        }
      }
    });
  }

  checkCircularDependencies(content, lines, file, issues) {
    // Basic check for potential circular dependencies
    const imports = content.match(/import.*from\s+['"]([^'"]+)['"]/g);
    if (imports) {
      imports.forEach(imp => {
        const modulePath = imp.match(/from\s+['"]([^'"]+)['"]/)?.[1];
        if (modulePath && modulePath.startsWith('./') && modulePath.includes(path.basename(file, '.tsx'))) {
          issues.push({
            type: 'warning',
            category: 'Circular Dependency',
            message: `Potential circular dependency: ${modulePath}`,
            line: lines.findIndex(line => line.includes(imp)) + 1
          });
        }
      });
    }
  }

  checkIncompleteJSX(content, lines, file, issues) {
    // Check for incomplete JSX patterns
    let openTags = 0;
    let insideJSX = false;

    lines.forEach((line, index) => {
      if (line.includes('return (') || line.includes('return<')) {
        insideJSX = true;
        openTags = 0;
      }

      if (insideJSX) {
        const openMatches = line.match(/<[^/>][^>]*>/g);
        const closeMatches = line.match(/<\/[^>]*>/g);
        const selfCloseMatches = line.match(/<[^>]*\/>/g);

        if (openMatches) openTags += openMatches.length;
        if (closeMatches) openTags -= closeMatches.length;
        if (selfCloseMatches) {} // Self-closing tags don't affect balance

        if (line.includes(');') && openTags !== 0) {
          issues.push({
            type: 'critical',
            category: 'JSX Structure',
            message: `Unbalanced JSX tags (${openTags} unclosed)`,
            line: index + 1
          });
          insideJSX = false;
        }
      }
    });
  }

  scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
          this.scanDirectory(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          this.analyzeFile(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error.message);
    }
  }

  generateReport() {
    console.log('📊 Analysis Results:\n');
    console.log(`📁 Files analyzed: ${this.stats.totalFiles}`);
    console.log(`⚠️  Files with issues: ${this.stats.withIssues}`);
    
    if (this.issues.length === 0) {
      console.log('✅ No critical build issues found!\n');
      return;
    }

    console.log('\n🚨 Issues Found:\n');

    // Count issues by type
    let criticalCount = 0;
    let warningCount = 0;

    this.issues.forEach(({ file, issues }) => {
      console.log(`📄 ${file}:`);
      
      issues.forEach(issue => {
        const icon = issue.type === 'critical' ? '🚨' : '⚠️';
        console.log(`   ${icon} Line ${issue.line}: [${issue.category}] ${issue.message}`);
        if (issue.code) {
          console.log(`      Code: ${issue.code}`);
        }
        
        if (issue.type === 'critical') criticalCount++;
        else warningCount++;
      });
      console.log('');
    });

    console.log('📋 Summary:');
    console.log(`   🚨 Critical issues: ${criticalCount}`);
    console.log(`   ⚠️  Warning issues: ${warningCount}`);
    console.log(`   📁 Files affected: ${this.stats.withIssues}/${this.stats.totalFiles}`);

    if (criticalCount > 0) {
      console.log('\n💡 Priority Actions:');
      console.log('1. Fix critical issues first (marked with 🚨)');
      console.log('2. Test build after each fix: npm run build');
      console.log('3. Address warnings to improve code quality');
    }
  }
}

// Run the analysis
const analyzer = new ComponentAnalyzer();
const srcDir = path.join(process.cwd(), 'src');

if (fs.existsSync(srcDir)) {
  analyzer.scanDirectory(srcDir);
  analyzer.generateReport();
} else {
  console.error('❌ src directory not found!');
  process.exit(1);
}
