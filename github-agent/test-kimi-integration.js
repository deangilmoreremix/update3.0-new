#!/usr/bin/env node

/**
 * Test script for Kimi AI GitHub integration
 */

const { KimiAIAgent } = require('./kimi-integration');

async function testKimiIntegration() {
  console.log('🧪 Testing Kimi AI Integration...');
  
  try {
    const agent = new KimiAIAgent('sk-dDBl3OhTNtprLJB4eurbDL5Vv5YDxkcr02h21mkNuBDIW2kT');
    
    // Test 1: Basic code analysis
    console.log('\n📋 Test 1: Code Analysis');
    const testCode = `
function buggyFunction(data) {
  var result = [];
  for (var i = 0; i <= data.length; i++) {  // Bug: <= should be <
    result.push(data[i].toUpperCase());     // Bug: potential undefined access
  }
  return result;
}`;
    
    const analysis = await agent.analyzeCode(testCode, 'javascript', 'Testing buggy function');
    console.log('✅ Analysis Result:');
    console.log(analysis.choices[0].message.content);
    
    // Test 2: Error debugging
    console.log('\n🔍 Test 2: Error Debugging');
    const errorDebug = await agent.debugError(
      'TypeError: Cannot read property \'toUpperCase\' of undefined',
      testCode,
      'at buggyFunction:4:23'
    );
    console.log('✅ Debug Result:');
    console.log(errorDebug.choices[0].message.content);
    
    // Test 3: Commit message generation
    console.log('\n💬 Test 3: Commit Message Generation');
    const sampleDiff = `
diff --git a/src/utils/helpers.js b/src/utils/helpers.js
index 1234567..abcdefg 100644
--- a/src/utils/helpers.js
+++ b/src/utils/helpers.js
@@ -1,5 +1,8 @@
 function processArray(arr) {
-  return arr.map(item => item.toUpperCase());
+  if (!Array.isArray(arr)) {
+    throw new Error('Input must be an array');
+  }
+  return arr.filter(item => item != null).map(item => item.toUpperCase());
 }`;
    
    const commitMsg = await agent.generateCommitMessage(sampleDiff);
    console.log('✅ Commit Message:');
    console.log(commitMsg.choices[0].message.content);
    
    console.log('\n🎉 All tests passed! Kimi AI integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('401')) {
      console.log('💡 This might be an API key issue. Please check your Kimi AI API key.');
    } else if (error.message.includes('429')) {
      console.log('💡 Rate limit exceeded. Please wait before testing again.');
    }
    
    process.exit(1);
  }
}

// Run tests
testKimiIntegration();
