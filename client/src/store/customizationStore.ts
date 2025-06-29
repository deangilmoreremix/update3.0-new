import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CustomizationLocation = 'contactCards' | 'dealCards' | 'contactDetail' | 'dealDetail';

export interface ButtonConfiguration {
  contactCards: string[];
  dealCards: string[];
  contactDetail: string[];
  dealDetail: string[];
}

export interface CustomizationState {
  buttonConfigurations: ButtonConfiguration;
  isCustomizing: boolean;
  activeLocation: CustomizationLocation | null;
  
  // Actions
  setButtonConfiguration: (location: CustomizationLocation, goalIds: string[]) => void;
  getButtonConfiguration: (location: CustomizationLocation) => string[];
  resetToDefaults: (location?: CustomizationLocation) => void;
  exportConfiguration: () => string;
  importConfiguration: (config: string) => boolean;
  setCustomizing: (isCustomizing: boolean, location?: CustomizationLocation) => void;
}

// Default button configurations
const DEFAULT_CONFIGURATIONS: ButtonConfiguration = {
  contactCards: ['leadScoring', 'emailPersonalization'], // Default 2 buttons for cards
  dealCards: ['dealRiskAssessment', 'nextBestAction'], // Default 2 buttons for cards
  contactDetail: ['leadScoring', 'emailPersonalization', 'contactEnrichment'], // Default 3 for detail
  dealDetail: ['dealRiskAssessment', 'nextBestAction', 'proposalGeneration'] // Default 3 for detail
};

export const useCustomizationStore = create<CustomizationState>()(
  persist(
    (set, get) => ({
      buttonConfigurations: DEFAULT_CONFIGURATIONS,
      isCustomizing: false,
      activeLocation: null,

      setButtonConfiguration: (location: CustomizationLocation, goalIds: string[]) => {
        // Limit buttons per location (6 max for clean design)
        const limitedGoalIds = goalIds.slice(0, 6);
        
        set((state) => ({
          buttonConfigurations: {
            ...state.buttonConfigurations,
            [location]: limitedGoalIds
          }
        }));
      },

      getButtonConfiguration: (location: CustomizationLocation) => {
        const config = get().buttonConfigurations[location];
        return config || DEFAULT_CONFIGURATIONS[location];
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
        const config = get().buttonConfigurations;
        return JSON.stringify(config, null, 2);
      },

      importConfiguration: (configString: string) => {
        try {
          const config = JSON.parse(configString) as ButtonConfiguration;
          
          // Validate configuration structure
          const requiredKeys: (keyof ButtonConfiguration)[] = ['contactCards', 'dealCards', 'contactDetail', 'dealDetail'];
          const isValid = requiredKeys.every(key => 
            Array.isArray(config[key]) && config[key].every(id => typeof id === 'string')
          );
          
          if (!isValid) return false;
          
          // Apply limits to each location
          const limitedConfig: ButtonConfiguration = {
            contactCards: config.contactCards.slice(0, 6),
            dealCards: config.dealCards.slice(0, 6),
            contactDetail: config.contactDetail.slice(0, 6),
            dealDetail: config.dealDetail.slice(0, 6)
          };
          
          set({ buttonConfigurations: limitedConfig });
          return true;
        } catch {
          return false;
        }
      },

      setCustomizing: (isCustomizing: boolean, location?: CustomizationLocation) => {
        set({ 
          isCustomizing, 
          activeLocation: isCustomizing ? location || null : null 
        });
      }
    }),
    {
      name: 'ai-button-customization',
      version: 1
    }
  )
);