// Test SQLite database connection and create sample data
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users, contacts, deals, tasks } from './shared/schema-sqlite.js';
import { eq } from 'drizzle-orm';

config();

const sqlite = new Database('./smart-crm.db');
const db = drizzle(sqlite);

async function testSQLiteDB() {
  try {
    console.log('🔌 Testing SQLite database connection...');
    
    // Create test user
    const testUser = {
      id: 'test-user-1',
      email: 'test@smartcrm.dev',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      company: 'Smart CRM Test Co.',
      role: 'admin'
    };

    const result = await db.insert(schema.users).values(testUser).returning();
    console.log('✅ Test user created:', result[0].email);

    // Create test contact
    const testContact = {
      id: 'contact-1',
      name: 'Jane Smith',
      email: 'jane@example.com',
      company: 'Example Corp',
      position: 'CEO',
      status: 'prospect',
      userId: testUser.id
    };

    const contactResult = await db.insert(schema.contacts).values(testContact).returning();
    console.log('✅ Test contact created:', contactResult[0].name);

    // Create test deal
    const testDeal = {
      id: 'deal-1',
      title: 'Enterprise Software License',
      value: 25000,
      stage: 'proposal',
      company: 'Example Corp',
      contact: 'Jane Smith',
      contactId: testContact.id,
      probability: 75,
      priority: 'high',
      currency: 'USD',
      userId: testUser.id
    };

    const dealResult = await db.insert(schema.deals).values(testDeal).returning();
    console.log('✅ Test deal created:', dealResult[0].title, '$' + dealResult[0].value);

    // Query all data
    console.log('\n📊 Database Summary:');
    
    const users = await db.select().from(schema.users);
    console.log('👥 Users:', users.length);
    
    const contacts = await db.select().from(schema.contacts);
    console.log('📧 Contacts:', contacts.length);
    
    const deals = await db.select().from(schema.deals);
    console.log('💼 Deals:', deals.length);

    console.log('\n🎉 SQLite database integration successful!');
    sqlite.close();
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    sqlite.close();
    process.exit(1);
  }
}

testSQLiteDB();
