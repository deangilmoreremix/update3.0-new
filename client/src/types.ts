// Core data types for the Smart CRM application

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  status: 'lead' | 'prospect' | 'customer' | 'churned';
  score?: number;
  lastContact?: Date;
  notes?: string;
  industry?: string;
  location?: string;
  favorite?: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'qualification' | 'initial' | 'negotiation' | 'proposal' | 'closed-won' | 'closed-lost';
  company: string;
  contact: string;
  contactId?: string;
  probability: number;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  dueDate?: Date;
  expectedCloseDate?: Date;
  lostReason?: string;
  products?: string[];
  competitors?: string[];
  decisionMakers?: string[];
  lastActivityDate?: Date;
  assignedTo?: string;
  currency: string;
  discountAmount?: number;
  discountPercentage?: number;
  nextSteps?: string[];
  aiInsights?: unknown;
  daysInStage: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category: 'call' | 'email' | 'meeting' | 'follow-up' | 'other';
  relatedToType?: 'contact' | 'deal';
  relatedToId?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface User {
  id: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  jobTitle?: string;
  company?: string;
  phone?: string;
  timezone?: string;
  preferences?: unknown;
  socialLinks?: unknown;
  accountStatus: string;
  createdAt: Date;
}

export interface Profile {
  id: string;
  fullName?: string;
  avatarUrl?: string;
  jobTitle?: string;
  company?: string;
  phone?: string;
  timezone?: string;
  preferences?: unknown;
  socialLinks?: unknown;
  userId: string;
}

export interface BusinessAnalysis {
  id: string;
  businessName: string;
  industry: string;
  websiteUrl?: string;
  socialLinks?: unknown;
  analysisResults?: unknown;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'podcast' | 'audiobook' | 'video' | 'voice_over';
  url: string;
  metadata?: unknown;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface VoiceProfile {
  id: string;
  name: string;
  voiceId: string;
  settings?: unknown;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}