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
            model: 'gemini-2.0-flash-thinking-exp',
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
          model: 'gpt-4',
          messages: [
            { 
              role: 'system', 
              content: 'You are a sales analytics expert. Analyze sales data and provide strategic insights and recommendations.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 2000,
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
      const { businessData } = req.body;
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        return res.status(400).json({ error: "OpenAI API key is required" });
      }

      const prompt = `Analyze this business data: ${JSON.stringify(businessData)}
      
      Provide analysis on:
      1. Business strengths and weaknesses
      2. Market opportunities
      3. Competitive positioning
      4. Growth recommendations`;

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
              content: 'You are a business analyst expert. Provide comprehensive business analysis and strategic recommendations.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      const result = await openaiResponse.json();
      res.json({ result: result.choices[0]?.message?.content, success: true });
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
