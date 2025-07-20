import { supabase, isValidUUID } from './supabaseManager';

// Authentication helpers
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Database helper functions
export const fetchBusinessAnalysis = async (userId?: string) => {
  try {
    const query = supabase
      .from('business_analyzer')
      .select('*');
    
    if (userId) {
      query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    return { data, error };
  } catch (err) {
    console.error("Error fetching business analyses:", err);
    return { data: null, error: err };
  }
};

export const createBusinessAnalysis = async (analysisData: unknown) => {
  try {
    const { data, error } = await supabase
      .from('business_analyzer')
      .insert([analysisData])
      .select();
    
    return { data, error };
  } catch (err) {
    console.error("Error creating business analysis:", err);
    return { data: null, error: err };
  }
};

// Content Items
export const fetchContentItems = async (userId?: string) => {
  const query = supabase
    .from('content_items')
    .select('*');
  
  if (userId) {
    query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const createContentItem = async (contentData: unknown) => {
  const { data, error } = await supabase
    .from('content_items')
    .insert([contentData]);
  
  return { data, error };
};

export const deleteContentItem = async (id: string) => {
  const { error } = await supabase
    .from('content_items')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Voice Profiles
export const fetchVoiceProfiles = async (userId?: string) => {
  const query = supabase
    .from('voice_profiles')
    .select('*');
  
  if (userId) {
    query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const createVoiceProfile = async (profileData: unknown) => {
  const { data, error } = await supabase
    .from('voice_profiles')
    .insert([profileData]);
  
  return { data, error };
};

export const updateVoiceProfile = async (id: string, profileData: unknown) => {
  const { data, error } = await supabase
    .from('voice_profiles')
    .update(profileData)
    .eq('id', id);
  
  return { data, error };
};

export const deleteVoiceProfile = async (id: string) => {
  const { error } = await supabase
    .from('voice_profiles')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Edge Function Helpers
export const callEdgeFunction = async (functionName: string, payload: unknown) => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    if (!supabaseUrl) {
      throw new Error("Supabase URL is not defined");
    }
    
    // Get API keys from store
    let apiKeys = { openai: '', gemini: '', elevenlabs: '' };
    
    // First try to get from window if available (we're in browser)
    if (typeof window !== 'undefined') {
      try {
        const storedKeys = localStorage.getItem('ai-crm-api-storage');
        if (storedKeys) {
          const parsedStore = JSON.parse(storedKeys);
          apiKeys = parsedStore.state.apiKeys;
        }
      } catch (err) {
        console.warn('Could not retrieve API keys from localStorage');
      }
    }
    
    // Fallback to environment variables if needed
    const openaiKey = apiKeys.openai || import.meta.env.VITE_OPENAI_API_KEY || '';
    const geminiKey = apiKeys.gemini || import.meta.env.VITE_GEMINI_API_KEY || '';
    const elevenLabsKey = apiKeys.elevenlabs || import.meta.env.VITE_ELEVENLABS_API_KEY || '';
    
    // Add API keys to payload
    const enhancedPayload = {
      ...payload,
      apiKeys: {
        OPENAI_API_KEY: openaiKey,
        GEMINI_API_KEY: geminiKey,
        ELEVENLABS_API_KEY: elevenLabsKey
      }
    };
    
    const apiUrl = `${supabaseUrl}/functions/v1/${functionName}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(enhancedPayload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error calling ${functionName}: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error calling edge function ${functionName}:`, error);
    throw error;
  }
};
