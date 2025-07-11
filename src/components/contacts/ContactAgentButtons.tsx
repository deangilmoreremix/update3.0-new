import React, { useState } from 'react';
import { Contact } from '../../types';
import { Brain, Target, Mail, Zap } from 'lucide-react';
import AgentModal from '../shared/AgentModal';

interface ContactAgentButtonsProps {
  contact: Contact;
  className?: string;
}

const ContactAgentButtons: React.FC<ContactAgentButtonsProps> = ({ contact, className = '' }) => {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button 
        className="flex items-center py-1 px-2 bg-blue-100 hover:bg-blue-200 rounded text-xs font-medium text-blue-700"
        onClick={() => setActiveAgent('lead-enrichment')}
      >
        <Brain size={14} className="mr-1" /> Enrich Lead
      </button>
      
      <button 
        className="flex items-center py-1 px-2 bg-purple-100 hover:bg-purple-200 rounded text-xs font-medium text-purple-700"
        onClick={() => setActiveAgent('ai-sdr')}
      >
        <Target size={14} className="mr-1" /> SDR Sequence
      </button>
      
      <button 
        className="flex items-center py-1 px-2 bg-indigo-100 hover:bg-indigo-200 rounded text-xs font-medium text-indigo-700"
        onClick={() => setActiveAgent('personalized-email')}
      >
        <Mail size={14} className="mr-1" /> Personalized Email
      </button>
      
      <button 
        className="flex items-center py-1 px-2 bg-amber-100 hover:bg-amber-200 rounded text-xs font-medium text-amber-700"
        onClick={() => setActiveAgent('lead-scoring')}
      >
        <Zap size={14} className="mr-1" /> Lead Scoring
      </button>

      {/* Agent Modal */}
      {activeAgent && (
        <AgentModal
          agentId={activeAgent}
          data={contact}
          onClose={() => setActiveAgent(null)}
        />
      )}
    </div>
  );
};

export default ContactAgentButtons;