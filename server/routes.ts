import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

// Temporary interfaces for missing dependencies
interface TenantRequest extends Request {
  tenantId?: string;
  tenant?: unknown;
  tenantFeatures?: unknown;
  userId?: string;
}

// Mock implementations for missing dependencies
const extractTenant = (req: Request, res: Response, next: any) => {
  // Mock tenant extraction
  (req as TenantRequest).tenantId = 'default-tenant';
  next();
};

const addTenantContext = (req: Request, res: Response, next: any) => {
  // Mock tenant context
  (req as TenantRequest).tenant = { id: 'default-tenant', name: 'Default Tenant' };
  (req as TenantRequest).tenantFeatures = [];
  next();
};

const requireTenant = (req: Request, res: Response, next: any) => {
  // Mock tenant requirement
  next();
};

const requireFeature = (feature: string) => (req: Request, res: Response, next: any) => {
  // Mock feature requirement
  next();
};

const handleWebhook = async (req: Request, res: Response) => {
  // Mock webhook handler
  res.json({ success: true, message: 'Webhook received' });
};

const whiteLabelClient = {
  getTenant: async (tenantId: string) => ({ id: tenantId, name: 'Mock Tenant' }),
  createTenant: async (data: unknown) => ({ id: 'new-tenant', ...data }),
  updateTenant: async (tenantId: string, data: any) => ({ id: tenantId, ...data }),
  reportUsage: async (tenantId: string, usage: any) => ({ success: true })
};

const partnerService = {
  createPartner: async (data: unknown) => ({ id: 'new-partner', ...data }),
  getPendingPartners: async () => [],
  getActivePartners: async () => [],
  approvePartner: async (partnerId: string) => ({ id: partnerId, status: 'approved' }),
  getPartnerStats: async (partnerId: string) => ({ partnerId, stats: {} }),
  getPartnerCustomers: async (partnerId: string) => [],
  createCustomerForPartner: async (partnerId: string, data: any) => ({ id: 'new-customer', partnerId, ...data })
};

const createWhitelabelUserConfig = (userData: unknown) => ({
  role: 'partner_admin',
  isWhitelabelPartner: true,
  password: 'vr2025',
  partnerConfig: {
    defaultTheme: 'professional',
    brandingEnabled: true,
    customDomainEnabled: false
  }
});

// Mock services for now - implement properly later
const authService = {
  register: async (data: unknown) => {
    console.log('Mock: User registration with whitelabel config:', {
      email: data.email,
      role: data.role,
      isWhitelabelPartner: data.isWhitelabelPartner
    });
    
    return {
      success: true,
      user: { 
        id: `user_${Date.now()}`, 
        email: data.email,
        role: data.role,
        tenantId: data.tenantId,
        isWhitelabelPartner: data.isWhitelabelPartner
      },
      token: `jwt_${Date.now()}`
    };
  }
};

const emailCampaignService = {
  sendWhitelabelWelcomeEmail: async (email: string, firstName: string, dashboardUrl: string, partnerConfig: any) => {
    console.log('Mock: Whitelabel welcome email would be sent to:', email);
    console.log('Mock: Partner config:', partnerConfig);
    return { success: true, messageId: `email_${Date.now()}` };
  }
};

const emailScheduler = {
  scheduleWhitelabelOnboardingSequence: async (userId: string, email: string, firstName: string) => {
    console.log('Mock: Onboarding sequence scheduled for:', email);
    return { success: true, sequenceId: `sequence_${Date.now()}` };
  }
};

// Mock storage for now due to import issues
const storage = {
  getUserByEmail: async (email: string) => {
    console.log('Mock: Getting user by email:', email);
    return { id: 'demo-user-id', email, fullName: 'Demo User' };
  },
  createUser: async (userData: unknown) => {
    console.log('Mock: Creating user:', userData);
    return { id: `user_${Date.now()}`, ...userData };
  },
  getUser: async (id: string) => {
    console.log('Mock: Getting user by id:', id);
    return { id, email: 'user@example.com', fullName: 'Mock User' };
  },
  updateUser: async (id: string, updates: any) => {
    console.log('Mock: Updating user:', id, updates);
    return { id, ...updates };
  },
  getContacts: async (userId: string) => {
    console.log('Mock: Getting contacts for user:', userId);
    return [];
  },
  getContact: async (id: string) => {
    console.log('Mock: Getting contact:', id);
    return { id, name: 'Mock Contact' };
  },
  createContact: async (contactData: unknown) => {
    console.log('Mock: Creating contact:', contactData);
    return { id: `contact_${Date.now()}`, ...contactData };
  },
  updateContact: async (id: string, updates: any) => {
    console.log('Mock: Updating contact:', id, updates);
    return { id, ...updates };
  },
  deleteContact: async (id: string) => {
    console.log('Mock: Deleting contact:', id);
  },
  getDeals: async (userId: string) => {
    console.log('Mock: Getting deals for user:', userId);
    return [];
  },
  getDeal: async (id: string) => {
    console.log('Mock: Getting deal:', id);
    return { id, title: 'Mock Deal' };
  },
  createDeal: async (dealData: unknown) => {
    console.log('Mock: Creating deal:', dealData);
    return { id: `deal_${Date.now()}`, ...dealData };
  },
  updateDeal: async (id: string, updates: any) => {
    console.log('Mock: Updating deal:', id, updates);
    return { id, ...updates };
  },
  deleteDeal: async (id: string) => {
    console.log('Mock: Deleting deal:', id);
  },
  getTasks: async (userId: string) => {
    console.log('Mock: Getting tasks for user:', userId);
    return [];
  },
  getTask: async (id: string) => {
    console.log('Mock: Getting task:', id);
    return { id, title: 'Mock Task' };
  },
  createTask: async (taskData: unknown) => {
    console.log('Mock: Creating task:', taskData);
    return { id: `task_${Date.now()}`, ...taskData };
  },
  updateTask: async (id: string, updates: any) => {
    console.log('Mock: Updating task:', id, updates);
    return { id, ...updates };
  },
  deleteTask: async (id: string) => {
    console.log('Mock: Deleting task:', id);
  },
  getBusinessAnalyses: async (userId: string) => {
    console.log('Mock: Getting business analyses for user:', userId);
    return [];
  },
  createBusinessAnalysis: async (analysisData: unknown) => {
    console.log('Mock: Creating business analysis:', analysisData);
    return { id: `analysis_${Date.now()}`, ...analysisData };
  },
  deleteBusinessAnalysis: async (id: string) => {
    console.log('Mock: Deleting business analysis:', id);
  },
  getContentItems: async (userId: string) => {
    console.log('Mock: Getting content items for user:', userId);
    return [];
  },
  createContentItem: async (itemData: unknown) => {
    console.log('Mock: Creating content item:', itemData);
    return { id: `item_${Date.now()}`, ...itemData };
  },
  deleteContentItem: async (id: string) => {
    console.log('Mock: Deleting content item:', id);
  },
  getVoiceProfiles: async (userId: string) => {
    console.log('Mock: Getting voice profiles for user:', userId);
    return [];
  },
  createVoiceProfile: async (profileData: unknown) => {
    console.log('Mock: Creating voice profile:', profileData);
    return { id: `profile_${Date.now()}`, ...profileData };
  },
  updateVoiceProfile: async (id: string, updates: any) => {
    console.log('Mock: Updating voice profile:', id, updates);
    return { id, ...updates };
  },
  deleteVoiceProfile: async (id: string) => {
    console.log('Mock: Deleting voice profile:', id);
  }
};

// Mock schema validators
const insertUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string(),
  accountStatus: z.string().optional()
});

const insertContactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  status: z.string().optional(),
  score: z.number().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  favorite: z.boolean().optional(),
  userId: z.string()
});

const insertDealSchema = z.object({
  title: z.string(),
  value: z.number().optional(),
  stage: z.string().optional(),
  userId: z.string()
});

const insertTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  userId: z.string()
});

const insertBusinessAnalysisSchema = z.object({
  title: z.string(),
  analysis: z.string(),
  userId: z.string()
});

const insertContentItemSchema = z.object({
  title: z.string(),
  content: z.string(),
  type: z.string().optional(),
  userId: z.string()
});

const insertVoiceProfileSchema = z.object({
  name: z.string(),
  tone: z.string().optional(),
  style: z.string().optional(),
  userId: z.string()
});

// Contact type for TypeScript
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status?: string;
  score?: number;
  industry?: string;
  location?: string;
  notes?: string;
  favorite?: boolean;
  userId: string;
}

// Middleware to extract user ID from request headers or create demo user
const requireAuth = async (req: Request, res: Response, next: any) => {
  let userId = req.headers['x-user-id'] as string;
  
  // If no user ID provided, create or use demo user for development
  if (!userId) {
    try {
      // Try to find existing demo user
      let demoUser = await storage.getUserByEmail('demo@smartcrm.com');
      
      if (!demoUser) {
        // Create demo user if doesn't exist
        demoUser = await storage.createUser({
          email: 'demo@smartcrm.com',
          fullName: 'Demo User'
        });
      }
      
      userId = demoUser.id;
    } catch (error) {
      console.error('Error creating demo user:', error);
      return res.status(500).json({ error: "Authentication setup failed" });
    }
  }
  
  (req as TenantRequest).userId = userId;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply tenant extraction middleware to all routes
  app.use(extractTenant);
  app.use(addTenantContext);

  // White Label Platform Integration Routes
  app.post("/api/webhooks/white-label", handleWebhook);

  // White Label Management Routes (for platform admin)
  app.get("/api/white-label/tenants/:tenantId", async (req: Request, res: Response) => {
    try {
      const { tenantId } = req.params;
      const tenant = await whiteLabelClient.getTenant(tenantId);
      res.json(tenant);
    } catch (error) {
      console.error("Error fetching tenant:", error);
      res.status(500).json({ error: "Failed to fetch tenant" });
    }
  });

  app.post("/api/white-label/tenants", async (req: Request, res: Response) => {
    try {
      const tenant = await whiteLabelClient.createTenant(req.body);
      res.json(tenant);
    } catch (error) {
      console.error("Error creating tenant:", error);
      res.status(500).json({ error: "Failed to create tenant" });
    }
  });

  app.put("/api/white-label/tenants/:tenantId", async (req: Request, res: Response) => {
    try {
      const { tenantId } = req.params;
      const tenant = await whiteLabelClient.updateTenant(tenantId, req.body);
      res.json(tenant);
    } catch (error) {
      console.error("Error updating tenant:", error);
      res.status(500).json({ error: "Failed to update tenant" });
    }
  });

  app.post("/api/white-label/tenants/:tenantId/usage", async (req: Request, res: Response) => {
    try {
      const { tenantId } = req.params;
      await whiteLabelClient.reportUsage(tenantId, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Error reporting usage:", error);
      res.status(500).json({ error: "Failed to report usage" });
    }
  });

  // Phase 2: Partner Management Routes
  app.post("/api/partners/onboard", async (req: Request, res: Response) => {
    try {
      const partner = await partnerService.createPartner(req.body);
      res.json(partner);
    } catch (error) {
      console.error("Error creating partner:", error);
      res.status(500).json({ error: "Failed to create partner" });
    }
  });

  app.get("/api/partners/pending", async (req: Request, res: Response) => {
    try {
      const partners = await partnerService.getPendingPartners();
      res.json(partners);
    } catch (error) {
      console.error("Error fetching pending partners:", error);
      res.status(500).json({ error: "Failed to fetch pending partners" });
    }
  });

  app.get("/api/partners/active", async (req: Request, res: Response) => {
    try {
      const partners = await partnerService.getActivePartners();
      res.json(partners);
    } catch (error) {
      console.error("Error fetching active partners:", error);
      res.status(500).json({ error: "Failed to fetch active partners" });
    }
  });

  app.post("/api/partners/:partnerId/approve", async (req: Request, res: Response) => {
    try {
      const { partnerId } = req.params;
      const partner = await partnerService.approvePartner(partnerId);
      res.json(partner);
    } catch (error) {
      console.error("Error approving partner:", error);
      res.status(500).json({ error: "Failed to approve partner" });
    }
  });

  app.get("/api/partners/:partnerId/stats", async (req: Request, res: Response) => {
    try {
      const { partnerId } = req.params;
      const stats = await partnerService.getPartnerStats(partnerId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching partner stats:", error);
      res.status(500).json({ error: "Failed to fetch partner stats" });
    }
  });

  app.get("/api/partners/:partnerId/customers", async (req: Request, res: Response) => {
    try {
      const { partnerId } = req.params;
      const customers = await partnerService.getPartnerCustomers(partnerId);
      res.json(customers);
    } catch (error) {
      console.error("Error fetching partner customers:", error);
      res.status(500).json({ error: "Failed to fetch partner customers" });
    }
  });

  app.post("/api/partners/:partnerId/customers", async (req: Request, res: Response) => {
    try {
      const { partnerId } = req.params;
      const customer = await partnerService.createCustomerForPartner(partnerId, req.body);
      res.json(customer);
    } catch (error) {
      console.error("Error creating customer for partner:", error);
      res.status(500).json({ error: "Failed to create customer" });
    }
  });

  // Tenant-specific routes (require tenant context)
  app.get("/api/tenant/info", async (req: TenantRequest, res: Response) => {
    try {
      if (!req.tenantId) {
        return res.status(400).json({ error: "Tenant context required" });
      }

      res.json({
        tenantId: req.tenantId,
        tenant: req.tenant,
        features: req.tenantFeatures
      });
    } catch (error) {
      console.error("Error fetching tenant info:", error);
      res.status(500).json({ error: "Failed to fetch tenant info" });
    }
  });

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
  app.get("/api/contacts", async (req: Request, res: Response) => {
    try {
      // For demo purposes, use the demo user we created
      const demoUser = await storage.getUserByEmail("demo@smartcrm.com");
      if (!demoUser) {
        return res.status(404).json({ error: "Demo user not found. Run seed endpoint first." });
      }
      
      const contacts = await storage.getContacts(demoUser.id);
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
        userId: (req as TenantRequest).userId
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
      const deals = await storage.getDeals((req as TenantRequest).userId!);
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
        userId: (req as TenantRequest).userId
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
      const tasks = await storage.getTasks((req as TenantRequest).userId!);
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
        userId: (req as TenantRequest).userId
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
      const analyses = await storage.getBusinessAnalyses((req as TenantRequest).userId!);
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
        userId: (req as TenantRequest).userId
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
      const items = await storage.getContentItems((req as TenantRequest).userId!);
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
        userId: (req as TenantRequest).userId
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
      const profiles = await storage.getVoiceProfiles((req as TenantRequest).userId!);
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
        userId: (req as TenantRequest).userId
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

  // Seed mock contacts endpoint (no auth required for seeding)
  app.post("/api/seed/contacts", async (req: Request, res: Response) => {
    try {
      // First, create or get the demo user
      let demoUser = await storage.getUserByEmail("demo@smartcrm.com");
      if (!demoUser) {
        // User doesn't exist, create it
        demoUser = await storage.createUser({
          fullName: "Demo User",
          email: "demo@smartcrm.com",
          accountStatus: "active"
        });
      }
      
      const mockContacts = [
        {
          name: "Sarah Johnson",
          email: "sarah.johnson@techcorp.com",
          phone: "+1-555-0123",
          company: "TechCorp Industries",
          position: "VP of Sales",
          status: "lead",
          score: 85,
          industry: "Technology",
          location: "San Francisco, CA",
          notes: "Interested in enterprise solutions. Follow up next week.",
          favorite: true,
          userId: demoUser.id
        },
        {
          name: "Michael Chen",
          email: "m.chen@globalfinance.com",
          phone: "+1-555-0124",
          company: "Global Finance LLC",
          position: "CFO",
          status: "prospect",
          score: 92,
          industry: "Finance",
          location: "New York, NY",
          notes: "Budget approved for Q2. Ready to move forward.",
          favorite: false,
          userId: demoUser.id
        },
        {
          name: "Emily Rodriguez",
          email: "emily.r@marketingsolutions.net",
          phone: "+1-555-0125",
          company: "Marketing Solutions",
          position: "Marketing Director",
          status: "customer",
          score: 78,
          industry: "Marketing",
          location: "Austin, TX",
          notes: "Current customer. Looking to expand services.",
          favorite: true,
          userId: demoUser.id
        },
        {
          name: "David Kim",
          email: "david.kim@healthplus.org",
          phone: "+1-555-0126",
          company: "HealthPlus Medical",
          position: "Operations Manager",
          status: "lead",
          score: 65,
          industry: "Healthcare",
          location: "Chicago, IL",
          notes: "Initial contact made. Needs more information about pricing.",
          favorite: false,
          userId: demoUser.id
        },
        {
          name: "Lisa Thompson",
          email: "lisa.thompson@retailchain.com",
          phone: "+1-555-0127",
          company: "Retail Chain Inc",
          position: "Store Manager",
          status: "prospect",
          score: 73,
          industry: "Retail",
          location: "Denver, CO",
          notes: "Interested in loyalty program integration.",
          favorite: false,
          userId: demoUser.id
        },
        {
          name: "James Wilson",
          email: "j.wilson@constructionpro.com",
          phone: "+1-555-0128",
          company: "Construction Pro",
          position: "Project Director",
          status: "lead",
          score: 55,
          industry: "Construction",
          location: "Phoenix, AZ",
          notes: "Initial meeting scheduled for next month.",
          favorite: false,
          userId: demoUser.id
        },
        {
          name: "Maria Garcia",
          email: "maria.garcia@foodservice.com",
          phone: "+1-555-0129",
          company: "Premium Food Service",
          position: "Head Chef",
          status: "customer",
          score: 88,
          industry: "Food & Beverage",
          location: "Miami, FL",
          notes: "Long-term customer. Very satisfied with current services.",
          favorite: true,
          userId: demoUser.id
        },
        {
          name: "Robert Davis",
          email: "r.davis@autoparts.com",
          phone: "+1-555-0130",
          company: "Auto Parts Direct",
          position: "Sales Manager",
          status: "churned",
          score: 25,
          industry: "Automotive",
          location: "Detroit, MI",
          notes: "Contract ended last quarter. Potential for re-engagement.",
          favorite: false,
          userId: demoUser.id
        }
      ];
      
      // Create all mock contacts
      const createdContacts: Contact[] = [];
      for (const contactData of mockContacts) {
        const contact = await storage.createContact(contactData);
        createdContacts.push(contact);
      }

      res.json({ 
        message: `Successfully created ${createdContacts.length} mock contacts`,
        contacts: createdContacts
      });
    } catch (error) {
      console.error("Error seeding contacts:", error);
      res.status(500).json({ error: "Failed to seed contacts" });
    }
  });

  // Updated registration route for whitelabel users
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      // Since ALL users are whitelabel partners, apply whitelabel config
      const whitelabelConfig = createWhitelabelUserConfig({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      });

      // Merge whitelabel config with request body
      const registrationData = {
        ...req.body,
        ...whitelabelConfig,
        // Override password with default whitelabel password if not provided
        password: req.body.password || whitelabelConfig.password
      };

      const result = await authService.register(registrationData);
      
      if (result.success) {
        // Send whitelabel welcome email after successful registration
        try {
          await emailCampaignService.sendWhitelabelWelcomeEmail(
            req.body.email,
            req.body.firstName || 'Partner',
            `${req.protocol}://${req.get('host')}/dashboard`,
            whitelabelConfig.partnerConfig
          );
          
          // Schedule whitelabel onboarding sequence
          await emailScheduler.scheduleWhitelabelOnboardingSequence(
            result.user.id,
            req.body.email,
            req.body.firstName || 'Partner'
          );
        } catch (emailError) {
          console.error('Whitelabel welcome email error:', emailError);
          // Don't fail registration if email fails
        }
        
        res.json({
          ...result,
          message: 'Whitelabel partner account created successfully! Check your email for onboarding instructions.'
        });
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Whitelabel registration error:', error);
      res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
    }
  });

  const server = createServer(app);
  return server;
}
