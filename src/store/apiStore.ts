import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiKeys } from '../types';

export const useApiStore = create<ApiState>()(
  persist(
    (set, get) => ({
      apiKeys: {
        openai: '',
        gemini: '',
        elevenlabs: '',
      },
      setOpenAiKey: (key: string) => set(state => ({ 
        apiKeys: { ...state.apiKeys, openai: key } 
      })),
      setGeminiKey: (key: string) => set(state => ({ 
        apiKeys: { ...state.apiKeys, gemini: key } 
      })),
      setElevenLabsKey: (key: string) => set(state => ({ 
        apiKeys: { ...state.apiKeys, elevenlabs: key } 
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
