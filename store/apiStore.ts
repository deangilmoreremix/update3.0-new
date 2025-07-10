import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiKeys } from '../types';

interface ApiState {
  apiKeys: ApiKeys;
  setOpenAiKey: (key: string) => void;
  setGeminiKey: (key: string) => void;
  hasRequiredKeys: () => boolean;
}

export const useApiStore = create<ApiState>()(
  persist(
    (set, get) => ({
      apiKeys: {
        openai: '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',
        gemini: 'AIzaSyBZ5NQ3dF5sdMBSjfkD6Oejw9VRhPTSUdc',
      },
      setOpenAiKey: (key: string) => set(state => ({ 
        apiKeys: { ...state.apiKeys, openai: key } 
      })),
      setGeminiKey: (key: string) => set(state => ({ 
        apiKeys: { ...state.apiKeys, gemini: key } 
      })),
      hasRequiredKeys: () => {
        const { apiKeys } = get();
        return Boolean(apiKeys.openai || apiKeys.gemini);
      },
    }),
    {
      name: 'ai-crm-api-storage',
    }
  )
);