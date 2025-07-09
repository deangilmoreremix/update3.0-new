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
import { extractTenant, requireTenant, requireFeature, addTenantContext, type TenantRequest } from "./middleware/tenantMiddleware";
import { handleWebhook } from "./integrations/webhookHandlers";
import { whiteLabelClient } from "./integrations/whiteLabelClient";
import { partnerService } from "./services/partnerService";
import partnersRouter from "./routes/partners";
import featurePackagesRouter from "./routes/feature-packages";
import aiRoutes from "./routes/ai";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable Replit Auth for SSO capabilities
  await setupAuth(app);
  
  // Apply tenant extraction middleware to all routes
  app.use(extractTenant);
  app.use(addTenantContext);

  // Auth routes from Replit Auth setup
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User role endpoint for compatibility
  app.get("/api/auth/user-role", async (req: Request, res: Response) => {
    try {
      // For unauthenticated users, return not authenticated
      if (!req.isAuthenticated()) {
        return res.json({ 
          isAuthenticated: false,
          role: null,
          user: null 
        });
      }

      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.json({ 
          isAuthenticated: false,
          role: null,
          user: null 
        });
      }

      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.json({ 
          isAuthenticated: false,
          role: null,
          user: null 
        });
      }

      res.json({
        isAuthenticated: true,
        role: user.role || 'user',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          role: user.role || 'user',
          subscriptionPlan: 'professional',
          subscriptionStatus: 'active',
          profileImageUrl: user.profileImageUrl
        }
      });
    } catch (error) {
      console.error("Error fetching user role:", error);
      res.status(500).json({ message: "Failed to fetch user role" });
    }
  });

  // Tenant info endpoint
  app.get("/api/tenant/info", requireTenant, async (req: TenantRequest, res: Response) => {
    try {
      const tenantInfo = {
        name: req.tenantContext?.tenantName || "Smart CRM",
        logo: req.tenantContext?.tenantLogo || "/logo.png",
        domain: req.tenantContext?.tenantDomain || "smartcrm.com",
        features: req.tenantContext?.features || [],
        plan: req.tenantContext?.plan || "professional"
      };
      
      res.json(tenantInfo);
    } catch (error) {
      console.error("Error fetching tenant info:", error);
      res.status(500).json({ message: "Failed to fetch tenant info" });
    }
  });

  // Contact routes
  app.get("/api/contacts", async (req: Request, res: Response) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.get("/api/contacts/:id", async (req: Request, res: Response) => {
    try {
      const contact = await storage.getContact(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Error fetching contact:", error);
      res.status(500).json({ message: "Failed to fetch contact" });
    }
  });

  app.post("/api/contacts", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(500).json({ message: "Failed to create contact" });
    }
  });

  app.patch("/api/contacts/:id", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactSchema.partial().parse(req.body);
      const contact = await storage.updateContact(req.params.id, validatedData);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({ message: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteContact(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json({ message: "Contact deleted successfully" });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Deal routes
  app.get("/api/deals", async (req: Request, res: Response) => {
    try {
      const deals = await storage.getDeals();
      console.log("Returning mock deals:", deals.length);
      res.json(deals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.get("/api/deals/:id", async (req: Request, res: Response) => {
    try {
      const deal = await storage.getDeal(req.params.id);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Error fetching deal:", error);
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });

  app.post("/api/deals", async (req: Request, res: Response) => {
    try {
      const validatedData = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(validatedData);
      res.status(201).json(deal);
    } catch (error) {
      console.error("Error creating deal:", error);
      res.status(500).json({ message: "Failed to create deal" });
    }
  });

  app.patch("/api/deals/:id", async (req: Request, res: Response) => {
    try {
      const validatedData = insertDealSchema.partial().parse(req.body);
      const deal = await storage.updateDeal(req.params.id, validatedData);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Error updating deal:", error);
      res.status(500).json({ message: "Failed to update deal" });
    }
  });

  app.delete("/api/deals/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteDeal(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json({ message: "Deal deleted successfully" });
    } catch (error) {
      console.error("Error deleting deal:", error);
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req: Request, res: Response) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(req.params.id, validatedData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteTask(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Business analysis routes
  app.get("/api/business-analysis", async (req: Request, res: Response) => {
    try {
      const analyses = await storage.getBusinessAnalyses();
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching business analyses:", error);
      res.status(500).json({ message: "Failed to fetch business analyses" });
    }
  });

  app.post("/api/business-analysis", async (req: Request, res: Response) => {
    try {
      const validatedData = insertBusinessAnalysisSchema.parse(req.body);
      const analysis = await storage.createBusinessAnalysis(validatedData);
      res.status(201).json(analysis);
    } catch (error) {
      console.error("Error creating business analysis:", error);
      res.status(500).json({ message: "Failed to create business analysis" });
    }
  });

  // Content routes
  app.get("/api/content", async (req: Request, res: Response) => {
    try {
      const content = await storage.getContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post("/api/content", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContentItemSchema.parse(req.body);
      const content = await storage.createContent(validatedData);
      res.status(201).json(content);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({ message: "Failed to create content" });
    }
  });

  // Voice profile routes
  app.get("/api/voice-profiles", async (req: Request, res: Response) => {
    try {
      const profiles = await storage.getVoiceProfiles();
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching voice profiles:", error);
      res.status(500).json({ message: "Failed to fetch voice profiles" });
    }
  });

  app.post("/api/voice-profiles", async (req: Request, res: Response) => {
    try {
      const validatedData = insertVoiceProfileSchema.parse(req.body);
      const profile = await storage.createVoiceProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating voice profile:", error);
      res.status(500).json({ message: "Failed to create voice profile" });
    }
  });

  // Webhooks
  app.post("/webhooks/:provider", handleWebhook);

  // White label routes
  app.get("/api/whitelabel/config", async (req: Request, res: Response) => {
    try {
      const config = await whiteLabelClient.getConfig();
      res.json(config);
    } catch (error) {
      console.error("Error fetching white label config:", error);
      res.status(500).json({ message: "Failed to fetch white label config" });
    }
  });

  // Partner routes
  app.use("/api/partners", partnersRouter);

  // Feature packages routes
  app.use("/api/feature-packages", featurePackagesRouter);

  // AI routes
  app.use("/api/ai", aiRoutes);

  const httpServer = createServer(app);
  return httpServer;
}