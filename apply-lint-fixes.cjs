#!/usr/bin/env node

// Automated lint fixes based on manual scan
const fs = require("fs");
const path = require("path");

console.log("🔧 Applying automated lint fixes...");

// Fix @ts-ignore -> @ts-expect-error
function fixTsIgnoreComments() {
  const files = [
    "src/components/TaskCalendar.tsx",
  ];
  
  files.forEach(file => {
    try {
      const filePath = path.join(process.cwd(), file);
      let content = fs.readFileSync(filePath, "utf8");
      content = content.replace(/\/\/\s*@ts-ignore/g, "// @ts-expect-error");
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Fixed @ts-ignore in ${file}`);
    } catch (err) {
      console.log(`❌ Could not fix ${file}: ${err.message}`);
    }
  });
}

// Fix Object.prototype usage
function fixPrototypeBuiltins() {
  const files = [
    "src/components/DealAnalytics.tsx",
  ];
  
  files.forEach(file => {
    try {
      const filePath = path.join(process.cwd(), file);
      let content = fs.readFileSync(filePath, "utf8");
      content = content.replace(/(\w+)\.hasOwnProperty\(/g, "Object.prototype.hasOwnProperty.call($1, ");
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Fixed prototype usage in ${file}`);
    } catch (err) {
      console.log(`❌ Could not fix ${file}: ${err.message}`);
    }
  });
}

// Run fixes
fixTsIgnoreComments();
fixPrototypeBuiltins();

console.log("✅ Automated fixes complete!");