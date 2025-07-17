// Custom hooks for database operations
import { useState, useEffect } from 'react';

// Mock API service that will be replaced with actual backend calls
const apiService = {
  // User operations
  async getCurrentUser() {
    // This will be replaced with actual authentication
    return {
      id: 'user_demo',
      email: 'demo@smartcrm.com',
      firstName: 'Demo',
      lastName: 'User',
      fullName: 'Demo User',
      company: 'Smart CRM',
      role: 'admin'
    };
  },

  // Contact operations
  async getContacts(options = {}) {
    // For now, return mock data - will be replaced with API calls
    return fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    }).then(res => res.json()).catch(() => []);
  },

  async createContact(contactData) {
    return fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    }).then(res => res.json());
  },

  async updateContact(contactId, contactData) {
    return fetch(`/api/contacts/${contactId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    }).then(res => res.json());
  },

  async deleteContact(contactId) {
    return fetch(`/api/contacts/${contactId}`, {
      method: 'DELETE'
    }).then(res => res.ok);
  },

  // Deal operations
  async getDeals(options = {}) {
    return fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    }).then(res => res.json()).catch(() => []);
  },

  async createDeal(dealData) {
    return fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dealData)
    }).then(res => res.json());
  },

  async updateDeal(dealId, dealData) {
    return fetch(`/api/deals/${dealId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dealData)
    }).then(res => res.json());
  },

  async deleteDeal(dealId) {
    return fetch(`/api/deals/${dealId}`, {
      method: 'DELETE'
    }).then(res => res.ok);
  },

  // Task operations
  async getTasks(options = {}) {
    return fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    }).then(res => res.json()).catch(() => []);
  },

  async createTask(taskData) {
    return fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    }).then(res => res.json());
  },

  async updateTask(taskId, taskData) {
    return fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    }).then(res => res.json());
  },

  async deleteTask(taskId) {
    return fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    }).then(res => res.ok);
  },

  // Analytics
  async getDashboardStats() {
    return fetch('/api/dashboard/stats')
      .then(res => res.json())
      .catch(() => ({
        totalContacts: 0,
        totalDeals: 0,
        totalTasks: 0,
        completedTasks: 0,
        pipelineValue: 0
      }));
  }
};

// Custom hooks
export function useContacts(options = {}) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getContacts(options);
      setContacts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [JSON.stringify(options)]);

  const createContact = async (contactData) => {
    try {
      const newContact = await apiService.createContact(contactData);
      setContacts(prev => [newContact, ...prev]);
      return newContact;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateContact = async (contactId, contactData) => {
    try {
      const updatedContact = await apiService.updateContact(contactId, contactData);
      setContacts(prev => prev.map(c => c.id === contactId ? updatedContact : c));
      return updatedContact;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteContact = async (contactId) => {
    try {
      await apiService.deleteContact(contactId);
      setContacts(prev => prev.filter(c => c.id !== contactId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    contacts,
    loading,
    error,
    refetch: fetchContacts,
    createContact,
    updateContact,
    deleteContact
  };
}

export function useDeals(options = {}) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDeals(options);
      setDeals(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [JSON.stringify(options)]);

  const createDeal = async (dealData) => {
    try {
      const newDeal = await apiService.createDeal(dealData);
      setDeals(prev => [newDeal, ...prev]);
      return newDeal;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateDeal = async (dealId, dealData) => {
    try {
      const updatedDeal = await apiService.updateDeal(dealId, dealData);
      setDeals(prev => prev.map(d => d.id === dealId ? updatedDeal : d));
      return updatedDeal;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteDeal = async (dealId) => {
    try {
      await apiService.deleteDeal(dealId);
      setDeals(prev => prev.filter(d => d.id !== dealId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    deals,
    loading,
    error,
    refetch: fetchDeals,
    createDeal,
    updateDeal,
    deleteDeal
  };
}

export function useTasks(options = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTasks(options);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [JSON.stringify(options)]);

  const createTask = async (taskData) => {
    try {
      const newTask = await apiService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await apiService.updateTask(taskId, taskData);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await apiService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
}

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDeals: 0,
    totalTasks: 0,
    completedTasks: 0,
    pipelineValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export default apiService;
