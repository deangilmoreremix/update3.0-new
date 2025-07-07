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
        openai: '',
        gemini: '',
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