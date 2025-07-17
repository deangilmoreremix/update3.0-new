// Seed database with sample data
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
// Note: Using simplified insert since we can't import schema in ES modules
// import { users, contacts, deals, tasks } from './shared/schema-sqlite.js';

const sqlite = new Database('./smart-crm.db');
const db = drizzle(sqlite);

const sampleData = {
  users: [
    {
      id: 'user_demo',
      email: 'demo@smartcrm.com',
      firstName: 'Demo',
      lastName: 'User',
      fullName: 'Demo User',
      company: 'Smart CRM',
      role: 'admin',
      subscriptionStatus: 'professional',
      subscriptionPlan: 'professional'
    }
  ],
  
  contacts: [
    {
      id: 'contact_1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Inc.',
      position: 'Chief Technology Officer',
      status: 'prospect',
      score: 85,
      industry: 'Technology',
      location: 'San Francisco, CA',
      notes: 'Interested in enterprise solutions. Follows up consistently.',
      userId: 'user_demo'
    },
    {
      id: 'contact_2',
      name: 'Michael Chen',
      email: 'michael.chen@innovate.com',
      phone: '+1 (555) 234-5678',
      company: 'Innovate Solutions',
      position: 'VP of Sales',
      status: 'customer',
      score: 95,
      industry: 'Software',
      location: 'Austin, TX',
      notes: 'Existing customer, looking to expand services.',
      favorite: true,
      userId: 'user_demo'
    },
    {
      id: 'contact_3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@startup.io',
      phone: '+1 (555) 345-6789',
      company: 'Startup.io',
      position: 'Founder & CEO',
      status: 'lead',
      score: 70,
      industry: 'Fintech',
      location: 'New York, NY',
      notes: 'Early stage startup, budget conscious but high potential.',
      userId: 'user_demo'
    }
  ],
  
  deals: [
    {
      id: 'deal_1',
      title: 'TechCorp Enterprise License',
      value: 75000,
      stage: 'negotiation',
      company: 'TechCorp Inc.',
      contact: 'Sarah Johnson',
      contactId: 'contact_1',
      probability: 0.8,
      priority: 'high',
      currency: 'USD',
      expectedCloseDate: '2025-08-15',
      notes: 'Large enterprise deal. Decision expected end of month.',
      products: ['Enterprise CRM', 'Analytics Suite', 'API Access'],
      nextSteps: ['Send final proposal', 'Schedule executive demo', 'Negotiate terms'],
      daysInStage: 12,
      userId: 'user_demo'
    },
    {
      id: 'deal_2',
      title: 'Innovate Solutions Expansion',
      value: 25000,
      stage: 'proposal',
      company: 'Innovate Solutions',
      contact: 'Michael Chen',
      contactId: 'contact_2',
      probability: 0.9,
      priority: 'medium',
      currency: 'USD',
      expectedCloseDate: '2025-07-30',
      notes: 'Expansion of existing contract. Great relationship.',
      products: ['Additional Licenses', 'Advanced Features'],
      nextSteps: ['Send expansion proposal', 'Review contract terms'],
      daysInStage: 5,
      userId: 'user_demo'
    },
    {
      id: 'deal_3',
      title: 'Startup.io Pilot Program',
      value: 12000,
      stage: 'qualification',
      company: 'Startup.io',
      contact: 'Emily Rodriguez',
      contactId: 'contact_3',
      probability: 0.6,
      priority: 'low',
      currency: 'USD',
      expectedCloseDate: '2025-09-01',
      notes: 'Pilot program to test platform fit.',
      products: ['Basic CRM', 'Startup Package'],
      nextSteps: ['Qualify budget', 'Schedule technical demo'],
      daysInStage: 8,
      userId: 'user_demo'
    }
  ],
  
  tasks: [
    {
      id: 'task_1',
      title: 'Follow up with Sarah Johnson',
      description: 'Send final proposal for TechCorp Enterprise License deal',
      priority: 'high',
      category: 'email',
      relatedToType: 'deal',
      relatedToId: 'deal_1',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      userId: 'user_demo'
    },
    {
      id: 'task_2',
      title: 'Schedule demo with Emily Rodriguez',
      description: 'Book technical demo for Startup.io pilot program',
      priority: 'medium',
      category: 'meeting',
      relatedToType: 'contact',
      relatedToId: 'contact_3',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      userId: 'user_demo'
    },
    {
      id: 'task_3',
      title: 'Prepare quarterly report',
      description: 'Compile Q3 sales performance and pipeline analysis',
      priority: 'medium',
      category: 'other',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      userId: 'user_demo'
    },
    {
      id: 'task_4',
      title: 'Call Michael Chen',
      description: 'Discuss expansion timeline and requirements',
      priority: 'high',
      category: 'call',
      relatedToType: 'deal',
      relatedToId: 'deal_2',
      completed: true,
      userId: 'user_demo'
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');
    
    // Insert users
    console.log('👤 Adding demo users...');
    for (const user of sampleData.users) {
      await db.insert(users).values(user).onConflictDoNothing();
    }
    
    // Insert contacts
    console.log('📋 Adding sample contacts...');
    for (const contact of sampleData.contacts) {
      await db.insert(contacts).values(contact).onConflictDoNothing();
    }
    
    // Insert deals
    console.log('💰 Adding sample deals...');
    for (const deal of sampleData.deals) {
      await db.insert(deals).values(deal).onConflictDoNothing();
    }
    
    // Insert tasks
    console.log('✅ Adding sample tasks...');
    for (const task of sampleData.tasks) {
      await db.insert(tasks).values(task).onConflictDoNothing();
    }
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('📊 Sample data includes:');
    console.log(`  - ${sampleData.users.length} demo user(s)`);
    console.log(`  - ${sampleData.contacts.length} sample contacts`);
    console.log(`  - ${sampleData.deals.length} sample deals`);
    console.log(`  - ${sampleData.tasks.length} sample tasks`);
    
    console.log('\n🚀 Ready to test with real data!');
    console.log('   Demo user: demo@smartcrm.com');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    sqlite.close();
  }
}

seedDatabase();
