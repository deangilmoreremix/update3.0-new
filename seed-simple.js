// Simple database seeder using raw SQL
const Database = require('better-sqlite3');
const db = new Database('./smart-crm.db');

console.log('🌱 Seeding database with sample data...');

try {
  // Insert demo user
  console.log('👤 Adding demo user...');
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (
      id, email, first_name, last_name, full_name, company, role, 
      subscription_status, subscription_plan, is_admin
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertUser.run(
    'user_demo', 'demo@smartcrm.com', 'Demo', 'User', 'Demo User', 
    'Smart CRM', 'admin', 'professional', 'professional', 1
  );

  // Insert sample contacts
  console.log('📋 Adding sample contacts...');
  const insertContact = db.prepare(`
    INSERT OR REPLACE INTO contacts (
      id, name, email, phone, company, position, status, score, 
      industry, location, notes, favorite, user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertContact.run(
    'contact_1', 'Sarah Johnson', 'sarah.johnson@techcorp.com', 
    '+1 (555) 123-4567', 'TechCorp Inc.', 'Chief Technology Officer', 
    'prospect', 85, 'Technology', 'San Francisco, CA', 
    'Interested in enterprise solutions. Follows up consistently.', 0, 'user_demo'
  );
  
  insertContact.run(
    'contact_2', 'Michael Chen', 'michael.chen@innovate.com', 
    '+1 (555) 234-5678', 'Innovate Solutions', 'VP of Sales', 
    'customer', 95, 'Software', 'Austin, TX', 
    'Existing customer, looking to expand services.', 1, 'user_demo'
  );

  insertContact.run(
    'contact_3', 'Emily Rodriguez', 'emily.rodriguez@startup.io', 
    '+1 (555) 345-6789', 'Startup.io', 'Founder & CEO', 
    'lead', 70, 'Fintech', 'New York, NY', 
    'Early stage startup, budget conscious but high potential.', 0, 'user_demo'
  );

  // Insert sample deals
  console.log('💰 Adding sample deals...');
  const insertDeal = db.prepare(`
    INSERT OR REPLACE INTO deals (
      id, title, value, stage, company, contact, contact_id, probability, 
      priority, currency, expected_close_date, notes, days_in_stage, user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertDeal.run(
    'deal_1', 'TechCorp Enterprise License', 75000, 'negotiation', 
    'TechCorp Inc.', 'Sarah Johnson', 'contact_1', 0.8, 'high', 'USD', 
    '2025-08-15', 'Large enterprise deal. Decision expected end of month.', 12, 'user_demo'
  );
  
  insertDeal.run(
    'deal_2', 'Innovate Solutions Expansion', 25000, 'proposal', 
    'Innovate Solutions', 'Michael Chen', 'contact_2', 0.9, 'medium', 'USD', 
    '2025-07-30', 'Expansion of existing contract. Great relationship.', 5, 'user_demo'
  );

  insertDeal.run(
    'deal_3', 'Startup.io Pilot Program', 12000, 'qualification', 
    'Startup.io', 'Emily Rodriguez', 'contact_3', 0.6, 'low', 'USD', 
    '2025-09-01', 'Pilot program to test platform fit.', 8, 'user_demo'
  );

  // Insert sample tasks
  console.log('✅ Adding sample tasks...');
  const insertTask = db.prepare(`
    INSERT OR REPLACE INTO tasks (
      id, title, description, priority, category, related_to_type, 
      related_to_id, completed, user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertTask.run(
    'task_1', 'Follow up with Sarah Johnson', 
    'Send final proposal for TechCorp Enterprise License deal', 
    'high', 'email', 'deal', 'deal_1', 0, 'user_demo'
  );
  
  insertTask.run(
    'task_2', 'Schedule demo with Emily Rodriguez', 
    'Book technical demo for Startup.io pilot program', 
    'medium', 'meeting', 'contact', 'contact_3', 0, 'user_demo'
  );
  
  insertTask.run(
    'task_3', 'Prepare quarterly report', 
    'Compile Q3 sales performance and pipeline analysis', 
    'medium', 'other', null, null, 0, 'user_demo'
  );
  
  insertTask.run(
    'task_4', 'Call Michael Chen', 
    'Discuss expansion timeline and requirements', 
    'high', 'call', 'deal', 'deal_2', 1, 'user_demo'
  );

  // Verify data was inserted
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  const contactCount = db.prepare('SELECT COUNT(*) as count FROM contacts').get();
  const dealCount = db.prepare('SELECT COUNT(*) as count FROM deals').get();
  const taskCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get();

  console.log('\n🎉 Database seeded successfully!');
  console.log('📊 Data summary:');
  console.log(`  - ${userCount.count} users`);
  console.log(`  - ${contactCount.count} contacts`);
  console.log(`  - ${dealCount.count} deals`);
  console.log(`  - ${taskCount.count} tasks`);
  
  console.log('\n🚀 Ready to test with real data!');
  console.log('   Demo user: demo@smartcrm.com');
  
} catch (error) {
  console.error('❌ Error seeding database:', error);
} finally {
  db.close();
}
