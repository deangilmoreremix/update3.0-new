import { useCallback } from 'react';
import { useAuth } from './useAuth';

export interface FeatureAccessResult {
  hasAccess: boolean;
  showUpgradePrompt: () => void;
  requiredPlan: string;
}

export const useFeatureAccess = () => {
  const { user } = useAuth();
  const [upgradePrompt, setUpgradePrompt] = useState<{
    isOpen: boolean;
    featureName: string;
    requiredPlan: string;
    currentPlan: string;
  }>({
    isOpen: false,
    featureName: '',
    requiredPlan: '',
    currentPlan: ''
  });

  const checkFeatureAccess = useCallback((featureId: string, featureName: string): FeatureAccessResult => {
    const currentPlan = user?.subscriptionPlan || 'free';
    
    // Define feature requirements
    const featureRequirements: Record<string, string> = {
      // Core features (always available)
      'core_features': 'free',
      
      // Basic plan features
      'sales_tools': 'basic',
      'communication_tools': 'basic',
      'task_features': 'basic',
      'content_features': 'basic',
      
      // Professional plan features
      'ai_tools': 'professional',
      'analytics': 'professional',
      'apps_integration': 'professional',
      
      // Enterprise features
      'white_label': 'enterprise',
      'admin_features': 'enterprise',
    };

    const requiredPlan = featureRequirements[featureId] || 'free';
    
    // Plan hierarchy: free < basic < professional < enterprise
    const planHierarchy = ['free', 'basic', 'professional', 'enterprise'];
    const currentPlanIndex = planHierarchy.indexOf(currentPlan);
    const requiredPlanIndex = planHierarchy.indexOf(requiredPlan);
    
    const hasAccess = currentPlanIndex >= requiredPlanIndex;
    
    const showUpgradePrompt = () => {
      setUpgradePrompt({
        isOpen: true,
        featureName,
        requiredPlan,
        currentPlan
      });
    };

    return {
      hasAccess,
      showUpgradePrompt,
      requiredPlan
    };
  }, [user]);

  const closeUpgradePrompt = () => {
    setUpgradePrompt(prev => ({ ...prev, isOpen: false }));
  };

  const handleUpgrade = async (newPlan: string) => {
    try {
      const response = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.id, 
          newPlan 
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Upgrade successful:', result);
        
        // In a real app, you would refresh the user data here
        // For now, we'll just close the prompt
        closeUpgradePrompt();
        
        // You might want to show a success message
        alert(`Successfully upgraded to ${newPlan} plan!`);
      } else {
        throw new Error('Upgrade failed');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Upgrade failed. Please try again.');
    }
  };

  return {
    checkFeatureAccess,
    upgradePrompt,
    closeUpgradePrompt,
    handleUpgrade
  };
};

export default useFeatureAccess;