// Express.js API Server for Smart CRM
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

// ============= CONTACT ENDPOINTS =============

app.get('/api/contacts', async (req, res) => {
  try {
    const { userId, search, status } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    let query = `
      SELECT * FROM contacts 
      WHERE user_id = ?
    `;
    let params = [userId];
    
    if (search) {
      query += ` AND (name LIKE ? OR email LIKE ? OR company LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const contacts = sqlite.prepare(query).all(...params);
    res.json(contacts);
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
    
    const id = crypto.randomUUID();
    const query = `
      INSERT INTO contacts (
        id, user_id, name, email, phone, company, position, 
        status, score, industry, location, notes, favorite
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    sqlite.prepare(query).run(
      id,
      contactData.userId,
      contactData.name,
      contactData.email || null,
      contactData.phone || null,
      contactData.company || null,
      contactData.position || null,
      contactData.status || 'lead',
      contactData.score || null,
      contactData.industry || null,
      contactData.location || null,
      contactData.notes || null,
      contactData.favorite ? 1 : 0
    );
    
    const newContact = sqlite.prepare('SELECT * FROM contacts WHERE id = ?').get(id);
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contactData = req.body;
    
    const query = `
      UPDATE contacts SET 
        name = ?, email = ?, phone = ?, company = ?, position = ?,
        status = ?, score = ?, industry = ?, location = ?, notes = ?, 
        favorite = ?, updated_at = ?
      WHERE id = ?
    `;
    
    const result = sqlite.prepare(query).run(
      contactData.name,
      contactData.email || null,
      contactData.phone || null,
      contactData.company || null,
      contactData.position || null,
      contactData.status || 'lead',
      contactData.score || null,
      contactData.industry || null,
      contactData.location || null,
      contactData.notes || null,
      contactData.favorite ? 1 : 0,
      Date.now(),
      id
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const updatedContact = sqlite.prepare('SELECT * FROM contacts WHERE id = ?').get(id);
    res.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = sqlite.prepare('DELETE FROM contacts WHERE id = ?').run(id);
    
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
    const { userId, search, stage } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    let query = `
      SELECT * FROM deals 
      WHERE user_id = ?
    `;
    let params = [userId];
    
    if (search) {
      query += ` AND (title LIKE ? OR company LIKE ? OR contact LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (stage) {
      query += ` AND stage = ?`;
      params.push(stage);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const deals = sqlite.prepare(query).all(...params);
    res.json(deals);
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
    
    const id = crypto.randomUUID();
    const query = `
      INSERT INTO deals (
        id, user_id, title, value, stage, company, contact, contact_id,
        probability, priority, currency, expected_close_date, notes, days_in_stage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    sqlite.prepare(query).run(
      id,
      dealData.userId,
      dealData.title,
      dealData.value || 0,
      dealData.stage,
      dealData.company,
      dealData.contact,
      dealData.contactId || null,
      dealData.probability || 0,
      dealData.priority || 'medium',
      dealData.currency || 'USD',
      dealData.expectedCloseDate || null,
      dealData.notes || null,
      dealData.daysInStage || 0
    );
    
    const newDeal = sqlite.prepare('SELECT * FROM deals WHERE id = ?').get(id);
    res.status(201).json(newDeal);
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/deals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dealData = req.body;
    
    const query = `
      UPDATE deals SET 
        title = ?, value = ?, stage = ?, company = ?, contact = ?,
        contact_id = ?, probability = ?, priority = ?, currency = ?,
        expected_close_date = ?, notes = ?, days_in_stage = ?, updated_at = ?
      WHERE id = ?
    `;
    
    const result = sqlite.prepare(query).run(
      dealData.title,
      dealData.value || 0,
      dealData.stage,
      dealData.company,
      dealData.contact,
      dealData.contactId || null,
      dealData.probability || 0,
      dealData.priority || 'medium',
      dealData.currency || 'USD',
      dealData.expectedCloseDate || null,
      dealData.notes || null,
      dealData.daysInStage || 0,
      Date.now(),
      id
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    
    const updatedDeal = sqlite.prepare('SELECT * FROM deals WHERE id = ?').get(id);
    res.json(updatedDeal);
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/deals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = sqlite.prepare('DELETE FROM deals WHERE id = ?').run(id);
    
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
    
    let query = `
      SELECT * FROM tasks 
      WHERE user_id = ?
    `;
    let params = [userId];
    
    if (completed !== undefined) {
      query += ` AND completed = ?`;
      params.push(completed === 'true' ? 1 : 0);
    }
    
    if (priority) {
      query += ` AND priority = ?`;
      params.push(priority);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const tasks = sqlite.prepare(query).all(...params);
    res.json(tasks);
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
    
    const id = crypto.randomUUID();
    const query = `
      INSERT INTO tasks (
        id, user_id, title, description, priority, category,
        related_to_type, related_to_id, completed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    sqlite.prepare(query).run(
      id,
      taskData.userId,
      taskData.title,
      taskData.description || null,
      taskData.priority || 'medium',
      taskData.category || 'other',
      taskData.relatedToType || null,
      taskData.relatedToId || null,
      taskData.completed ? 1 : 0
    );
    
    const newTask = sqlite.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = req.body;
    
    const query = `
      UPDATE tasks SET 
        title = ?, description = ?, priority = ?, category = ?,
        related_to_type = ?, related_to_id = ?, completed = ?, updated_at = ?
      WHERE id = ?
    `;
    
    const result = sqlite.prepare(query).run(
      taskData.title,
      taskData.description || null,
      taskData.priority || 'medium',
      taskData.category || 'other',
      taskData.relatedToType || null,
      taskData.relatedToId || null,
      taskData.completed ? 1 : 0,
      Date.now(),
      id
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const updatedTask = sqlite.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = sqlite.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    
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

    const contactsCount = sqlite.prepare('SELECT COUNT(*) as count FROM contacts WHERE user_id = ?').get(userId);
    const dealsCount = sqlite.prepare('SELECT COUNT(*) as count FROM deals WHERE user_id = ?').get(userId);
    const tasksCount = sqlite.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ?').get(userId);
    const completedTasksCount = sqlite.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND completed = 1').get(userId);
    const pipelineValue = sqlite.prepare('SELECT COALESCE(SUM(value), 0) as total FROM deals WHERE user_id = ?').get(userId);

    res.json({
      totalContacts: contactsCount.count,
      totalDeals: dealsCount.count,
      totalTasks: tasksCount.count,
      completedTasks: completedTasksCount.count,
      pipelineValue: pipelineValue.total,
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= USER ENDPOINTS =============

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = sqlite.prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
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
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('  GET    /api/health');
  console.log('  GET    /api/contacts?userId=user_demo');
  console.log('  POST   /api/contacts');
  console.log('  PUT    /api/contacts/:id');
  console.log('  DELETE /api/contacts/:id');
  console.log('  GET    /api/deals?userId=user_demo');
  console.log('  POST   /api/deals');
  console.log('  PUT    /api/deals/:id');
  console.log('  DELETE /api/deals/:id');
  console.log('  GET    /api/tasks?userId=user_demo');
  console.log('  POST   /api/tasks');
  console.log('  PUT    /api/tasks/:id');
  console.log('  DELETE /api/tasks/:id');
  console.log('  GET    /api/dashboard/stats?userId=user_demo');
  console.log('  GET    /api/users/:id');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  sqlite.close();
  process.exit(0);
});
