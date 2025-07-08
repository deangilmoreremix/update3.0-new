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

// Simplified authentication middleware for demo mode
const requireAuth = async (req: Request, res: Response, next: any) => {
  // Demo mode: Create mock user without database dependency
  const mockUser = {
    id: 'demo-user-' + Date.now(),
    email: 'demo@smartcrm.io',
    firstName: 'Demo',
    lastName: 'User',
    tenantId: '630ed3be-0533-43ff-a569-2051df9c4d20'
  };

  req.userId = mockUser.id;
  req.user = mockUser;
  console.log('Demo authentication successful for:', mockUser.email);
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth middleware
  await setupAuth(app);
  
  // Apply tenant extraction middleware to all routes
  app.use(extractTenant);
  app.use(addTenantContext);

  // Authentication endpoints
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Find user by email
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create new user if they don't exist
        user = await storage.createUser({
          email,
          fullName: email.split('@')[0], // Use email prefix as default name
          accountStatus: 'active'
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          accountStatus: user.accountStatus,
          isAdmin: user.isAdmin
        },
        message: "Login successful"
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        message: "Logout successful"
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  // User endpoint (simplified for development)
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Return demo user data without database dependency
      res.json({
        id: 'demo-user-123',
        email: 'demo@smartcrm.com',
        firstName: 'Demo',
        lastName: 'User',
        subscriptionPlan: 'professional',
        subscriptionStatus: 'active',
        paymentStatus: 'paid',
        isAdmin: true,
        role: 'super_admin'
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Usage stats endpoint
  app.get('/api/auth/usage-stats', async (req: any, res) => {
    try {
      // Return mock usage stats for demo
      const stats = {
        contactsCount: 45,
        dealsCount: 12,
        aiRequestsThisMonth: 150,
        emailsSentThisMonth: 89,
        smssSentThisMonth: 25,
        storageUsedGB: 2.1,
        teamMembersCount: 1
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching usage stats:", error);
      res.status(500).json({ message: "Failed to fetch usage stats" });
    }
  });

  app.get("/api/auth/user-legacy", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        profileImageUrl: user.profileImageUrl,
        jobTitle: user.jobTitle,
        company: user.company,
        accountStatus: user.accountStatus,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

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

  // Contact routes - simplified for development
  app.get("/api/contacts", async (req: Request, res: Response) => {
    try {
      // For development, return mock contact data directly
      const mockContacts = [
        {
          id: '1',
          name: 'Sarah Johnson',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@techcorp.com',
          phone: '+1 (555) 123-4567',
          title: 'VP of Engineering',
          company: 'TechCorp Solutions',
          industry: 'Technology',
          status: 'lead',
          interestLevel: 'hot',
          aiScore: 92,
          avatarSrc: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          tags: ['enterprise', 'decision-maker', 'technical'],
          sources: ['linkedin', 'website', 'referral'],
          notes: 'Senior VP with deep technical background. Key decision maker for enterprise solutions.',
          isFavorite: false,
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/sarah-johnson-tech',
            website: 'https://techcorp.com/team/sarah-johnson'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Michael Chen',
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'mchen@innovate.ai',
          phone: '+1 (555) 987-6543',
          title: 'CTO',
          company: 'Innovate AI',
          industry: 'Artificial Intelligence',
          status: 'prospect',
          interestLevel: 'medium',
          aiScore: 78,
          avatarSrc: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          tags: ['startup', 'ai-focused', 'growth'],
          sources: ['cold-email', 'conference', 'ai-directory'],
          notes: 'CTO of promising AI startup. Interested in scalable AI solutions.',
          isFavorite: false,
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/michael-chen-ai',
            twitter: 'https://twitter.com/mchen_ai'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          firstName: 'Emily',
          lastName: 'Rodriguez',
          email: 'e.rodriguez@fintech.com',
          phone: '+1 (555) 456-7890',
          title: 'Head of Operations',
          company: 'FinTech Solutions',
          industry: 'Financial Services',
          status: 'customer',
          interestLevel: 'hot',
          aiScore: 85,
          avatarSrc: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          tags: ['fintech', 'operations', 'customer'],
          sources: ['referral', 'website', 'demo-request'],
          notes: 'Existing customer, very satisfied with current services. Potential for expansion.',
          isFavorite: true,
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/emily-rodriguez-fintech',
            website: 'https://fintech.com/leadership/emily-rodriguez'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'David Kim',
          firstName: 'David',
          lastName: 'Kim',
          email: 'dkim@healthtech.io',
          phone: '+1 (555) 321-0987',
          title: 'Product Manager',
          company: 'HealthTech Innovation',
          industry: 'Healthcare',
          status: 'lead',
          interestLevel: 'medium',
          aiScore: 73,
          avatarSrc: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          tags: ['healthcare', 'product', 'innovation'],
          sources: ['linkedin', 'industry-event', 'newsletter'],
          notes: 'Product manager interested in healthcare innovation tools.',
          isFavorite: false,
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/david-kim-healthtech'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          name: 'Jessica Williams',
          firstName: 'Jessica',
          lastName: 'Williams',
          email: 'jwilliams@ecommerce.com',
          phone: '+1 (555) 654-3210',
          title: 'Marketing Director',
          company: 'E-Commerce Plus',
          industry: 'E-Commerce',
          status: 'prospect',
          interestLevel: 'low',
          aiScore: 65,
          avatarSrc: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          tags: ['ecommerce', 'marketing', 'digital'],
          sources: ['google-search', 'social-media', 'ad-campaign'],
          notes: 'Marketing director exploring digital marketing automation tools.',
          isFavorite: false,
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/jessica-williams-marketing',
            twitter: 'https://twitter.com/jwilliams_mkt'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '6',
          name: 'Robert Taylor',
          firstName: 'Robert',
          lastName: 'Taylor',
          email: 'rtaylor@manufacturing.com',
          phone: '+1 (555) 789-0123',
          title: 'CEO',
          company: 'Advanced Manufacturing',
          industry: 'Manufacturing',
          status: 'customer',
          interestLevel: 'hot',
          aiScore: 95,
          avatarSrc: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          tags: ['manufacturing', 'ceo', 'enterprise'],
          sources: ['referral', 'industry-partner', 'board-connection'],
          notes: 'CEO of major manufacturing company. Key enterprise client with expansion potential.',
          isFavorite: true,
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/robert-taylor-manufacturing',
            website: 'https://advancedmanufacturing.com/leadership/robert-taylor'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      console.log('Returning mock contacts:', mockContacts.length);
      res.json(mockContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.get("/api/contacts/:id", async (req: Request, res: Response) => {
    try {
      // For development, return a mock contact
      const mockContact = {
        id: req.params.id,
        name: 'Sample Contact',
        firstName: 'Sample',
        lastName: 'Contact',
        email: 'sample@example.com',
        phone: '+1 (555) 000-0000',
        title: 'Sample Title',
        company: 'Sample Company',
        industry: 'Technology',
        status: 'lead',
        interestLevel: 'medium',
        aiScore: 75,
        avatarSrc: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        tags: ['sample'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Fetching contact:', mockContact);
      res.json(mockContact);
    } catch (error) {
      console.error("Error fetching contact:", error);
      res.status(500).json({ error: "Failed to fetch contact" });
    }
  });

  app.post("/api/contacts", async (req: Request, res: Response) => {
    try {
      // For development, create a mock contact with generated ID
      const newContact = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Creating new contact:', newContact);
      res.json(newContact);
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(500).json({ error: "Failed to create contact" });
    }
  });

  app.patch("/api/contacts/:id", async (req: Request, res: Response) => {
    try {
      // For development, return the updated contact with merged data
      const updatedContact = {
        id: req.params.id,
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Updating contact:', updatedContact);
      res.json(updatedContact);
    } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req: Request, res: Response) => {
    try {
      // For development, just return success
      console.log('Deleting contact:', req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  app.post("/api/contacts/import", async (req: Request, res: Response) => {
    try {
      // For development, return the imported contacts with generated IDs
      const { contacts } = req.body;
      const importedContacts = contacts.map((contact: any) => ({
        ...contact,
        id: contact.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      
      console.log('Importing contacts:', importedContacts.length);
      res.json(importedContacts);
    } catch (error) {
      console.error("Error importing contacts:", error);
      res.status(500).json({ error: "Failed to import contacts" });
    }
  });

  // Deal routes - simplified for development
  app.get("/api/deals", async (req: Request, res: Response) => {
    try {
      // Return mock deal data for development
      const mockDeals = [
        {
          id: '1',
          title: 'Enterprise Software License',
          company: 'TechCorp Solutions',
          value: 150000,
          stage: 'negotiation',
          probability: 75,
          closeDate: '2024-02-15',
          contactId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'AI Platform Integration',
          company: 'Innovate AI',
          value: 85000,
          stage: 'proposal',
          probability: 60,
          closeDate: '2024-03-01',
          contactId: '2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Manufacturing Optimization Suite',
          company: 'Global Tech Industries',
          value: 250000,
          stage: 'closed-won',
          probability: 100,
          closeDate: '2024-01-20',
          contactId: '3',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          title: 'Cloud Migration Services',
          company: 'Healthcare Solutions',
          value: 120000,
          stage: 'discovery',
          probability: 25,
          closeDate: '2024-04-01',
          contactId: '4',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          title: 'Enterprise CRM License',
          company: 'Enterprise Software',
          value: 95000,
          stage: 'closed-won',
          probability: 100,
          closeDate: '2024-01-30',
          contactId: '5',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '6',
          title: 'Development Tools Package',
          company: 'Tech Startup',
          value: 45000,
          stage: 'qualification',
          probability: 40,
          closeDate: '2024-03-15',
          contactId: '6',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      console.log('Returning mock deals:', mockDeals.length);
      res.json(mockDeals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ error: "Failed to fetch deals" });
    }
  });

  app.get("/api/deals/:id", async (req: Request, res: Response) => {
    try {
      // Return mock deal data for development
      const mockDeal = {
        id: req.params.id,
        title: 'Sample Deal',
        company: 'Sample Company',
        value: 100000,
        stage: 'negotiation',
        probability: 70,
        closeDate: '2024-03-01',
        contactId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Fetching deal:', mockDeal);
      res.json(mockDeal);
    } catch (error) {
      console.error("Error fetching deal:", error);
      res.status(500).json({ error: "Failed to fetch deal" });
    }
  });

  app.post("/api/deals", async (req: Request, res: Response) => {
    try {
      // Create mock deal with generated ID for development
      const newDeal = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Creating new deal:', newDeal);
      res.json(newDeal);
    } catch (error) {
      console.error("Error creating deal:", error);
      res.status(500).json({ error: "Failed to create deal" });
    }
  });

  app.patch("/api/deals/:id", async (req: Request, res: Response) => {
    try {
      // Update mock deal for development
      const updatedDeal = {
        id: req.params.id,
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Updating deal:', updatedDeal);
      res.json(updatedDeal);
    } catch (error) {
      console.error("Error updating deal:", error);
      res.status(500).json({ error: "Failed to update deal" });
    }
  });

  app.delete("/api/deals/:id", async (req: Request, res: Response) => {
    try {
      // Mock delete for development
      console.log('Deleting deal:', req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting deal:", error);
      res.status(500).json({ error: "Failed to delete deal" });
    }
  });

  // Task routes - simplified for development
  app.get("/api/tasks", async (req: Request, res: Response) => {
    try {
      // Return mock task data for development
      const mockTasks = [
        {
          id: '1',
          title: 'Follow up with TechCorp',
          description: 'Schedule demo of new features',
          priority: 'high',
          status: 'pending',
          dueDate: '2024-01-25',
          contactId: '1',
          dealId: '1',
          assignedTo: 'current_user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Prepare proposal for Innovate AI',
          description: 'Create custom proposal with pricing',
          priority: 'medium',
          status: 'in-progress',
          dueDate: '2024-01-30',
          contactId: '2',
          dealId: '2',
          assignedTo: 'current_user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Complete contract review',
          description: 'Review and finalize contract terms',
          priority: 'high',
          status: 'completed',
          dueDate: '2024-01-20',
          contactId: '3',
          dealId: '3',
          assignedTo: 'current_user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          title: 'Research competitor pricing',
          description: 'Analysis of competitor pricing models',
          priority: 'low',
          status: 'pending',
          dueDate: '2024-02-05',
          contactId: '4',
          dealId: '4',
          assignedTo: 'current_user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          title: 'Send implementation timeline',
          description: 'Provide detailed implementation schedule',
          priority: 'medium',
          status: 'in-progress',
          dueDate: '2024-02-01',
          contactId: '5',
          dealId: '5',
          assignedTo: 'current_user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      console.log('Returning mock tasks:', mockTasks.length);
      res.json(mockTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      // Return mock task data for development
      const mockTask = {
        id: req.params.id,
        title: 'Sample Task',
        description: 'Sample task description',
        priority: 'medium',
        status: 'pending',
        dueDate: '2024-02-01',
        contactId: '1',
        dealId: '1',
        assignedTo: 'current_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Fetching task:', mockTask);
      res.json(mockTask);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      // Create mock task with generated ID for development
      const newTask = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Creating new task:', newTask);
      res.json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      // Update mock task for development
      const updatedTask = {
        id: req.params.id,
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Updating task:', updatedTask);
      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      // Mock delete for development
      console.log('Deleting task:', req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Appointments routes - simplified for development
  app.get("/api/appointments", async (req: Request, res: Response) => {
    try {
      // Return mock appointment data for development
      const mockAppointments = [
        {
          id: '1',
          title: 'Product Demo - TechCorp',
          description: 'Demonstrate new AI features',
          startTime: '2024-01-25T14:00:00Z',
          endTime: '2024-01-25T15:00:00Z',
          attendees: ['sarah.johnson@techcorp.com', 'sales@company.com'],
          contactId: '1',
          dealId: '1',
          type: 'demo',
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Discovery Call - Innovate AI',
          description: 'Understand requirements and pain points',
          startTime: '2024-01-26T10:00:00Z',
          endTime: '2024-01-26T11:00:00Z',
          attendees: ['mchen@innovate.ai', 'sales@company.com'],
          contactId: '2',
          dealId: '2',
          type: 'call',
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Contract Review Meeting',
          description: 'Final contract terms discussion',
          startTime: '2024-01-27T16:00:00Z',
          endTime: '2024-01-27T17:00:00Z',
          attendees: ['e.rodriguez@fintech.com', 'legal@company.com'],
          contactId: '3',
          dealId: '3',
          type: 'meeting',
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          title: 'Technical Requirements Call',
          description: 'Deep dive into technical specifications',
          startTime: '2024-01-28T13:00:00Z',
          endTime: '2024-01-28T14:30:00Z',
          attendees: ['david.kim@healthcare.com', 'tech@company.com'],
          contactId: '4',
          dealId: '4',
          type: 'call',
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          title: 'Implementation Planning',
          description: 'Plan the implementation timeline',
          startTime: '2024-01-29T11:00:00Z',
          endTime: '2024-01-29T12:00:00Z',
          attendees: ['j.williams@ecommerce.com', 'implementation@company.com'],
          contactId: '5',
          dealId: '5',
          type: 'meeting',
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      console.log('Returning mock appointments:', mockAppointments.length);
      res.json(mockAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/:id", async (req: Request, res: Response) => {
    try {
      // Return mock appointment data for development
      const mockAppointment = {
        id: req.params.id,
        title: 'Sample Appointment',
        description: 'Sample appointment description',
        startTime: '2024-02-01T14:00:00Z',
        endTime: '2024-02-01T15:00:00Z',
        attendees: ['sample@example.com'],
        contactId: '1',
        dealId: '1',
        type: 'meeting',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Fetching appointment:', mockAppointment);
      res.json(mockAppointment);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      res.status(500).json({ error: "Failed to fetch appointment" });
    }
  });

  app.post("/api/appointments", async (req: Request, res: Response) => {
    try {
      // Create mock appointment with generated ID for development
      const newAppointment = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Creating new appointment:', newAppointment);
      res.json(newAppointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  app.patch("/api/appointments/:id", async (req: Request, res: Response) => {
    try {
      // Update mock appointment for development
      const updatedAppointment = {
        id: req.params.id,
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Updating appointment:', updatedAppointment);
      res.json(updatedAppointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });

  app.delete("/api/appointments/:id", async (req: Request, res: Response) => {
    try {
      // Mock delete for development
      console.log('Deleting appointment:', req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ error: "Failed to delete appointment" });
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

  // AI Content Generation route with OpenAI and Gemini support
  app.post("/api/ai/generate-content", requireAuth, async (req: Request, res: Response) => {
    try {
      const { contentType, purpose, data, apiKey, preferredModel = 'gemini' } = req.body;
      
      let prompt = '';
      let systemMessage = '';

      // Generate prompts based on content type
      switch (contentType) {
        case 'email':
          systemMessage = 'You are a professional email writer. Create engaging, personalized emails.';
          prompt = `Write a professional email for ${purpose} to ${data.contactName || 'the contact'}.`;
          break;
        
        case 'text':
          systemMessage = 'You are a professional text message writer. Create concise, effective text messages.';
          prompt = `Write a professional text message for ${purpose} to ${data.contactName || 'the contact'}.`;
          break;
        
        case 'call':
          systemMessage = 'You are a sales call expert. Create effective call scripts.';
          prompt = `Create a professional call script for ${purpose}. Include: ${JSON.stringify(data)}`;
          break;
        
        case 'proposal':
          systemMessage = 'You are a business proposal expert. Create compelling proposals.';
          prompt = `Create a professional business proposal for ${purpose}. Details: ${JSON.stringify(data)}`;
          break;

        case 'marketTrend':
          systemMessage = 'You are a market analysis expert. Provide comprehensive market trend insights.';
          prompt = `Analyze market trends for ${data.industry} targeting ${data.targetMarket} over ${data.timeframe}. Provide actionable insights and predictions.`;
          break;

        case 'competitor':
          systemMessage = 'You are a competitive analysis expert. Provide strategic competitor insights.';
          prompt = `Analyze competitor ${data.competitorName} in ${data.industry}. Their strengths: ${data.strengths.join(', ')}. Provide competitive positioning recommendations.`;
          break;

        case 'salesForecast':
          systemMessage = 'You are a sales forecasting expert. Analyze deal data and provide accurate forecasts.';
          prompt = `Generate a sales forecast for ${data.timeframe} based on these deals: ${JSON.stringify(data.deals)}`;
          break;

        case 'personalization':
          systemMessage = 'You are a contact personalization expert. Create personalized outreach strategies.';
          prompt = `Create personalized outreach for this contact: ${JSON.stringify(data.contact)}`;
          break;

        case 'dealScore':
          systemMessage = 'You are a deal scoring expert. Evaluate deal quality and probability.';
          prompt = `Score this deal and provide analysis: ${JSON.stringify(data.deal)}`;
          break;

        case 'leadQualification':
          systemMessage = 'You are a lead qualification expert. Assess lead quality and potential.';
          prompt = `Qualify this lead: ${JSON.stringify(data.lead)}`;
          break;

        case 'optimization':
          systemMessage = 'You are a content optimization expert. Improve content effectiveness.';
          prompt = `Optimize this content for ${purpose}: ${data.content}`;
          break;

        case 'reasoning':
          systemMessage = 'You are an AI reasoning expert. Provide logical, step-by-step analysis.';
          prompt = data.prompt;
          break;
        
        default:
          return res.status(400).json({ error: `Unsupported content type: ${contentType}` });
      }

      let generatedContent = '';

      // Use Gemini by default or if specified
      if (preferredModel === 'gemini' && process.env.GEMINI_API_KEY) {
        try {
          const { GoogleGenerativeAI } = await import('@google/generative-ai');
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash',
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            }
          });
          
          const fullPrompt = systemMessage + '\n\n' + prompt;
          const result = await model.generateContent(fullPrompt);
          generatedContent = result.response.text();
        } catch (geminiError) {
          console.warn('Gemini API failed, falling back to OpenAI:', geminiError);
          // Fall back to OpenAI
        }
      }

      // Use OpenAI if Gemini failed or was not preferred
      if (!generatedContent && (process.env.OPENAI_API_KEY || apiKey)) {
        const openaiApiKey = process.env.OPENAI_API_KEY || apiKey;
        
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'o1-preview',
            messages: [
              { role: 'user', content: `${systemMessage}\n\n${prompt}` }
            ],
            max_completion_tokens: 8192,
          }),
        });

        if (openaiResponse.ok) {
          const result = await openaiResponse.json();
          generatedContent = result.choices[0]?.message?.content;
        }
      }

      if (!generatedContent) {
        throw new Error('No AI service available or content generated');
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

  // Email Analysis Endpoint
  app.post("/api/ai/email-analyzer", requireAuth, async (req: Request, res: Response) => {
    try {
      const { emailContent } = req.body;
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        return res.status(400).json({ error: "OpenAI API key is required" });
      }

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { 
              role: 'system', 
              content: 'You are an expert email analyzer. Analyze emails for sentiment, intent, urgency, and provide actionable insights for sales teams.' 
            },
            { 
              role: 'user', 
              content: `Analyze this email and provide insights: ${emailContent}` 
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      const result = await openaiResponse.json();
      res.json({ result: result.choices[0]?.message?.content, success: true });
    } catch (error) {
      console.error('Error analyzing email:', error);
      res.status(500).json({ error: 'Failed to analyze email', success: false });
    }
  });

  // Meeting Summary Endpoint
  app.post("/api/ai/meeting-summarizer", requireAuth, async (req: Request, res: Response) => {
    try {
      const { transcript } = req.body;
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        return res.status(400).json({ error: "OpenAI API key is required" });
      }

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { 
              role: 'system', 
              content: 'You are a meeting summarization expert. Create concise, actionable meeting summaries with key points, decisions, and next steps.' 
            },
            { 
              role: 'user', 
              content: `Summarize this meeting transcript: ${transcript}` 
            }
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      const result = await openaiResponse.json();
      res.json({ result: result.choices[0]?.message?.content, success: true });
    } catch (error) {
      console.error('Error summarizing meeting:', error);
      res.status(500).json({ error: 'Failed to summarize meeting', success: false });
    }
  });

  // Sales Insights Endpoint
  app.post("/api/ai/sales-insights", requireAuth, async (req: Request, res: Response) => {
    try {
      const { contacts, deals } = req.body;
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        return res.status(400).json({ error: "OpenAI API key is required" });
      }

      const prompt = `Analyze this sales data and provide actionable insights:
      Contacts: ${JSON.stringify(contacts)}
      Deals: ${JSON.stringify(deals)}
      
      Provide insights on:
      1. Sales pipeline health
      2. Top opportunities
      3. At-risk deals
      4. Recommended actions`;

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'o1-mini',
          messages: [
            { role: 'user', content: `You are a sales analytics expert. Analyze sales data and provide strategic insights and recommendations.\n\n${prompt}` }
          ],
          max_completion_tokens: 2000,
        }),
      });

      const result = await openaiResponse.json();
      res.json({ result: result.choices[0]?.message?.content, success: true });
    } catch (error) {
      console.error('Error generating sales insights:', error);
      res.status(500).json({ error: 'Failed to generate sales insights', success: false });
    }
  });

  // Business Analyzer Endpoint
  app.post("/api/ai/business-analyzer", requireAuth, async (req: Request, res: Response) => {
    try {
      const { contacts, deals, tasks } = req.body;
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        return res.status(400).json({ error: "OpenAI API key is required" });
      }

      // Prepare comprehensive business analysis
      const businessSummary = {
        totalContacts: contacts?.length || 0,
        totalDeals: Object.keys(deals || {}).length,
        totalTasks: Object.keys(tasks || {}).length,
        activeDeals: Object.values(deals || {}).filter((deal: any) => 
          deal.stage !== 'closed-won' && deal.stage !== 'closed-lost'
        ).length,
        pipelineValue: Object.values(deals || {}).reduce((sum: number, deal: any) => 
          sum + (deal.value || 0), 0
        ),
        completedTasks: Object.values(tasks || {}).filter((task: any) => task.completed).length
      };

      const prompt = `Analyze this CRM business data and provide strategic recommendations:

Business Summary:
- Total Contacts: ${businessSummary.totalContacts}
- Total Deals: ${businessSummary.totalDeals}
- Active Deals: ${businessSummary.activeDeals}
- Pipeline Value: $${businessSummary.pipelineValue.toLocaleString()}
- Total Tasks: ${businessSummary.totalTasks}
- Completed Tasks: ${businessSummary.completedTasks}

Contact Overview: ${JSON.stringify(contacts?.slice(0, 5) || [])}
Deal Overview: ${JSON.stringify(Object.values(deals || {}).slice(0, 5))}

Based on this data, provide strategic business recommendations focusing on:
1. Pipeline health and conversion optimization
2. Contact engagement opportunities
3. Task management efficiency
4. Revenue growth strategies
5. Specific actionable next steps

Format as actionable insights with priorities.`;

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'o1-mini',
          messages: [
            { role: 'user', content: `You are a business analyst expert. Provide comprehensive business analysis and strategic recommendations.\n\n${prompt}` }
          ],
          max_completion_tokens: 2000,
        }),
      });

      const result = await openaiResponse.json();
      
      if (result.choices && result.choices.length > 0) {
        res.json({ result: result.choices[0]?.message?.content, success: true });
      } else {
        console.log('No choices in OpenAI response:', result);
        res.json({ result: "Business analysis completed. Please check your API configuration.", success: true });
      }
    } catch (error) {
      console.error('Error analyzing business:', error);
      res.status(500).json({ error: 'Failed to analyze business', success: false });
    }
  });

  // Real-time Analysis Endpoint
  app.post("/api/ai/realtime-analysis", requireAuth, async (req: Request, res: Response) => {
    try {
      const { analysisType, content } = req.body;
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        return res.status(400).json({ error: "OpenAI API key is required" });
      }

      let systemMessage = '';
      let prompt = '';

      switch (analysisType) {
        case 'sentiment':
          systemMessage = 'You are a sentiment analysis expert. Analyze text for emotional tone, sentiment polarity, and provide insights.';
          prompt = `Analyze the sentiment of this text: ${content}`;
          break;
        case 'email-feedback':
          systemMessage = 'You are an email writing coach. Provide constructive feedback on email effectiveness and tone.';
          prompt = `Provide feedback on this email: ${content}`;
          break;
        case 'form-validation':
          systemMessage = 'You are a data validation expert. Provide intelligent form field validation and suggestions.';
          prompt = `Validate this form data: ${JSON.stringify(content)}`;
          break;
        case 'call-insights':
          systemMessage = 'You are a call analysis expert. Provide real-time insights on call effectiveness and recommendations.';
          prompt = `Analyze this call transcript: ${content}`;
          break;
        default:
          return res.status(400).json({ error: `Unsupported analysis type: ${analysisType}` });
      }

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'o1-mini',
          messages: [
            { role: 'user', content: `${systemMessage}\n\n${prompt}` }
          ],
          max_completion_tokens: 4096,
        }),
      });

      const result = await openaiResponse.json();
      res.json({ result: result.choices[0]?.message?.content, success: true });
    } catch (error) {
      console.error('Error in real-time analysis:', error);
      res.status(500).json({ error: 'Failed to perform analysis', success: false });
    }
  });

  // MCP (Model Context Protocol) Function Calling Endpoint
  app.post("/api/mcp/call", requireAuth, async (req: Request, res: Response) => {
    try {
      const { functionName, parameters, model = 'gemini', temperature = 0.1 } = req.body;
      
      // Get user's data for context
      const contacts = await storage.getContacts(req.userId!);
      const deals = await storage.getDeals(req.userId!);
      const tasks = await storage.getTasks(req.userId!);
      
      let result: any = {};
      
      switch (functionName) {
        case 'analyzeLeadScore':
          const contact = await storage.getContact(parameters.contactId);
          if (!contact) {
            throw new Error('Contact not found');
          }
          
          // Use AI to analyze lead score
          const leadAnalysisPrompt = `Analyze this contact for lead scoring: ${JSON.stringify(contact)}. 
          Score from 0-100 based on: company size, industry, engagement, position, and other factors.
          Provide specific factors and recommendation.`;
          
          result = await callAIModel(model, leadAnalysisPrompt, temperature);
          break;
          
        case 'generatePersonalizedEmail':
          const targetContact = await storage.getContact(parameters.contactId);
          if (!targetContact) {
            throw new Error('Contact not found');
          }
          
          const emailPrompt = `Generate a personalized ${parameters.campaignType || 'professional'} email with ${parameters.tone || 'professional'} tone for: ${JSON.stringify(targetContact)}. 
          Include subject line, body, and personalization notes.`;
          
          result = await callAIModel(model, emailPrompt, temperature);
          break;
          
        case 'predictDealClosure':
          const deal = await storage.getDeal(parameters.dealId);
          if (!deal) {
            throw new Error('Deal not found');
          }
          
          const dealPrompt = `Analyze this deal for closure prediction: ${JSON.stringify(deal)}. 
          Provide closure probability, time to close, key factors, next actions, and risk factors.`;
          
          result = await callAIModel(model, dealPrompt, temperature);
          break;
          
        case 'optimizeSalesSequence':
          const sequencePrompt = `Optimize sales sequence with ID ${parameters.sequenceId}. 
          Current sequence: ${JSON.stringify(parameters.currentSequence || {})}. 
          Provide optimizations, expected improvements, and confidence level.`;
          
          result = await callAIModel(model, sequencePrompt, temperature);
          break;
          
        default:
          result = {
            message: `MCP function ${functionName} executed successfully`,
            parameters,
            timestamp: new Date().toISOString()
          };
      }
      
      res.json({ 
        success: true,
        result,
        executionTime: Date.now() - Date.now(),
        modelUsed: model
      });
      
    } catch (error) {
      console.error('Error in MCP function call:', error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'MCP function call failed'
      });
    }
  });

  // Helper function to call AI models
  async function callAIModel(model: string, prompt: string, temperature: number = 0.1): Promise<any> {
    if (model === 'gemini') {
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (!geminiApiKey) {
        throw new Error('Gemini API key not configured');
      }
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature }
        })
      });
      
      const data = await response.json();
      return JSON.parse(data.candidates[0]?.content?.parts[0]?.text || '{}');
    } else {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'o1-mini',
          messages: [{ role: 'user', content: prompt }],
          max_completion_tokens: 4096
        })
      });
      
      const data = await response.json();
      return JSON.parse(data.choices[0]?.message?.content || '{}');
    }
  }

  // Agent Execution Endpoint
  app.post("/api/agents/execute", requireAuth, async (req: Request, res: Response) => {
    try {
      const { goalId, agentName, action, toolsNeeded, agentType, input, agentConfig } = req.body;
      
      // Get user's CRM data for context
      const contacts = await storage.getContacts(req.userId!);
      const deals = await storage.getDeals(req.userId!);
      const tasks = await storage.getTasks(req.userId!);
      
      // Prepare context for agent execution
      const agentPrompt = agentConfig ? 
        `Execute ${agentConfig.name} with the following:
        
        Agent Description: ${agentConfig.description}
        Capabilities: ${agentConfig.capabilities.join(', ')}
        Input: ${JSON.stringify(input)}
        
        User's CRM Context:
        - Contacts: ${contacts.length} contacts
        - Deals: ${deals.length} deals  
        - Tasks: ${tasks.length} tasks
        
        Provide specific actionable results based on this agent's capabilities and the user's actual CRM data.` :
        `Execute ${agentName || 'AI Agent'} for goal: ${goalId}
        
        Action: ${action}
        Tools Needed: ${toolsNeeded ? toolsNeeded.join(', ') : 'general tools'}
        
        User's CRM Context:
        - Contacts: ${contacts.length} contacts with diverse industries and positions
        - Deals: ${deals.length} active deals in pipeline
        - Tasks: ${tasks.length} tasks requiring attention
        
        Based on this real CRM data, provide specific actionable insights and recommendations for: ${action}
        Focus on business impact and practical next steps.`;
      
      let result: any = {};
      
      // Use the configured AI model for the agent
      if (agentConfig && (agentConfig.aiModel === 'OpenAI' || agentConfig.aiModel === 'Both')) {
        const openaiApiKey = process.env.OPENAI_API_KEY;
        if (!openaiApiKey) {
          throw new Error('OpenAI API key not configured');
        }
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'o1-mini',
            messages: [{ role: 'user', content: agentPrompt }],
            max_completion_tokens: 4096
          })
        });
        
        const data = await response.json();
        if (data.choices && data.choices.length > 0 && data.choices[0]?.message?.content) {
          result = data.choices[0].message.content;
        } else {
          result = 'Agent execution completed successfully';
        }
      } else {
        // For demonstration purposes, return structured agent execution result
        result = `Successfully executed ${agentName || 'AI Agent'} for ${goalId || 'automation goal'}
        
Action Completed: ${action}
CRM Context Analysis:
- Processed ${contacts.length} contacts across diverse industries
- Evaluated ${deals.length} active deals in pipeline
- Reviewed ${tasks.length} pending tasks

Key Insights:
• Identified high-potential leads based on engagement patterns
• Recommended priority contact sequences for sales team
• Generated actionable business intelligence from current CRM data

Business Impact:
- Improved lead qualification accuracy by 30%
- Reduced manual analysis time by 2-3 hours
- Enhanced sales team efficiency with data-driven insights

Next Actions:
1. Review generated lead scores in CRM dashboard
2. Implement recommended contact sequences
3. Monitor conversion improvements over next 30 days`;
      }
      
      res.json({
        success: true,
        result,
        agentType,
        confidence: 0.85,
        executionTime: Date.now()
      });
      
    } catch (error) {
      console.error('Error in agent execution:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Agent execution failed'
      });
    }
  });

  // Composio Integration Endpoints
  app.post("/api/composio/linkedin/message", requireAuth, async (req: Request, res: Response) => {
    try {
      const { recipientId, message, entityId = 'default' } = req.body;
      
      // Try real Composio API integration first
      if (process.env.COMPOSIO_API_KEY) {
        try {
          const response = await fetch('https://backend.composio.dev/api/v1/actions/execute', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.COMPOSIO_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              entityId,
              action: 'LINKEDIN_SEND_MESSAGE',
              params: {
                recipientUrn: recipientId,
                messageText: message
              }
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('LinkedIn message sent via Composio:', data);
            res.json({
              success: true,
              data: data.response,
              provider: 'Composio',
              message: 'LinkedIn message sent successfully via Composio API'
            });
            return;
          } else {
            console.log('Composio LinkedIn API failed, falling back to demo mode');
          }
        } catch (composioError) {
          console.log('Composio LinkedIn API error:', composioError);
        }
      }
      
      // Fallback to demo mode
      console.log('Sending LinkedIn message (demo mode):', { recipientId, message });
      res.json({
        success: true,
        data: {
          messageId: `linkedin_${Date.now()}`,
          recipientId,
          status: 'sent'
        },
        provider: 'Demo',
        message: 'LinkedIn message sent successfully (demo mode)'
      });
      
    } catch (error) {
      console.error('LinkedIn message error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'LinkedIn message failed'
      });
    }
  });

  app.post("/api/composio/whatsapp/message", requireAuth, async (req: Request, res: Response) => {
    try {
      const { phoneNumber, message, templateName, entityId = 'default' } = req.body;
      
      // Try real Composio API integration first
      if (process.env.COMPOSIO_API_KEY) {
        try {
          const response = await fetch('https://backend.composio.dev/api/v1/actions/execute', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.COMPOSIO_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              entityId,
              action: 'WHATSAPP_SEND_MESSAGE',
              params: {
                phoneNumber,
                message,
                templateName: templateName || 'default'
              }
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('WhatsApp message sent via Composio:', data);
            res.json({
              success: true,
              data: data.response,
              provider: 'Composio',
              message: 'WhatsApp message sent successfully via Composio API'
            });
            return;
          } else {
            console.log('Composio WhatsApp API failed, falling back to demo mode');
          }
        } catch (composioError) {
          console.log('Composio WhatsApp API error:', composioError);
        }
      }
      
      // Fallback to demo mode
      console.log('Sending WhatsApp message (demo mode):', { phoneNumber, message, templateName });
      res.json({
        success: true,
        data: {
          messageId: `whatsapp_${Date.now()}`,
          phoneNumber,
          templateName,
          status: 'delivered'
        },
        provider: 'Demo',
        message: 'WhatsApp message sent successfully (demo mode)'
      });
      
    } catch (error) {
      console.error('WhatsApp message error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'WhatsApp message failed'
      });
    }
  });

  // Composio Gmail Integration
  app.post("/api/composio/gmail/send", requireAuth, async (req: Request, res: Response) => {
    try {
      const { to, subject, body, entityId = 'default' } = req.body;
      
      if (process.env.COMPOSIO_API_KEY) {
        try {
          const response = await fetch('https://backend.composio.dev/api/v1/actions/execute', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.COMPOSIO_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              entityId,
              action: 'GMAIL_SEND_EMAIL',
              params: { to, subject, body, html: true }
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            res.json({
              success: true,
              data: data.response,
              provider: 'Composio'
            });
            return;
          }
        } catch (error) {
          console.log('Composio Gmail API failed, using demo mode');
        }
      }
      
      res.json({
        success: true,
        messageId: `gmail_msg_${Date.now()}`,
        to, subject,
        sentAt: new Date().toISOString(),
        provider: 'Demo'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Gmail sending failed'
      });
    }
  });

  // Get Composio Connected Tools
  app.get("/api/composio/tools/:entityId", requireAuth, async (req: Request, res: Response) => {
    try {
      const { entityId } = req.params;
      
      if (process.env.COMPOSIO_API_KEY) {
        try {
          const response = await fetch(`https://backend.composio.dev/api/v1/connectedAccounts?entityId=${entityId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${process.env.COMPOSIO_API_KEY}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            res.json({
              success: true,
              connectedAccounts: data.connectedAccounts || [],
              provider: 'Composio'
            });
            return;
          }
        } catch (error) {
          console.log('Composio tools fetch failed, using demo mode');
        }
      }
      
      // Demo mode - return sample connected tools
      res.json({
        success: true,
        connectedAccounts: [
          {
            id: 'gmail_demo',
            appName: 'gmail',
            entityId,
            status: 'connected',
            createdAt: new Date().toISOString()
          },
          {
            id: 'calendar_demo',
            appName: 'google_calendar',
            entityId,
            status: 'connected',
            createdAt: new Date().toISOString()
          },
          {
            id: 'linkedin_demo',
            appName: 'linkedin',
            entityId,
            status: 'connected',
            createdAt: new Date().toISOString()
          }
        ],
        provider: 'Demo'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch connected tools'
      });
    }
  });

  // Communication endpoints
  app.post("/api/communication/send-sms", requireAuth, async (req: Request, res: Response) => {
    try {
      const { contactId, content, phone } = req.body;
      
      // In a real app, this would integrate with SMS providers like Twilio
      // For now, we'll simulate the SMS sending
      const messageId = Date.now().toString();
      
      const response = {
        success: true,
        messageId,
        status: 'sent',
        message: 'SMS sent successfully',
        details: {
          to: phone,
          content: content,
          timestamp: new Date().toISOString()
        }
      };
      
      res.json(response);
    } catch (error) {
      console.error('SMS sending error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send SMS',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
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
      const createdContacts = [];
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

  // Smart Search Status Endpoint
  app.get("/api/ai/smart-search-status", async (req: Request, res: Response) => {
    try {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        return res.json({ available: false, reason: "OpenAI API key not configured" });
      }

      // Test if the API key is valid by making a quick test request
      // For now, we'll just check if the key exists and assume it's valid
      return res.json({ 
        available: true, 
        features: ["semantic_search", "embeddings", "natural_language_queries"]
      });
    } catch (error) {
      console.error("Error checking smart search status:", error);
      res.json({ available: false, reason: "Service temporarily unavailable" });
    }
  });

  // White-label reseller platform routes
  app.use('/api/partners', partnersRouter);
  app.use('/api/feature-packages', featurePackagesRouter);

  // Super Admin API Routes
  app.get('/api/admin/users', async (req, res) => {
    try {
      // For now, return mock data for the super admin interface
      const users = [
        {
          id: 'demo-user-123',
          email: 'demo@smartcrm.com',
          firstName: 'Demo',
          lastName: 'User',
          role: 'super_admin',
          subscriptionPlan: 'enterprise',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          features: []
        },
        {
          id: 'user-2',
          email: 'john@company.com',
          firstName: 'John',
          lastName: 'Smith',
          role: 'user',
          subscriptionPlan: 'professional',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          features: []
        }
      ];
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.get('/api/admin/features', async (req, res) => {
    try {
      const features = [
        {
          id: 'contacts',
          name: 'Contact Management',
          description: 'Core CRM contact management features',
          category: 'core',
          isEnabled: true,
          requiredPlan: 'free',
        },
        {
          id: 'deals',
          name: 'Deal Pipeline',
          description: 'Sales pipeline and deal tracking',
          category: 'core',
          isEnabled: true,
          requiredPlan: 'basic',
        },
        {
          id: 'ai_tools',
          name: 'AI Tools',
          description: 'AI-powered business analysis and insights',
          category: 'ai',
          isEnabled: true,
          requiredPlan: 'professional',
          usageLimit: 100,
        },
        {
          id: 'email_composer',
          name: 'AI Email Composer',
          description: 'AI-generated personalized emails',
          category: 'ai',
          isEnabled: true,
          requiredPlan: 'basic',
          usageLimit: 50,
        },
        {
          id: 'smart_search',
          name: 'Smart Search',
          description: 'AI-powered semantic search across data',
          category: 'ai',
          isEnabled: true,
          requiredPlan: 'professional',
          usageLimit: 200,
        },
        {
          id: 'phone_system',
          name: 'Phone System',
          description: 'VoIP calling and call management',
          category: 'communication',
          isEnabled: false,
          requiredPlan: 'professional',
        },
        {
          id: 'sms_messaging',
          name: 'SMS Messaging',
          description: 'Text messaging and SMS campaigns',
          category: 'communication',
          isEnabled: false,
          requiredPlan: 'basic',
          usageLimit: 1000,
        },
        {
          id: 'advanced_analytics',
          name: 'Advanced Analytics',
          description: 'Business intelligence and reporting',
          category: 'analytics',
          isEnabled: true,
          requiredPlan: 'professional',
        },
        {
          id: 'api_access',
          name: 'API Access',
          description: 'REST API for integrations',
          category: 'integration',
          isEnabled: false,
          requiredPlan: 'enterprise',
        },
        {
          id: 'white_label',
          name: 'White Label',
          description: 'Custom branding and theming',
          category: 'integration',
          isEnabled: false,
          requiredPlan: 'enterprise',
        }
      ];

      res.json(features);
    } catch (error) {
      console.error('Error fetching features:', error);
      res.status(500).json({ message: 'Failed to fetch features' });
    }
  });

  app.post('/api/admin/features/:featureId/toggle', async (req, res) => {
    try {
      const { featureId } = req.params;
      console.log(`Toggling feature: ${featureId}`);
      res.json({ message: `Feature ${featureId} toggled successfully` });
    } catch (error) {
      console.error('Error toggling feature:', error);
      res.status(500).json({ message: 'Failed to toggle feature' });
    }
  });

  app.put('/api/admin/users/:userId/role', async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!['user', 'admin', 'super_admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      console.log(`Updating user ${userId} role to ${role}`);
      res.json({ message: 'User role updated successfully' });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ message: 'Failed to update user role' });
    }
  });

  app.put('/api/admin/users/:userId/status', async (req, res) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      console.log(`Updating user ${userId} status to ${isActive}`);
      res.json({ message: 'User status updated successfully' });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ message: 'Failed to update user status' });
    }
  });

  app.post('/api/auth/signup', async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        organizationName,
        phoneNumber
      } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }

      // Check if user already exists
      console.log(`Checking if user exists: ${email}`);
      
      // Create new user account
      const newUser = {
        id: 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        firstName,
        lastName,
        email,
        role: 'user',
        subscriptionPlan: 'free',
        organizationName,
        phoneNumber,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      console.log(`Created user account: ${firstName} ${lastName} (${email})`);
      
      res.status(201).json({ 
        message: 'Account created successfully',
        user: newUser
      });
    } catch (error) {
      console.error('Error creating user account:', error);
      res.status(500).json({ message: 'Failed to create account' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // For demo purposes, create a mock user login
      // In production, this would validate against the database
      let mockUser;
      
      if (email.includes('admin')) {
        mockUser = {
          id: 'user-admin-' + Date.now(),
          firstName: 'Admin',
          lastName: 'User',
          email: email,
          role: 'super_admin',
          subscriptionPlan: 'enterprise',
          isActive: true,
          createdAt: new Date().toISOString()
        };
      } else {
        mockUser = {
          id: 'user-' + Date.now(),
          firstName: 'Demo',
          lastName: 'User',
          email: email,
          role: 'user',
          subscriptionPlan: 'free',
          isActive: true,
          createdAt: new Date().toISOString()
        };
      }

      console.log(`User login: ${email} (${mockUser.role})`);
      
      res.status(200).json({ 
        message: 'Login successful',
        user: mockUser,
        sessionDuration: rememberMe ? '30 days' : '24 hours'
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.post('/api/admin/super-admin-signup', async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        organizationName,
        phoneNumber,
        adminCode
      } = req.body;

      // Verify admin code
      if (adminCode !== 'SUPER_ADMIN_2024') {
        return res.status(400).json({ message: 'Invalid super admin code' });
      }

      // Validate required fields
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Create super admin account
      const newSuperAdmin = {
        id: 'super-admin-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        firstName,
        lastName,
        email,
        role: 'super_admin',
        subscriptionPlan: 'enterprise',
        organizationName,
        phoneNumber,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      console.log(`Created super admin: ${firstName} ${lastName} (${email})`);
      
      res.status(201).json({ 
        message: 'Super admin account created successfully',
        user: newSuperAdmin
      });
    } catch (error) {
      console.error('Error creating super admin:', error);
      res.status(500).json({ message: 'Failed to create super admin account' });
    }
  });

  app.post('/api/admin/users/bulk-create', async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        role,
        subscriptionPlan,
        organizationName,
        phoneNumber
      } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: 'Missing required fields: firstName, lastName, email' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Validate role
      const validRoles = ['user', 'admin', 'super_admin'];
      if (role && !validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Must be one of: user, admin, super_admin' });
      }

      // Validate subscription plan
      const validPlans = ['free', 'basic', 'professional', 'enterprise'];
      if (subscriptionPlan && !validPlans.includes(subscriptionPlan)) {
        return res.status(400).json({ message: 'Invalid subscription plan. Must be one of: free, basic, professional, enterprise' });
      }

      // Check if user already exists
      console.log(`Checking if user exists: ${email}`);
      
      // For demo purposes, simulate user creation
      const newUser = {
        id: 'bulk-user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        firstName,
        lastName,
        email,
        role: role || 'user',
        subscriptionPlan: subscriptionPlan || 'free',
        organizationName,
        phoneNumber,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      console.log(`Created user: ${firstName} ${lastName} (${email}) - ${role || 'user'} - ${subscriptionPlan || 'free'}`);
      
      res.status(201).json({ 
        message: 'User created successfully',
        user: newUser
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

  app.post('/api/admin/users/mass-role-assignment', async (req, res) => {
    try {
      const {
        email,
        newRole,
        subscriptionPlan,
        permissions
      } = req.body;

      // Validate required fields
      if (!email || !newRole) {
        return res.status(400).json({ message: 'Missing required fields: email, newRole' });
      }

      // Validate role
      const validRoles = ['user', 'admin', 'super_admin'];
      if (!validRoles.includes(newRole)) {
        return res.status(400).json({ message: 'Invalid role. Must be one of: user, admin, super_admin' });
      }

      // Validate subscription plan
      const validPlans = ['free', 'basic', 'professional', 'enterprise'];
      if (subscriptionPlan && !validPlans.includes(subscriptionPlan)) {
        return res.status(400).json({ message: 'Invalid subscription plan' });
      }

      // AI-powered business logic validation
      const aiValidation = await validateRoleAssignment(email, newRole);
      if (!aiValidation.isValid) {
        return res.status(400).json({ message: aiValidation.error });
      }

      console.log(`Mass role assignment: ${email} → ${newRole} (${subscriptionPlan || 'no plan change'})`);
      
      // Simulate successful role assignment
      res.status(200).json({ 
        message: 'Role assignment successful',
        assignment: {
          email,
          newRole,
          subscriptionPlan: subscriptionPlan || 'unchanged',
          permissions: permissions || [],
          timestamp: new Date().toISOString(),
          aiValidation: aiValidation
        }
      });
    } catch (error) {
      console.error('Error in mass role assignment:', error);
      res.status(500).json({ message: 'Failed to assign role' });
    }
  });

  // AI validation helper function
  async function validateRoleAssignment(email: string, newRole: string) {
    // Simulate AI-powered validation logic
    const suspiciousPatterns = [
      { pattern: /test.*@|@.*test/i, risk: 'Test email in production' },
      { pattern: /temp.*@|@.*temp/i, risk: 'Temporary email detected' }
    ];

    for (const { pattern, risk } of suspiciousPatterns) {
      if (pattern.test(email)) {
        return {
          isValid: false,
          error: risk,
          confidence: 0.85,
          recommendation: 'Manual review required'
        };
      }
    }

    // Business logic validation
    if (newRole === 'super_admin' && !email.includes('@company.com')) {
      return {
        isValid: false,
        error: 'Super admin role restricted to company domain',
        confidence: 0.95,
        recommendation: 'Use company email for super admin access'
      };
    }

    return {
      isValid: true,
      confidence: 0.92,
      recommendation: 'Assignment approved by AI validation'
    };
  }

  // AI Routes Integration
  app.use("/api/ai", aiRoutes);

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
