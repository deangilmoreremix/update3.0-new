# Supabase Integration Guide

This guide covers the Supabase backend integration, database schema, authentication, and real-time features used in the Smart CRM application.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Project Setup](#project-setup)
3. [Database Schema](#database-schema)
4. [Authentication](#authentication)
5. [Database Operations](#database-operations)
6. [Real-time Features](#real-time-features)
7. [Edge Functions](#edge-functions)
8. [File Storage](#file-storage)
9. [Security & RLS](#security--rls)
10. [Testing & Development](#testing--development)

## 🌐 Overview

### Supabase Services Used
- **Database**: PostgreSQL with automatic APIs
- **Authentication**: User management and sessions
- **Real-time**: Live data updates
- **Edge Functions**: Serverless functions for AI integration
- **Storage**: File uploads and management
- **Row Level Security**: Data access control

### Architecture Pattern
```
Frontend (React) ↔ Supabase Client ↔ Supabase Services
                                    ├── PostgreSQL Database
                                    ├── Auth Service
                                    ├── Real-time Engine
                                    ├── Edge Functions
                                    └── Storage Buckets
```

## ⚙️ Project Setup

### Environment Configuration

#### Required Environment Variables
```bash
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Supabase Client Configuration
```typescript
// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Type-safe client
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          avatar_url?: string;
        };
        Update: {
          full_name?: string;
          avatar_url?: string;
        };
      };
      // Add other table types here
    };
  };
};

export const typedSupabase = createClient<Database>(supabaseUrl, supabaseKey);
```

## 🗄️ Database Schema

### Core Tables

#### Users and Profiles
```sql
-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager')),
  tenant_id UUID REFERENCES tenants(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Tenants for multi-tenancy
CREATE TABLE tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

#### CRM Core Entities
```sql
-- Contacts/Leads
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'prospect', 'customer')),
  source TEXT,
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Deals/Opportunities
CREATE TABLE deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  contact_id UUID REFERENCES contacts(id),
  title TEXT NOT NULL,
  value DECIMAL(12,2),
  stage TEXT DEFAULT 'prospecting',
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  actual_close_date DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost')),
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Activities/Interactions
CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note', 'task')),
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES profiles(id),
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

#### AI and Goals System
```sql
-- AI Goals
CREATE TABLE ai_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
  priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  target_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- AI Analytics
CREATE TABLE ai_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  user_id UUID REFERENCES profiles(id),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(12,4),
  metric_type TEXT CHECK (metric_type IN ('count', 'percentage', 'currency', 'duration')),
  dimensions JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### Database Functions and Triggers

#### Auto-update timestamps
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at 
  BEFORE UPDATE ON contacts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at 
  BEFORE UPDATE ON deals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔐 Authentication

### Auth Service Integration

#### User Registration and Login
```typescript
// src/services/authService.ts
import { supabase } from './supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
  tenantId?: string;
}

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    // Create profile after successful signup
    if (data.user) {
      await this.createProfile(data.user.id, email, fullName);
    }

    return data;
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Get current session
  static async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  // Get current user with profile
  static async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      fullName: profile?.full_name,
      avatarUrl: profile?.avatar_url,
      role: profile?.role,
      tenantId: profile?.tenant_id,
    };
  }

  // Create user profile
  private static async createProfile(
    userId: string, 
    email: string, 
    fullName?: string
  ) {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: fullName,
      });

    if (error) throw error;
  }

  // Update user profile
  static async updateProfile(updates: Partial<AuthUser>) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('No authenticated user');

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl,
      })
      .eq('id', user.id);

    if (error) throw error;
  }
}
```

#### Auth Context Provider
```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, AuthUser } from '../services/authService';
import { supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    AuthService.getSession().then(session => {
      if (session?.user) {
        AuthService.getCurrentUser().then(setUser);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await AuthService.signIn(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      await AuthService.signUp(email, password, fullName);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await AuthService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    await AuthService.updateProfile(updates);
    const updatedUser = await AuthService.getCurrentUser();
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## 🗃️ Database Operations

### Supabase Service Layer

#### Generic CRUD Operations
```typescript
// src/services/supabaseService.ts
import { supabase } from './supabaseClient';

export interface CRUDOptions {
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
}

export class SupabaseService {
  // Generic read operation
  static async read<T>(
    table: string, 
    options: CRUDOptions = {}
  ): Promise<T[]> {
    let query = supabase.from(table).select(options.select || '*');

    // Apply filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Apply ordering
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending ?? true 
      });
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as T[];
  }

  // Generic create operation
  static async create<T>(table: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result as T;
  }

  // Generic update operation
  static async update<T>(
    table: string, 
    id: string, 
    updates: Partial<T>
  ): Promise<T> {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  // Generic delete operation
  static async delete(table: string, id: string): Promise<void> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Get single record by ID
  static async getById<T>(table: string, id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data as T;
  }
}
```

#### Domain-Specific Services

##### Contact Service
```typescript
// src/services/contactService.ts
export interface Contact {
  id: string;
  tenant_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: 'lead' | 'prospect' | 'customer';
  source?: string;
  tags: string[];
  custom_fields: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export class ContactService {
  // Get all contacts for current tenant
  static async getContacts(tenantId: string): Promise<Contact[]> {
    return SupabaseService.read<Contact>('contacts', {
      filters: { tenant_id: tenantId },
      orderBy: { column: 'created_at', ascending: false },
    });
  }

  // Create new contact
  static async createContact(contactData: Partial<Contact>): Promise<Contact> {
    return SupabaseService.create<Contact>('contacts', contactData);
  }

  // Update contact
  static async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    return SupabaseService.update<Contact>('contacts', id, updates);
  }

  // Delete contact
  static async deleteContact(id: string): Promise<void> {
    return SupabaseService.delete('contacts', id);
  }

  // Search contacts
  static async searchContacts(tenantId: string, query: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('tenant_id', tenantId)
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Contact[];
  }

  // Get contacts by status
  static async getContactsByStatus(tenantId: string, status: string): Promise<Contact[]> {
    return SupabaseService.read<Contact>('contacts', {
      filters: { tenant_id: tenantId, status },
      orderBy: { column: 'updated_at', ascending: false },
    });
  }
}
```

##### Goal Service
```typescript
// src/services/goalService.ts
export interface Goal {
  id: string;
  tenant_id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  status: 'active' | 'completed' | 'paused' | 'archived';
  priority: number;
  progress: number;
  target_date?: string;
  completed_at?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export class GoalService {
  // Get user goals
  static async getUserGoals(userId: string, tenantId: string): Promise<Goal[]> {
    return SupabaseService.read<Goal>('ai_goals', {
      filters: { user_id: userId, tenant_id: tenantId },
      orderBy: { column: 'created_at', ascending: false },
    });
  }

  // Create goal
  static async createGoal(goalData: Partial<Goal>): Promise<Goal> {
    return SupabaseService.create<Goal>('ai_goals', goalData);
  }

  // Update goal progress
  static async updateGoalProgress(id: string, progress: number): Promise<Goal> {
    const updates: Partial<Goal> = { progress };
    
    // Mark as completed if progress reaches 100%
    if (progress >= 100) {
      updates.status = 'completed';
      updates.completed_at = new Date().toISOString();
    }

    return SupabaseService.update<Goal>('ai_goals', id, updates);
  }

  // Get goals by category
  static async getGoalsByCategory(
    userId: string, 
    tenantId: string, 
    category: string
  ): Promise<Goal[]> {
    return SupabaseService.read<Goal>('ai_goals', {
      filters: { user_id: userId, tenant_id: tenantId, category },
      orderBy: { column: 'priority', ascending: false },
    });
  }

  // Get goal analytics
  static async getGoalAnalytics(userId: string, tenantId: string) {
    const { data, error } = await supabase
      .from('ai_goals')
      .select('status, category, progress')
      .eq('user_id', userId)
      .eq('tenant_id', tenantId);

    if (error) throw error;

    const analytics = {
      total: data.length,
      completed: data.filter(g => g.status === 'completed').length,
      active: data.filter(g => g.status === 'active').length,
      averageProgress: data.reduce((sum, g) => sum + g.progress, 0) / data.length,
      byCategory: {} as Record<string, number>,
    };

    // Group by category
    data.forEach(goal => {
      analytics.byCategory[goal.category] = 
        (analytics.byCategory[goal.category] || 0) + 1;
    });

    return analytics;
  }
}
```

## ⚡ Real-time Features

### Real-time Subscriptions

#### Basic Subscription Setup
```typescript
// src/hooks/useRealtimeData.ts
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export function useRealtimeData<T>(
  table: string,
  filter?: { column: string; value: any }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      let query = supabase.from(table).select('*');
      
      if (filter) {
        query = query.eq(filter.column, filter.value);
      }

      const { data: initialData, error } = await query;
      if (!error && initialData) {
        setData(initialData as T[]);
      }
      setLoading(false);
    };

    fetchData();

    // Setup real-time subscription
    let subscription = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table,
          filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData(prev => [payload.new as T, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => 
              prev.map(item => 
                (item as any).id === (payload.new as any).id 
                  ? payload.new as T 
                  : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData(prev => 
              prev.filter(item => (item as any).id !== (payload.old as any).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table, filter?.column, filter?.value]);

  return { data, loading };
}
```

#### Real-time Goal Updates
```typescript
// src/components/aiTools/RealtimeGoalPanel.tsx
import React from 'react';
import { useRealtimeData } from '../../hooks/useRealtimeData';
import { useAuth } from '../../contexts/AuthContext';

export const RealtimeGoalPanel: React.FC = () => {
  const { user } = useAuth();
  const { data: goals, loading } = useRealtimeData<Goal>(
    'ai_goals',
    user ? { column: 'user_id', value: user.id } : undefined
  );

  if (loading) return <div>Loading goals...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Real-time Goals</h2>
      {goals.map(goal => (
        <div key={goal.id} className="p-4 border rounded-lg">
          <h3 className="font-medium">{goal.title}</h3>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">{goal.progress}% complete</p>
        </div>
      ))}
    </div>
  );
};
```

## 🚀 Edge Functions

### AI Content Generation Function

#### Function Structure
```typescript
// supabase/functions/ai-content-generator/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface RequestBody {
  prompt: string;
  type: 'content' | 'analysis' | 'summary';
  context?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt, type, context }: RequestBody = await req.json();

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare the request to OpenAI
    const systemPrompt = getSystemPrompt(type);
    const userPrompt = formatUserPrompt(prompt, context);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        content: data.choices[0].message.content,
        usage: data.usage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

function getSystemPrompt(type: string): string {
  switch (type) {
    case 'content':
      return 'You are a helpful AI assistant that generates high-quality content for business use.';
    case 'analysis':
      return 'You are an expert business analyst providing insights and recommendations.';
    case 'summary':
      return 'You are an expert at creating concise, informative summaries.';
    default:
      return 'You are a helpful AI assistant.';
  }
}

function formatUserPrompt(prompt: string, context?: Record<string, any>): string {
  let formattedPrompt = prompt;
  
  if (context) {
    formattedPrompt += '\n\nContext:\n' + JSON.stringify(context, null, 2);
  }
  
  return formattedPrompt;
}
```

#### CORS Helper
```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

#### Edge Function Service
```typescript
// src/services/edgeFunctionService.ts
import { supabase } from './supabaseClient';

export interface EdgeFunctionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class EdgeFunctionService {
  // Call AI content generator
  static async generateContent(
    prompt: string,
    type: 'content' | 'analysis' | 'summary',
    context?: Record<string, any>
  ): Promise<string> {
    const { data, error } = await supabase.functions.invoke('ai-content-generator', {
      body: { prompt, type, context },
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    return data.content;
  }

  // Generic edge function caller
  static async callFunction<T>(
    functionName: string,
    payload: any
  ): Promise<EdgeFunctionResponse<T>> {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data;
  }
}
```

## 🔒 Security & RLS

### Row Level Security Policies

#### Profile Security
```sql
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Only authenticated users can insert profiles
CREATE POLICY "Authenticated users can insert profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

#### Multi-tenant Security
```sql
-- Enable RLS on tenant-specific tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_goals ENABLE ROW LEVEL SECURITY;

-- Function to get user's tenant_id
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT tenant_id 
    FROM profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Contacts: Users can only access data from their tenant
CREATE POLICY "Tenant isolation for contacts" ON contacts
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Deals: Users can only access data from their tenant
CREATE POLICY "Tenant isolation for deals" ON deals
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- AI Goals: Users can only access their own goals within their tenant
CREATE POLICY "User goals within tenant" ON ai_goals
  FOR ALL USING (
    tenant_id = get_user_tenant_id() AND 
    user_id = auth.uid()
  );
```

#### Role-based Access
```sql
-- Function to check user role
CREATE OR REPLACE FUNCTION check_user_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles 
    WHERE id = auth.uid()
  ) = required_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin-only access to analytics
CREATE POLICY "Admin only analytics" ON ai_analytics
  FOR SELECT USING (check_user_role('admin'));
```

## 🧪 Testing & Development

### Local Development Setup

#### Supabase CLI Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Start local development
supabase start

# Apply migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > src/types/database.ts
```

#### Testing Database Operations
```typescript
// src/services/__tests__/goalService.test.ts
import { GoalService } from '../goalService';
import { supabase } from '../supabaseClient';

// Mock Supabase client
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: mockGoal, error: null })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: mockGoal, error: null })),
          })),
        })),
      })),
    })),
  },
}));

describe('GoalService', () => {
  const mockGoal = {
    id: '1',
    title: 'Test Goal',
    user_id: 'user1',
    tenant_id: 'tenant1',
    category: 'sales',
    status: 'active',
    progress: 50,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a goal', async () => {
    const result = await GoalService.createGoal(mockGoal);
    expect(result).toEqual(mockGoal);
  });

  it('should update goal progress', async () => {
    const result = await GoalService.updateGoalProgress('1', 75);
    expect(result).toEqual(mockGoal);
  });
});
```

### Environment Management

#### Development Environment
```bash
# .env.local
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
```

#### Production Environment
```bash
# .env.production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## 📊 Performance Optimization

### Query Optimization

#### Indexing Strategy
```sql
-- Performance indexes for common queries
CREATE INDEX idx_contacts_tenant_status ON contacts(tenant_id, status);
CREATE INDEX idx_deals_tenant_stage ON deals(tenant_id, stage);
CREATE INDEX idx_goals_user_status ON ai_goals(user_id, status);
CREATE INDEX idx_activities_contact_date ON activities(contact_id, created_at);

-- Full-text search indexes
CREATE INDEX idx_contacts_search ON contacts USING gin(
  to_tsvector('english', first_name || ' ' || last_name || ' ' || coalesce(company, ''))
);
```

#### Efficient Queries
```typescript
// Use select to limit returned fields
const { data } = await supabase
  .from('contacts')
  .select('id, first_name, last_name, email')
  .eq('tenant_id', tenantId)
  .limit(50);

// Use count for pagination
const { count } = await supabase
  .from('contacts')
  .select('*', { count: 'exact', head: true })
  .eq('tenant_id', tenantId);

// Use range for pagination
const { data } = await supabase
  .from('contacts')
  .select('*')
  .eq('tenant_id', tenantId)
  .range(0, 49); // First 50 records
```

## 📚 Best Practices

### Do's ✅
- Always use Row Level Security (RLS)
- Implement proper error handling
- Use TypeScript types for database schemas
- Validate data before database operations
- Use transactions for related operations
- Implement proper indexing for performance
- Use edge functions for sensitive operations
- Cache frequently accessed data

### Don'ts ❌
- Don't expose service role keys in frontend
- Don't bypass RLS policies
- Don't ignore database errors
- Don't perform heavy operations in real-time subscriptions
- Don't store sensitive data without encryption
- Don't forget to clean up subscriptions
- Don't use SELECT * in production queries

## 🔗 Related Documentation

- [Project Structure](./project-structure.md) - Understanding the codebase organization
- [Frontend Guide](./frontend-guide.md) - React and TypeScript patterns
- [AI Integration](./ai-integration.md) - AI services and integration patterns
- [Code Standards](./code-standards.md) - Development guidelines and conventions
