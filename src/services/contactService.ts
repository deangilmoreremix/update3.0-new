import { supabase } from './supabaseClient';
import { Contact } from '../types';
import { mapContactToSupabase, mapSupabaseToContact } from '../utils/contactMapper';

// Fetch all contacts for the current user
export const fetchContacts = async (userId?: string) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const currentUserId = userId || userData.user?.id || 'demo-user-123';
    
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', currentUserId)
      .order('name');
      
    if (error) throw error;
    
    // Map the Supabase data to our Contact type
    const contacts = data?.map(contact => mapSupabaseToContact(contact)) || [];
    
    return { data: contacts, error: null };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return { data: null, error };
  }
};

// Create a new contact
export const createContact = async (contactData: Partial<Contact>) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || 'demo-user-123';
    
    // Prepare data for Supabase
    const supabaseData = mapContactToSupabase(contactData, userId);
    
    const { data, error } = await supabase
      .from('contacts')
      .insert([supabaseData])
      .select();
      
    if (error) throw error;
    
    // Map the response back to our Contact type
    const contacts = data?.map(contact => mapSupabaseToContact(contact)) || [];
    
    return { data: contacts, error: null };
  } catch (error) {
    console.error("Error creating contact:", error);
    return { data: null, error };
  }
};

// Update an existing contact
export const updateContact = async (id: string, contactData: Partial<Contact>) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || 'demo-user-123';
    
    // Prepare data for Supabase
    const supabaseData = mapContactToSupabase(contactData, userId);
    
    const { data, error } = await supabase
      .from('contacts')
      .update(supabaseData)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    
    // Map the response back to our Contact type
    const contacts = data?.map(contact => mapSupabaseToContact(contact)) || [];
    
    return { data: contacts, error: null };
  } catch (error) {
    console.error("Error updating contact:", error);
    return { data: null, error };
  }
};

// Delete a contact
export const deleteContact = async (id: string) => {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error("Error deleting contact:", error);
    return { error };
  }
};

// Import contacts from CSV/Excel
export const importContacts = async (contacts: Partial<Contact>[]) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || 'demo-user-123';
    
    // Prepare data for Supabase
    const supabaseData = contacts.map(contact => mapContactToSupabase(contact, userId));
    
    // Process in batches to avoid request size limits
    const batchSize = 50;
    const results = [];
    
    for (let i = 0; i < supabaseData.length; i += batchSize) {
      const batch = supabaseData.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('contacts')
        .insert(batch)
        .select();
      
      if (error) throw error;
      if (data) results.push(...data);
    }
    
    // Map the response back to our Contact type
    const importedContacts = results.map(contact => mapSupabaseToContact(contact));
    
    return { data: importedContacts, error: null };
  } catch (error) {
    console.error("Error importing contacts:", error);
    return { data: null, error };
  }
};

// Get a single contact by ID
export const getContact = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Map to Contact type
    const contact = data ? mapSupabaseToContact(data) : null;
    
    return { data: contact, error: null };
  } catch (error) {
    console.error("Error getting contact:", error);
    return { data: null, error };
  }
};

// Search contacts
export const searchContacts = async (query: string) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || 'demo-user-123';
    
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
      .order('name');
      
    if (error) throw error;
    
    // Map to Contact type
    const contacts = data?.map(contact => mapSupabaseToContact(contact)) || [];
    
    return { data: contacts, error: null };
  } catch (error) {
    console.error("Error searching contacts:", error);
    return { data: null, error };
  }
};