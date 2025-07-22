import { useEffect, useState } from 'react';
import { getSupabaseService } from '../services/supabaseService';
import { Contact } from '../types/contact';
import { Deal } from '../types';

export interface ActivityLog {
  id: string;
  type: 'deal_created' | 'deal_moved' | 'contact_added' | 'meeting_scheduled' | 'email_sent' | 'call_completed';
  title: string;
  description: string;
  user_name: string;
  timestamp: Date;
  relatedId?: string;
}

export interface DashboardMetrics {
  totalDeals: number;
  totalDealValue: number;
  avgDealSize: number;
  winRate: number;
  conversionRate: number;
  activeContacts: number;
  totalContacts: number;
  recentActivity: number;
  monthlyGrowth: number;
  quarterlyGrowth: number;
}

// Enhanced real-time dashboard data hook
export const useRealTimeDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalDeals: 0,
    totalDealValue: 0,
    avgDealSize: 0,
    winRate: 0,
    conversionRate: 0,
    activeContacts: 0,
    totalContacts: 0,
    recentActivity: 0,
    monthlyGrowth: 12.5,
    quarterlyGrowth: 28.3
  });

  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const supabase = getSupabaseService();
      
      // Fetch deals and contacts data
      const [dealsData, contactsData] = await Promise.all([
        supabase.getDeals(),
        supabase.getContacts()
      ]);

      // Calculate metrics
      const wonDeals = dealsData.filter(deal => deal.stage === 'closed-won');
      const lostDeals = dealsData.filter(deal => deal.stage === 'closed-lost');
      const totalDealValue = dealsData.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const winRate = (wonDeals.length + lostDeals.length) > 0 ? 
        Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100) : 0;

      setMetrics({
        totalDeals: dealsData.length,
        totalDealValue,
        avgDealSize: dealsData.length > 0 ? Math.round(totalDealValue / dealsData.length) : 0,
        winRate,
        conversionRate: contactsData.length > 0 ? 
          Math.round((dealsData.length / contactsData.length) * 100) : 0,
        activeContacts: contactsData.filter(c => 
          ['lead', 'prospect', 'customer'].includes(c.status || 'lead')
        ).length,
        totalContacts: contactsData.length,
        recentActivity: activities.length,
        monthlyGrowth: 12.5, // TODO: Calculate from historical data
        quarterlyGrowth: 28.3 // TODO: Calculate from historical data
      });

      // Mock recent activities for now
      const mockActivities: ActivityLog[] = [
        {
          id: '1',
          type: 'deal_created',
          title: 'New deal created',
          description: `Enterprise CRM Solution - $${Math.floor(Math.random() * 100000 + 10000).toLocaleString()}`,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          user_name: 'Sarah Johnson'
        },
        {
          id: '2',
          type: 'deal_moved',
          title: 'Deal moved to Negotiation',
          description: 'TechCorp Implementation moved from Proposal',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          user_name: 'Mike Chen'
        },
        {
          id: '3',
          type: 'contact_added',
          title: 'New contact added',
          description: 'John Smith from GlobalTech',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          user_name: 'Lisa Wong'
        },
        {
          id: '4',
          type: 'meeting_scheduled',
          title: 'Demo scheduled',
          description: 'Product demo with DataCorp - Tomorrow 2:00 PM',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          user_name: 'Sarah Johnson'
        }
      ];
      
      setActivities(mockActivities);
      setError(null);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    activities,
    isLoading,
    error,
    refreshData: fetchDashboardData
  };
};

export const useRealTimeContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseService();

    // Initial load
    const loadContacts = async () => {
      try {
        setIsLoading(true);
        const data = await supabase.getContacts();
        setContacts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contacts');
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();

    // Real-time subscription
    const subscription = supabase.subscribeToContacts((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      setContacts(prev => {
        switch (eventType) {
          case 'INSERT':
            return [...prev, newRecord];
          case 'UPDATE':
            return prev.map(contact => 
              contact.id === newRecord.id ? newRecord : contact
            );
          case 'DELETE':
            return prev.filter(contact => contact.id !== oldRecord.id);
          default:
            return prev;
        }
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { contacts, isLoading, error };
};

export const useRealTimeDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseService();

    // Initial load
    const loadDeals = async () => {
      try {
        setIsLoading(true);
        const data = await supabase.getDeals();
        setDeals(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deals');
      } finally {
        setIsLoading(false);
      }
    };

    loadDeals();

    // Real-time subscription
    const subscription = supabase.subscribeToDeals((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      setDeals(prev => {
        switch (eventType) {
          case 'INSERT':
            return [...prev, newRecord];
          case 'UPDATE':
            return prev.map(deal => 
              deal.id === newRecord.id ? newRecord : deal
            );
          case 'DELETE':
            return prev.filter(deal => deal.id !== oldRecord.id);
          default:
            return prev;
        }
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { deals, isLoading, error };
};

export const useActivityTracking = () => {
  const logActivity = async (activity: {
    type: string;
    entity_type: 'contact' | 'deal';
    entity_id: string;
    description: string;
    metadata?: unknown;
  }) => {
    try {
      const supabase = getSupabaseService();
      const user = await supabase.getCurrentUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      await supabase.logActivity({
        ...activity,
        user_id: user.id,
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  return { logActivity };
};