export interface Contact {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
  title?: string;
  company?: string;
  position?: string;
  industry?: string;
  location?: string;
  avatar?: string;
  avatarSrc?: string;
  source?: string;
  sources?: string[];
  interestLevel?: 'hot' | 'medium' | 'low' | 'cold';
  status: 'active' | 'pending' | 'inactive' | 'lead' | 'prospect' | 'customer' | 'churned';
  lastContact?: string;
  lastConnected?: string;
  notes?: string;
  score?: number;
  aiScore?: number;
  tags?: string[];
  favorite?: boolean;
  isFavorite?: boolean;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  customFields?: Record<string, any>;
  leadSource?: string;
  annualRevenue?: number;
  employeeCount?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId: string;
  tenantId?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'initial' | 'negotiation' | 'proposal' | 'closed-won' | 'closed-lost' | 'qualification';
  contactId: string;
  probability?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  expectedCloseDate?: Date;
  lostReason?: string;
  products?: string[];
  competitors?: string[];
  decisionMakers?: string[];
  lastActivityDate?: Date;
  assignedTo?: string;
  currency?: string;
  discountAmount?: number;
  discountPercentage?: number;
  priority?: 'low' | 'medium' | 'high';
  nextSteps?: string[];
  aiInsights?: {
    riskFactors?: string[];
    opportunities?: string[];
    competitiveThreats?: string[];
    winStrategy?: string;
  };
  daysInStage?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  relatedTo?: {
    type: 'contact' | 'deal';
    id: string;
  };
  assignedTo?: string;
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
  reminderDate?: Date;
  category?: 'call' | 'email' | 'meeting' | 'follow-up' | 'other';
  notes?: string;
  tags?: string[];
}

export interface ApiKeys {
  openai?: string;
  gemini?: string;
}

export interface UserProfile {
  id: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  jobTitle?: string;
  company?: string;
  phone?: string;
  timezone?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    emailNotifications?: boolean;
    defaultView?: string;
    [key: string]: any;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
    [key: string]: any;
  };
  createdAt?: Date;
  accountStatus?: 'active' | 'inactive' | 'suspended';
}

interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'image' | 'presentation' | 'spreadsheet' | 'other';
  url: string;
  size?: number;
  uploadedAt: Date;
  relatedTo?: {
    type: 'contact' | 'deal';
    id: string;
  };
  description?: string;
  analyzedContent?: string;
  tags?: string[];
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'follow-up' | 'introduction' | 'proposal' | 'thank-you' | 'other';
  variables?: string[];
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
  tags?: string[];
  performance?: {
    sends: number;
    opens: number;
    clicks: number;
    replies: number;
  };
}

interface SalesInsight {
  id: string;
  title: string;
  description: string;
  type: 'lead-scoring' | 'churn-prediction' | 'opportunity' | 'trend' | 'recommendation';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  expiresAt?: Date;
  relatedTo?: {
    type: 'contact' | 'deal' | 'general';
    id?: string;
  };
  aiGenerated: boolean;
  confidence?: number;
  actionTaken: boolean;
  feedback?: 'helpful' | 'not-helpful' | 'neutral';
}

interface MarketTrend {
  id: string;
  title: string;
  description: string;
  industry: string;
  region?: string;
  impact: 'low' | 'medium' | 'high';
  source?: string;
  detectedAt: Date;
  relevanceScore?: number;
  opportunities?: string[];
  threats?: string[];
  relatedProducts?: string[];
}