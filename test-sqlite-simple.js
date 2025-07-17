// Test SQLite database connection - Simple version
import { config } from 'dotenv';
import Database from 'better-sqlite3';

config();

async function testSQLiteDB() {
  try {
    console.log('🔌 Testing SQLite database connection...');
    
    const sqlite = new Database('./smart-crm.db');
    
    // Test simple query
    const result = sqlite.prepare('SELECT COUNT(*) as count FROM users').get();
    console.log('✅ Database connected successfully!');
    console.log('👥 Users in database:', result.count);

    // Check tables
    const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('📋 Tables in database:', tables.map(t => t.name).join(', '));

    sqlite.close();
    console.log('\n🎉 SQLite database integration successful!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testSQLiteDB();
