const fs = require('fs');
const path = require('path');

// Files to clean up
const files = [
  'agents/aiAeAgent.ts',
  'agents/aiDialerAgent.ts', 
  'agents/aiJourneysAgent.ts',
  'agents/followUpAgent.ts',
  'agents/leadScoringAgent.ts',
  'agents/meetingsAgent.ts',
  'agents/objectionHandlerAgent.ts',
  'agents/personalizedEmailAgent.ts',
  'agents/reengagementAgent.ts',
  'agents/smartDemoBotAgent.ts',
  'agents/smsCampaignerAgent.ts',
  'agents/voiceAgent.ts',
  'agents/whatsappNurturerAgent.ts',
  'agents/coldOutreachCloserAgent.ts'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove unused imports
    content = content.replace(/import.*callOpenAI.*from.*;\n/g, '');
    content = content.replace(/import.*callGemini.*from.*;\n/g, '');
    
    // Fix function signatures - replace 'any' with proper types
    content = content.replace(/: any\)/g, ': Record<string, unknown>)');
    content = content.replace(/: any,/g, ': Record<string, unknown>,');
    content = content.replace(/: any;/g, ': Record<string, unknown>;');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${file}`);
  }
});

console.log('🎉 Phase 2 complete!');
