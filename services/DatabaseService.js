// Database service for contacts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { contacts, users, deals, tasks } from '../shared/schema-sqlite.js';
import { eq, like, desc, asc, and, or, sql } from 'drizzle-orm';

// Initialize database connection
const sqlite = new Database('./smart-crm.db');
const db = drizzle(sqlite);

export class DatabaseService {
  // ============= USER OPERATIONS =============
  
  static async createUser(userData) {
    try {
      const newUser = await db.insert(users).values({
        id: crypto.randomUUID(),
        ...userData,
      }).returning();
      return newUser[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      return user[0] || null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return user[0] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // ============= CONTACT OPERATIONS =============
  
  static async getContacts(userId, options = {}) {
    try {
      let query = db.select().from(contacts).where(eq(contacts.userId, userId));

      // Add search functionality
      if (options.search) {
        query = query.where(
          or(
            like(contacts.name, `%${options.search}%`),
            like(contacts.email, `%${options.search}%`),
            like(contacts.company, `%${options.search}%`)
          )
        );
      }

      // Add status filter
      if (options.status) {
        query = query.where(eq(contacts.status, options.status));
      }

      // Add sorting
      if (options.sortBy) {
        const direction = options.sortOrder === 'desc' ? desc : asc;
        query = query.orderBy(direction(contacts[options.sortBy]));
      } else {
        query = query.orderBy(desc(contacts.createdAt));
      }

      // Add pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.offset(options.offset);
      }

      return await query;
    } catch (error) {
      console.error('Error getting contacts:', error);
      throw error;
    }
  }

  static async createContact(userId, contactData) {
    try {
      const newContact = await db.insert(contacts).values({
        id: crypto.randomUUID(),
        userId,
        ...contactData,
      }).returning();
      return newContact[0];
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  static async updateContact(contactId, contactData) {
    try {
      const updatedContact = await db.update(contacts)
        .set({ ...contactData, updatedAt: new Date() })
        .where(eq(contacts.id, contactId))
        .returning();
      return updatedContact[0];
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  static async deleteContact(contactId) {
    try {
      await db.delete(contacts).where(eq(contacts.id, contactId));
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  // ============= DEAL OPERATIONS =============
  
  static async getDeals(userId, options = {}) {
    try {
      let query = db.select().from(deals).where(eq(deals.userId, userId));

      // Add filters
      if (options.stage) {
        query = query.where(eq(deals.stage, options.stage));
      }

      if (options.search) {
        query = query.where(
          or(
            like(deals.title, `%${options.search}%`),
            like(deals.company, `%${options.search}%`),
            like(deals.contact, `%${options.search}%`)
          )
        );
      }

      // Add sorting
      if (options.sortBy) {
        const direction = options.sortOrder === 'desc' ? desc : asc;
        query = query.orderBy(direction(deals[options.sortBy]));
      } else {
        query = query.orderBy(desc(deals.createdAt));
      }

      return await query;
    } catch (error) {
      console.error('Error getting deals:', error);
      throw error;
    }
  }

  static async createDeal(userId, dealData) {
    try {
      const newDeal = await db.insert(deals).values({
        id: crypto.randomUUID(),
        userId,
        ...dealData,
      }).returning();
      return newDeal[0];
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  }

  static async updateDeal(dealId, dealData) {
    try {
      const updatedDeal = await db.update(deals)
        .set({ ...dealData, updatedAt: new Date() })
        .where(eq(deals.id, dealId))
        .returning();
      return updatedDeal[0];
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  }

  static async deleteDeal(dealId) {
    try {
      await db.delete(deals).where(eq(deals.id, dealId));
      return true;
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  }

  // ============= TASK OPERATIONS =============
  
  static async getTasks(userId, options = {}) {
    try {
      let query = db.select().from(tasks).where(eq(tasks.userId, userId));

      if (options.completed !== undefined) {
        query = query.where(eq(tasks.completed, options.completed));
      }

      if (options.priority) {
        query = query.where(eq(tasks.priority, options.priority));
      }

      query = query.orderBy(desc(tasks.createdAt));
      return await query;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  }

  static async createTask(userId, taskData) {
    try {
      const newTask = await db.insert(tasks).values({
        id: crypto.randomUUID(),
        userId,
        ...taskData,
      }).returning();
      return newTask[0];
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  static async updateTask(taskId, taskData) {
    try {
      const updatedTask = await db.update(tasks)
        .set({ ...taskData, updatedAt: new Date() })
        .where(eq(tasks.id, taskId))
        .returning();
      return updatedTask[0];
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  static async deleteTask(taskId) {
    try {
      await db.delete(tasks).where(eq(tasks.id, taskId));
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // ============= ANALYTICS & REPORTING =============
  
  static async getDashboardStats(userId) {
    try {
      const [contactsCount] = await db.select({ count: sql`count(*)` }).from(contacts).where(eq(contacts.userId, userId));
      const [dealsCount] = await db.select({ count: sql`count(*)` }).from(deals).where(eq(deals.userId, userId));
      const [tasksCount] = await db.select({ count: sql`count(*)` }).from(tasks).where(eq(tasks.userId, userId));
      const [completedTasksCount] = await db.select({ count: sql`count(*)` }).from(tasks)
        .where(and(eq(tasks.userId, userId), eq(tasks.completed, true)));

      // Calculate total pipeline value
      const pipelineValue = await db.select({ 
        total: sql`sum(${deals.value})` 
      }).from(deals).where(eq(deals.userId, userId));

      return {
        totalContacts: contactsCount.count,
        totalDeals: dealsCount.count,
        totalTasks: tasksCount.count,
        completedTasks: completedTasksCount.count,
        pipelineValue: pipelineValue[0]?.total || 0,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  // ============= UTILITY METHODS =============
  
  static closeConnection() {
    sqlite.close();
  }
}

export default DatabaseService;
