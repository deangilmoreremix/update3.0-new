// Express.js# Initialize database
const sqlite = new Database('./smart-crm.db');I Server for Smart CRM (Simplified)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import Database from 'better-sqlite3';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
const sqlite = new Database('./smart-crm.db');
const db = drizzle(sqlite);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// ============= USER ENDPOINTS =============

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    
    if (!user[0]) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user[0]) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user[0]);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= CONTACT ENDPOINTS =============

app.get('/api/contacts', async (req, res) => {
  try {
    const { userId, search, status, sortBy, sortOrder, limit, offset } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    let query = db.select().from(contacts).where(eq(contacts.userId, userId));

    // Add search functionality
    if (search) {
      query = query.where(
        or(
          like(contacts.name, `%${search}%`),
          like(contacts.email, `%${search}%`),
          like(contacts.company, `%${search}%`)
        )
      );
    }

    // Add status filter
    if (status) {
      query = query.where(eq(contacts.status, status));
    }

    // Add sorting
    if (sortBy && contacts[sortBy]) {
      const direction = sortOrder === 'desc' ? desc : asc;
      query = query.orderBy(direction(contacts[sortBy]));
    } else {
      query = query.orderBy(desc(contacts.createdAt));
    }

    // Add pagination
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    if (offset) {
      query = query.offset(parseInt(offset));
    }

    const results = await query;
    res.json(results);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contactData = req.body;
    
    if (!contactData.userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const newContact = await db.insert(contacts).values({
      id: crypto.randomUUID(),
      ...contactData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    res.status(201).json(newContact[0]);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contactData = req.body;
    
    const updatedContact = await db.update(contacts)
      .set({ 
        ...contactData, 
        updatedAt: new Date() 
      })
      .where(eq(contacts.id, id))
      .returning();
    
    if (!updatedContact[0]) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(updatedContact[0]);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.delete(contacts).where(eq(contacts.id, id));
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= DEAL ENDPOINTS =============

app.get('/api/deals', async (req, res) => {
  try {
    const { userId, search, stage, sortBy, sortOrder } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    let query = db.select().from(deals).where(eq(deals.userId, userId));

    // Add filters
    if (stage) {
      query = query.where(eq(deals.stage, stage));
    }

    if (search) {
      query = query.where(
        or(
          like(deals.title, `%${search}%`),
          like(deals.company, `%${search}%`),
          like(deals.contact, `%${search}%`)
        )
      );
    }

    // Add sorting
    if (sortBy && deals[sortBy]) {
      const direction = sortOrder === 'desc' ? desc : asc;
      query = query.orderBy(direction(deals[sortBy]));
    } else {
      query = query.orderBy(desc(deals.createdAt));
    }

    const results = await query;
    res.json(results);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/deals', async (req, res) => {
  try {
    const dealData = req.body;
    
    if (!dealData.userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const newDeal = await db.insert(deals).values({
      id: crypto.randomUUID(),
      ...dealData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    res.status(201).json(newDeal[0]);
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/deals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dealData = req.body;
    
    const updatedDeal = await db.update(deals)
      .set({ 
        ...dealData, 
        updatedAt: new Date() 
      })
      .where(eq(deals.id, id))
      .returning();
    
    if (!updatedDeal[0]) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    
    res.json(updatedDeal[0]);
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/deals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.delete(deals).where(eq(deals.id, id));
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= TASK ENDPOINTS =============

app.get('/api/tasks', async (req, res) => {
  try {
    const { userId, completed, priority } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    let query = db.select().from(tasks).where(eq(tasks.userId, userId));

    if (completed !== undefined) {
      query = query.where(eq(tasks.completed, completed === 'true'));
    }

    if (priority) {
      query = query.where(eq(tasks.priority, priority));
    }

    query = query.orderBy(desc(tasks.createdAt));
    const results = await query;
    res.json(results);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const taskData = req.body;
    
    if (!taskData.userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const newTask = await db.insert(tasks).values({
      id: crypto.randomUUID(),
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    res.status(201).json(newTask[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = req.body;
    
    const updatedTask = await db.update(tasks)
      .set({ 
        ...taskData, 
        updatedAt: new Date() 
      })
      .where(eq(tasks.id, id))
      .returning();
    
    if (!updatedTask[0]) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(updatedTask[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= DASHBOARD ANALYTICS ENDPOINTS =============

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get counts
    const [contactsCount] = await db.select({ count: sql`count(*)` })
      .from(contacts)
      .where(eq(contacts.userId, userId));
      
    const [dealsCount] = await db.select({ count: sql`count(*)` })
      .from(deals)
      .where(eq(deals.userId, userId));
      
    const [tasksCount] = await db.select({ count: sql`count(*)` })
      .from(tasks)
      .where(eq(tasks.userId, userId));
      
    const [completedTasksCount] = await db.select({ count: sql`count(*)` })
      .from(tasks)
      .where(and(eq(tasks.userId, userId), eq(tasks.completed, true)));

    // Calculate total pipeline value
    const [pipelineValue] = await db.select({ 
      total: sql`COALESCE(sum(${deals.value}), 0)` 
    }).from(deals).where(eq(deals.userId, userId));

    res.json({
      totalContacts: parseInt(contactsCount.count),
      totalDeals: parseInt(dealsCount.count),
      totalTasks: parseInt(tasksCount.count),
      completedTasks: parseInt(completedTasksCount.count),
      pipelineValue: parseFloat(pipelineValue.total) || 0,
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Smart CRM API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database: SQLite (./smart-crm.db)`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  sqlite.close();
  process.exit(0);
});
