import React, { useState } from 'react';
import { ModernButton } from './ModernButton';
import { aiEnrichmentService } from '../../services/aiEnrichmentService';
import { Contact } from '../../types';
import { Search, Brain, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface AIResearchButtonProps {
  contact: Partial<Contact>;
  onResearchComplete?: (enrichedData: Partial<Contact>) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const AIResearchButton: React.FC<AIResearchButtonProps> = ({
  contact,
  onResearchComplete,
  variant = 'outline',
  size = 'sm',
  disabled = false,
  className = ''
}) => {
  const [isResearching, setIsResearching] = useState(false);
  const [researchStatus, setResearchStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleResearch = async () => {
    if (!contact.name || isResearching) return;

    setIsResearching(true);
    setResearchStatus('idle');

    try {
      const result = await aiEnrichmentService.researchContact(contact as Contact);
      
      if (result.success && result.enrichedData) {
        setResearchStatus('success');
        onResearchComplete?.(result.enrichedData);
        
        // Reset status after 2 seconds
        setTimeout(() => setResearchStatus('idle'), 2000);
      } else {
        setResearchStatus('error');
        setTimeout(() => setResearchStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Research failed:', error);
      setResearchStatus('error');
      setTimeout(() => setResearchStatus('idle'), 3000);
    } finally {
      setIsResearching(false);
    }
  };

  const getButtonContent = () => {
    if (isResearching) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Researching...</span>
        </>
      );
    }

    if (researchStatus === 'success') {
      return (
        <>
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Research Complete</span>
        </>
      );
    }

    if (researchStatus === 'error') {
      return (
        <>
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>Research Failed</span>
        </>
      );
    }

    return (
      <>
        <Brain className="w-4 h-4" />
        <span>AI Research</span>
      </>
    );
  };

  const isDisabled = disabled || isResearching || !contact.name;

  return (
    <ModernButton
      variant={researchStatus === 'success' ? 'outline' : variant}
      size={size}
      disabled={isDisabled}
      onClick={handleResearch}
      className={`flex items-center space-x-2 transition-all duration-200 ${
        researchStatus === 'success' ? 'border-green-200 bg-green-50' :
        researchStatus === 'error' ? 'border-red-200 bg-red-50' :
        ''
      } ${className}`}
    >
      {getButtonContent()}
    </ModernButton>
  );
};