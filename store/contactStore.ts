import { create } from 'zustand';
import { Contact } from '../types';
import { supabase } from '../services/supabaseClient';

interface ContactState {
  contacts: Record<string, Contact>;
  isLoading: boolean;
  error: string | null;
  selectedContact: string | null;
  
  // Actions
  fetchContacts: () => Promise<void>;
  createContact: (contact: Partial<Contact>) => Promise<void>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  importContacts: (contacts: Partial<Contact>[]) => Promise<void>;
  getContact: (id: string) => Promise<Contact | null>;
  selectContact: (contactId: string | null) => void;
}

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: {},
  isLoading: false,
  error: null,
  selectedContact: null,
  
  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Fetch contacts from Express API
      const response = await fetch('/api/contacts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the contacts into our app's format
      const contactsRecord: Record<string, Contact> = {};
      
      if (data && Array.isArray(data)) {
        data.forEach((item: unknown) => {
          const contact: Contact = {
            id: item.id,
            name: item.name,
            email: item.email || '',
            phone: item.phone || '',
            company: item.company || '',
            position: item.position || '',
            status: item.status || 'lead',
            score: item.score || 50,
            lastContact: item.lastContact ? new Date(item.lastContact) : undefined,
            notes: item.notes || '',
            industry: item.industry || '',
            location: item.location || '',
            favorite: item.favorite || false,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            userId: item.userId
          };
          
          contactsRecord[contact.id] = contact;
        });
      }
      
      set({ 
        contacts: contactsRecord,
        isLoading: false 
      });
    } catch (err) {
      console.error('Error fetching contacts:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch contacts' 
      });
    }
  },
  
  createContact: async (contactData: Partial<Contact>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Create contact via Express API
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const createdContact = await response.json();
      
      // Update local state with the new contact
      const contact: Contact = {
        id: createdContact.id,
        name: createdContact.name,
        email: createdContact.email || '',
        phone: createdContact.phone || '',
        company: createdContact.company || '',
        position: createdContact.position || '',
        status: createdContact.status || 'lead',
        score: createdContact.score || 50,
        lastContact: createdContact.lastContact ? new Date(createdContact.lastContact) : undefined,
        notes: createdContact.notes || '',
        industry: createdContact.industry || '',
        location: createdContact.location || '',
        favorite: createdContact.favorite || false,
        createdAt: new Date(createdContact.createdAt),
        updatedAt: new Date(createdContact.updatedAt),
        userId: createdContact.userId
      };
      
      set(state => ({
        contacts: {
          ...state.contacts,
          [contact.id]: contact
        },
        isLoading: false
      }));
    } catch (err) {
      console.error('Error creating contact:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to create contact' 
      });
      throw err;
    }
  },
  
  updateContact: async (id: string, contactData: Partial<Contact>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Convert Contact to Supabase format
      const supabaseData: Record<string, any> = {};
      
      if (contactData.name !== undefined) supabaseData.name = contactData.name;
      if (contactData.email !== undefined) supabaseData.email = contactData.email;
      if (contactData.phone !== undefined) supabaseData.phone = contactData.phone;
      if (contactData.company !== undefined) supabaseData.company = contactData.company;
      if (contactData.position !== undefined) supabaseData.position = contactData.position;
      if (contactData.status !== undefined) supabaseData.status = contactData.status;
      if (contactData.score !== undefined) supabaseData.score = contactData.score;
      if (contactData.lastContact !== undefined) supabaseData.last_contacted = contactData.lastContact.toISOString();
      if (contactData.notes !== undefined) supabaseData.notes = contactData.notes;
      if (contactData.industry !== undefined) supabaseData.industry = contactData.industry;
      if (contactData.location !== undefined) supabaseData.location = contactData.location;
      
      // Update in Supabase
      const { data, error } = await supabase
        .from('contacts')
        .update(supabaseData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      // Update local state
      if (data && data.length > 0) {
        const { contacts } = get();
        const currentContact = contacts[id] || {};
        
        const updatedContact: Contact = {
          ...currentContact,
          id: data[0].id,
          name: data[0].name,
          email: data[0].email || '',
          phone: data[0].phone || '',
          company: data[0].company || '',
          position: data[0].position || '',
          status: data[0].status || 'lead',
          score: data[0].score || 50,
          lastContact: data[0].last_contacted ? new Date(data[0].last_contacted) : undefined,
          notes: data[0].notes || '',
          industry: data[0].industry || '',
          location: data[0].location || '',
          userId: data[0].user_id
        };
        
        set(state => ({
          contacts: {
            ...state.contacts,
            [id]: updatedContact
          },
          isLoading: false
        }));
      }
    } catch (err) {
      console.error('Error updating contact:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to update contact' 
      });
      throw err;
    }
  },
  
  deleteContact: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove from local state
      set(state => {
        const { [id]: _, ...remainingContacts } = state.contacts;
        return { 
          contacts: remainingContacts,
          isLoading: false 
        };
      });
    } catch (err) {
      console.error('Error deleting contact:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to delete contact' 
      });
      throw err;
    }
  },
  
  importContacts: async (contacts: Partial<Contact>[]) => {
    set({ isLoading: true, error: null });
    
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('No authenticated user found');
      }
      
      // Convert Contacts to Supabase format
      const supabaseData = contacts.map(contact => ({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        position: contact.position,
        status: contact.status || 'lead',
        score: contact.score || 50,
        last_contacted: contact.lastContact ? contact.lastContact.toISOString() : null,
        notes: contact.notes,
        industry: contact.industry,
        location: contact.location,
        user_id: userData.user.id
      }));
      
      // Process in batches to avoid payload size limits
      const BATCH_SIZE = 50;
      const results = [];
      
      for (const i = 0; i < supabaseData.length; i += BATCH_SIZE) {
        const batch = supabaseData.slice(i, i + BATCH_SIZE);
        
        const { data, error } = await supabase
          .from('contacts')
          .insert(batch)
          .select();
        
        if (error) throw error;
        if (data) results.push(...data);
      }
      
      // Update local state with imported contacts
      if (results.length > 0) {
        const importedContacts: Record<string, Contact> = {};
        
        results.forEach(item => {
          const contact: Contact = {
            id: item.id,
            name: item.name,
            email: item.email || '',
            phone: item.phone || '',
            company: item.company || '',
            position: item.position || '',
            status: item.status || 'lead',
            score: item.score || 50,
            lastContact: item.last_contacted ? new Date(item.last_contacted) : undefined,
            notes: item.notes || '',
            industry: item.industry || '',
            location: item.location || '',
            userId: item.user_id
          };
          
          importedContacts[contact.id] = contact;
        });
        
        set(state => ({
          contacts: {
            ...state.contacts,
            ...importedContacts
          },
          isLoading: false
        }));
      }
    } catch (err) {
      console.error('Error importing contacts:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to import contacts' 
      });
      throw err;
    }
  },
  
  getContact: async (id: string) => {
    // Check if we already have the contact
    const { contacts } = get();
    if (contacts[id]) {
      return contacts[id];
    }
    
    // Otherwise fetch from Supabase
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const contact: Contact = {
          id: data.id,
          name: data.name,
          email: data.email || '',
          phone: data.phone || '',
          company: data.company || '',
          position: data.position || '',
          status: data.status || 'lead',
          score: data.score || 50,
          lastContact: data.last_contacted ? new Date(data.last_contacted) : undefined,
          notes: data.notes || '',
          industry: data.industry || '',
          location: data.location || '',
          userId: data.user_id
        };
        
        // Update the store
        set(state => ({
          contacts: {
            ...state.contacts,
            [contact.id]: contact
          }
        }));
        
        set({ isLoading: false });
        return contact;
      }
      
      set({ isLoading: false });
      return null;
    } catch (err) {
      console.error('Error fetching contact:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch contact' 
      });
      return null;
    }
  },
  
  selectContact: (contactId: string | null) => {
    set({ selectedContact: contactId });
  }
}));