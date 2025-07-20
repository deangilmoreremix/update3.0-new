// Re-export from the singleton manager to maintain compatibility
export { supabase, isValidUUID } from './supabaseManager';

// Re-export all helper functions
export {
  getCurrentUser,
  fetchBusinessAnalysis,
  createBusinessAnalysis,
  fetchContentItems,
  createContentItem,
  deleteContentItem,
  fetchVoiceProfiles,
  createVoiceProfile,
  updateVoiceProfile,
  deleteVoiceProfile,
  callEdgeFunction
} from './supabaseHelpers';