import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CustomizationLocation = 'contactCards' | 'dealCards' | 'contactDetail' | 'dealDetail' | 'aiGoalsPage';

export interface ButtonConfiguration {
  contactCards: string[];
  dealCards: string[];
  contactDetail: string[];
  dealDetail: string[];
  aiGoalsPage: string[];
}

export interface CustomizationState {
  buttonConfigurations: ButtonConfiguration;
  isCustomizing: boolean;
  activeLocation: CustomizationLocation | null;
  maxButtonsPerLocation: number;
  
  // Actions
  setSelectedGoals: (location: CustomizationLocation, goalIds: string[]) => void;
  getSelectedGoals: (location: CustomizationLocation) => string[];
  resetToDefaults: (location?: CustomizationLocation) => void;
  exportConfiguration: () => string;
  importConfiguration: (config: string) => boolean;
  setCustomizing: (isCustomizing: boolean, location?: CustomizationLocation) => void;
}

// Default button configurations
const DEFAULT_CONFIGURATIONS: ButtonConfiguration = {
  contactCards: ['leadScoring', 'emailPersonalization'],
  dealCards: ['dealRiskAssessment', 'pipelineOptimization'],
  contactDetail: ['leadScoring', 'emailPersonalization', 'businessIntelligence'],
  dealDetail: ['dealRiskAssessment', 'pipelineOptimization', 'businessIntelligence'],
  aiGoalsPage: ['leadScoring', 'dealRiskAssessment', 'businessIntelligence', 'marketResearch']
};

export const useCustomizationStore = create<CustomizationState>()(
  persist(
    (set, get) => ({
      buttonConfigurations: DEFAULT_CONFIGURATIONS,
      isCustomizing: false,
      activeLocation: null,
      maxButtonsPerLocation: 4,

      setSelectedGoals: (location: CustomizationLocation, goalIds: string[]) => {
        set((state) => ({
          buttonConfigurations: {
            ...state.buttonConfigurations,
            [location]: goalIds.slice(0, state.maxButtonsPerLocation)
          }
        }));
      },

      getSelectedGoals: (location: CustomizationLocation) => {
        const state = get();
        return state.buttonConfigurations[location] || [];
      },

      resetToDefaults: (location?: CustomizationLocation) => {
        if (location) {
          set((state) => ({
            buttonConfigurations: {
              ...state.buttonConfigurations,
              [location]: DEFAULT_CONFIGURATIONS[location]
            }
          }));
        } else {
          set({ buttonConfigurations: DEFAULT_CONFIGURATIONS });
        }
      },

      exportConfiguration: () => {
        const state = get();
        return JSON.stringify(state.buttonConfigurations);
      },

      importConfiguration: (config: string) => {
        try {
          const parsed = JSON.parse(config);
          if (parsed && typeof parsed === 'object') {
            set({ buttonConfigurations: { ...DEFAULT_CONFIGURATIONS, ...parsed } });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      setCustomizing: (isCustomizing: boolean, location?: CustomizationLocation) => {
        set({ isCustomizing, activeLocation: location || null });
      },
    }),
    {
      name: 'ai-goals-customization',
      version: 1,
    }
  )
);