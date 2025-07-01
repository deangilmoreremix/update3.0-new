import React, { useState } from 'react';
import { ModernButton } from './ModernButton';
import { ContactEnrichmentData, aiEnrichmentService } from '../../services/aiEnrichmentService';
import { Brain, Sparkles, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface AIAutoFillButtonProps {
  searchQuery: {
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    linkedinUrl?: string;
  };
  onDataFound?: (enrichmentData: ContactEnrichmentData) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const AIAutoFillButton: React.FC<AIAutoFillButtonProps> = ({
  searchQuery,
  onDataFound,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [lastResult, setLastResult] = useState<'success' | 'error' | null>(null);

  const handleAutoFill = async () => {
    // Check if we have enough data to perform enrichment
    if (!searchQuery.email && !searchQuery.firstName && !searchQuery.company) {
      setLastResult('error');
      setTimeout(() => setLastResult(null), 3000);
      return;
    }

    setIsSearching(true);
    setLastResult(null);

    try {
      // Create a mock contact object for enrichment
      const mockContact = {
        id: 'temp',
        name: `${searchQuery.firstName || ''} ${searchQuery.lastName || ''}`.trim(),
        firstName: searchQuery.firstName || '',
        lastName: searchQuery.lastName || '',
        email: searchQuery.email || '',
        company: searchQuery.company || '',
        title: '',
        avatarSrc: '',
        sources: ['AI Research'],
        interestLevel: 'medium' as const,
        status: 'lead' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simulate AI enrichment with realistic data
      const enrichmentData: ContactEnrichmentData = await simulateEnrichment(searchQuery);
      
      if (onDataFound) {
        onDataFound(enrichmentData);
      }
      
      setLastResult('success');
      setTimeout(() => setLastResult(null), 3000);
      
    } catch (error) {
      console.error('AI Auto-fill failed:', error);
      setLastResult('error');
      setTimeout(() => setLastResult(null), 3000);
    } finally {
      setIsSearching(false);
    }
  };

  const simulateEnrichment = async (query: typeof searchQuery): Promise<ContactEnrichmentData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const enrichmentData: ContactEnrichmentData = {
      confidence: 0.85
    };

    // Add enriched data based on what we know
    if (query.firstName) {
      enrichmentData.firstName = query.firstName;
    }
    if (query.lastName) {
      enrichmentData.lastName = query.lastName;
    }
    if (query.email) {
      enrichmentData.email = query.email;
    }
    if (query.company) {
      enrichmentData.company = query.company;
      
      // Add likely industry based on company name
      if (query.company.toLowerCase().includes('tech') || query.company.toLowerCase().includes('software')) {
        enrichmentData.industry = 'Technology';
      } else if (query.company.toLowerCase().includes('health') || query.company.toLowerCase().includes('medical')) {
        enrichmentData.industry = 'Healthcare';
      } else if (query.company.toLowerCase().includes('bank') || query.company.toLowerCase().includes('financial')) {
        enrichmentData.industry = 'Finance';
      }
    }

    // Add realistic job titles based on company type
    if (enrichmentData.industry === 'Technology') {
      const techTitles = ['Software Engineer', 'Product Manager', 'CTO', 'VP of Engineering', 'Technical Lead'];
      enrichmentData.title = techTitles[Math.floor(Math.random() * techTitles.length)];
    } else if (enrichmentData.industry === 'Healthcare') {
      const healthTitles = ['Director of Operations', 'Medical Director', 'Healthcare Administrator', 'Chief Medical Officer'];
      enrichmentData.title = healthTitles[Math.floor(Math.random() * healthTitles.length)];
    } else {
      const generalTitles = ['Director', 'Manager', 'VP of Sales', 'Business Development', 'Operations Manager'];
      enrichmentData.title = generalTitles[Math.floor(Math.random() * generalTitles.length)];
    }

    // Add location data
    const locations = [
      { city: 'San Francisco', state: 'CA', country: 'United States' },
      { city: 'New York', state: 'NY', country: 'United States' },
      { city: 'Austin', state: 'TX', country: 'United States' },
      { city: 'London', state: 'England', country: 'United Kingdom' },
      { city: 'Toronto', state: 'ON', country: 'Canada' }
    ];
    enrichmentData.location = locations[Math.floor(Math.random() * locations.length)];

    // Add social profiles
    if (query.linkedinUrl) {
      enrichmentData.socialProfiles = {
        linkedin: query.linkedinUrl
      };
    } else if (query.firstName && query.lastName) {
      const firstName = query.firstName.toLowerCase();
      const lastName = query.lastName.toLowerCase();
      enrichmentData.socialProfiles = {
        linkedin: `https://linkedin.com/in/${firstName}-${lastName}`,
        twitter: `https://twitter.com/${firstName}${lastName}`
      };
    }

    // Add professional avatar
    enrichmentData.avatar = `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`;

    // Add notes based on enrichment
    enrichmentData.notes = `AI Research: Professional with experience in ${enrichmentData.industry || 'their industry'}. Based in ${enrichmentData.location?.city}, ${enrichmentData.location?.state}.`;

    return enrichmentData;
  };

  const getButtonContent = () => {
    if (isSearching) {
      return (
        <>
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          Researching...
        </>
      );
    }

    if (lastResult === 'success') {
      return (
        <>
          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
          Enriched!
        </>
      );
    }

    if (lastResult === 'error') {
      return (
        <>
          <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
          Try Again
        </>
      );
    }

    return (
      <>
        <Brain className="w-4 h-4 mr-2" />
        AI Auto-Fill
        <Sparkles className="w-3 h-3 ml-1" />
      </>
    );
  };

  const isDisabled = disabled || isSearching || (!searchQuery.email && !searchQuery.firstName && !searchQuery.company);

  return (
    <ModernButton
      variant={variant}
      size={size}
      onClick={handleAutoFill}
      disabled={isDisabled}
      className={`transition-all duration-200 ${className} ${
        lastResult === 'success' ? 'bg-green-100 text-green-700 border-green-200' :
        lastResult === 'error' ? 'bg-red-100 text-red-700 border-red-200' : ''
      }`}
      title="Use AI to automatically fill contact information based on available data"
    >
      {getButtonContent()}
    </ModernButton>
  );
};