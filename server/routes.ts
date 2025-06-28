import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertContactSchema,
  insertDealSchema,
  insertTaskSchema,
  insertBusinessAnalysisSchema,
  insertContentItemSchema,
  insertVoiceProfileSchema
} from "@shared/schema";
import { z } from "zod";

// Middleware to extract user ID from request headers
const requireAuth = (req: Request, res: Response, next: any) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user ID" });
  }
  req.userId = userId;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Contact routes
  app.get("/api/contacts", requireAuth, async (req: Request, res: Response) => {
    try {
      const contacts = await storage.getContacts(req.userId!);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.get("/api/contacts/:id", async (req: Request, res: Response) => {
    try {
      const contact = await storage.getContact(req.params.id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Error fetching contact:", error);
      res.status(500).json({ error: "Failed to fetch contact" });
    }
  });

  app.post("/api/contacts", requireAuth, async (req: Request, res: Response) => {
    try {
      const contactData = insertContactSchema.parse({
        ...req.body,
        userId: req.userId
      });
      const contact = await storage.createContact(contactData);
      res.json(contact);
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(500).json({ error: "Failed to create contact" });
    }
  });

  app.patch("/api/contacts/:id", async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const contact = await storage.updateContact(req.params.id, updates);
      res.json(contact);
    } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteContact(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // Deal routes
  app.get("/api/deals", requireAuth, async (req: Request, res: Response) => {
    try {
      const deals = await storage.getDeals(req.userId!);
      res.json(deals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ error: "Failed to fetch deals" });
    }
  });

  app.get("/api/deals/:id", async (req: Request, res: Response) => {
    try {
      const deal = await storage.getDeal(req.params.id);
      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Error fetching deal:", error);
      res.status(500).json({ error: "Failed to fetch deal" });
    }
  });

  app.post("/api/deals", requireAuth, async (req: Request, res: Response) => {
    try {
      const dealData = insertDealSchema.parse({
        ...req.body,
        userId: req.userId
      });
      const deal = await storage.createDeal(dealData);
      res.json(deal);
    } catch (error) {
      console.error("Error creating deal:", error);
      res.status(500).json({ error: "Failed to create deal" });
    }
  });

  app.patch("/api/deals/:id", async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const deal = await storage.updateDeal(req.params.id, updates);
      res.json(deal);
    } catch (error) {
      console.error("Error updating deal:", error);
      res.status(500).json({ error: "Failed to update deal" });
    }
  });

  app.delete("/api/deals/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteDeal(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting deal:", error);
      res.status(500).json({ error: "Failed to delete deal" });
    }
  });

  // Task routes
  app.get("/api/tasks", requireAuth, async (req: Request, res: Response) => {
    try {
      const tasks = await storage.getTasks(req.userId!);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", requireAuth, async (req: Request, res: Response) => {
    try {
      const taskData = insertTaskSchema.parse({
        ...req.body,
        userId: req.userId
      });
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const task = await storage.updateTask(req.params.id, updates);
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteTask(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Business Analysis routes
  app.get("/api/business-analysis", requireAuth, async (req: Request, res: Response) => {
    try {
      const analyses = await storage.getBusinessAnalyses(req.userId!);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching business analyses:", error);
      res.status(500).json({ error: "Failed to fetch business analyses" });
    }
  });

  app.post("/api/business-analysis", requireAuth, async (req: Request, res: Response) => {
    try {
      const analysisData = insertBusinessAnalysisSchema.parse({
        ...req.body,
        userId: req.userId
      });
      const analysis = await storage.createBusinessAnalysis(analysisData);
      res.json(analysis);
    } catch (error) {
      console.error("Error creating business analysis:", error);
      res.status(500).json({ error: "Failed to create business analysis" });
    }
  });

  app.delete("/api/business-analysis/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteBusinessAnalysis(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting business analysis:", error);
      res.status(500).json({ error: "Failed to delete business analysis" });
    }
  });

  // Content Items routes
  app.get("/api/content-items", requireAuth, async (req: Request, res: Response) => {
    try {
      const items = await storage.getContentItems(req.userId!);
      res.json(items);
    } catch (error) {
      console.error("Error fetching content items:", error);
      res.status(500).json({ error: "Failed to fetch content items" });
    }
  });

  app.post("/api/content-items", requireAuth, async (req: Request, res: Response) => {
    try {
      const itemData = insertContentItemSchema.parse({
        ...req.body,
        userId: req.userId
      });
      const item = await storage.createContentItem(itemData);
      res.json(item);
    } catch (error) {
      console.error("Error creating content item:", error);
      res.status(500).json({ error: "Failed to create content item" });
    }
  });

  app.delete("/api/content-items/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteContentItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting content item:", error);
      res.status(500).json({ error: "Failed to delete content item" });
    }
  });

  // Voice Profiles routes
  app.get("/api/voice-profiles", requireAuth, async (req: Request, res: Response) => {
    try {
      const profiles = await storage.getVoiceProfiles(req.userId!);
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching voice profiles:", error);
      res.status(500).json({ error: "Failed to fetch voice profiles" });
    }
  });

  app.post("/api/voice-profiles", requireAuth, async (req: Request, res: Response) => {
    try {
      const profileData = insertVoiceProfileSchema.parse({
        ...req.body,
        userId: req.userId
      });
      const profile = await storage.createVoiceProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating voice profile:", error);
      res.status(500).json({ error: "Failed to create voice profile" });
    }
  });

  app.patch("/api/voice-profiles/:id", async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const profile = await storage.updateVoiceProfile(req.params.id, updates);
      res.json(profile);
    } catch (error) {
      console.error("Error updating voice profile:", error);
      res.status(500).json({ error: "Failed to update voice profile" });
    }
  });

  app.delete("/api/voice-profiles/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteVoiceProfile(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting voice profile:", error);
      res.status(500).json({ error: "Failed to delete voice profile" });
    }
  });

  // AI Content Generation route (porting from Supabase Edge Function)
  app.post("/api/ai/generate-content", requireAuth, async (req: Request, res: Response) => {
    try {
      const { contentType, purpose, data, apiKey } = req.body;
      
      // Check for OpenAI API key
      const openaiApiKey = process.env.OPENAI_API_KEY || apiKey;
      
      if (!openaiApiKey) {
        return res.status(400).json({ error: "OpenAI API key is required" });
      }

      let prompt = '';
      let systemMessage = '';

      // Generate prompts based on content type
      switch (contentType) {
        case 'email':
          systemMessage = 'You are a professional email writer. Create engaging, personalized emails.';
          prompt = `Write a professional email for ${purpose} to ${data.contactName || 'the contact'}.`;
          break;
        
        case 'call':
          systemMessage = 'You are a sales call expert. Create effective call scripts.';
          prompt = `Create a professional call script for ${purpose}.`;
          break;
        
        case 'proposal':
          systemMessage = 'You are a business proposal expert. Create compelling proposals.';
          prompt = `Create a professional business proposal for ${purpose}.`;
          break;
        
        default:
          return res.status(400).json({ error: `Unsupported content type: ${contentType}` });
      }

      // Call OpenAI API
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await openaiResponse.json();
      const generatedContent = result.choices[0]?.message?.content;

      if (!generatedContent) {
        throw new Error('No content generated from OpenAI');
      }

      res.json({ 
        result: generatedContent,
        success: true 
      });

    } catch (error) {
      console.error('Error in AI content generation:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Extend Request interface for TypeScript
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
