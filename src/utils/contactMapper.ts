import { Contact } from "../types";

// Convert Supabase data to app Contact format
export const mapSupabaseToContact = (data: any): Contact => {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    position: data.position,
    status: data.status || 'lead',
    score: data.score,
    lastContact: data.last_contact ? new Date(data.last_contact) : undefined,
    notes: data.notes,
    industry: data.industry,
    location: data.location,
    userId: data.user_id
  };
};

// Convert app Contact to Supabase format
export const mapContactToSupabase = (contact: Partial<Contact>, userId?: string): any => {
  const supabaseContact: any = {
    ...contact,
    user_id: userId || contact.userId,
  };
  
  // Rename lastContact to last_contact for Supabase
  if (contact.lastContact) {
    supabaseContact.last_contact = contact.lastContact;
    delete supabaseContact.lastContact;
  }
  
  // Remove userId as we've already mapped it to user_id
  delete supabaseContact.userId;
  
  return supabaseContact;
};