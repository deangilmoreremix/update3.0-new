#!/usr/bin/env node

const routes = [
  '/',
  '/dashboard',
  '/contacts',
  '/pipeline',
  '/deals',
  '/leadmanagement',
  '/communication',
  '/ai-tools',
  '/sales-tools',
  '/analytics',
  '/integrations',
  '/settings',
  '/feature-status',
  '/IntelligentLeadAssistant',
  '/ai',
  '/agents',
  '/billing',
  '/filemanagement',
  '/marketing',
  '/whitelabel'
];

const baseUrl = 'http://localhost:5174';

async function testUrls() {
  console.log('🔍 Testing Smart CRM URLs...\n');
  
  const results = [];
  
  for (const route of routes) {
    try {
      const response = await fetch(`${baseUrl}${route}`, {
        method: 'HEAD',
        timeout: 5000
      });
      
      const status = response.status;
      const statusEmoji = status === 200 ? '✅' : status === 404 ? '❌' : '⚠️';
      
      console.log(`${statusEmoji} ${route} - Status: ${status}`);
      results.push({ route, status, working: status === 200 });
      
    } catch (error) {
      console.log(`❌ ${route} - Error: ${error.message}`);
      results.push({ route, status: 'ERROR', working: false, error: error.message });
    }
  }
  
  console.log('\n📊 Summary:');
  const working = results.filter(r => r.working).length;
  const total = results.length;
  console.log(`✅ Working routes: ${working}/${total}`);
  
  const broken = results.filter(r => !r.working);
  if (broken.length > 0) {
    console.log('\n❌ Broken routes:');
    broken.forEach(r => console.log(`   ${r.route} - ${r.status}`));
  }
  
  console.log('\n🌐 Access your Smart CRM at: http://localhost:5174');
  console.log('📈 Feature Status Dashboard: http://localhost:5174/feature-status');
}

// Use node-fetch for older Node versions
if (typeof fetch === 'undefined') {
  (async () => {
    try {
      const { default: fetch } = await import('node-fetch');
      global.fetch = fetch;
      await testUrls();
    } catch (error) {
      console.log('❌ node-fetch not available. Using curl fallback...\n');
      
      // Fallback to curl
      const { spawn } = require('child_process');
      
      for (const route of routes) {
        const curl = spawn('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', `${baseUrl}${route}`]);
        
        curl.stdout.on('data', (data) => {
          const status = data.toString().trim();
          const statusEmoji = status === '200' ? '✅' : status === '404' ? '❌' : '⚠️';
          console.log(`${statusEmoji} ${route} - Status: ${status}`);
        });
      }
    }
  })();
} else {
  testUrls();
}
