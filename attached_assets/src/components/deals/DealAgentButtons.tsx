import React, { useState } from 'react';
import { Deal } from '../../types';
import { FileText, Video, Shield, Send } from 'lucide-react';
import AgentModal from '../shared/AgentModal';

interface DealAgentButtonsProps {
  deal: Deal;
  className?: string;
}

const DealAgentButtons: React.FC<DealAgentButtonsProps> = ({ deal, className = '' }) => {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button 
        className="flex items-center py-1 px-2 bg-amber-100 hover:bg-amber-200 rounded text-xs font-medium text-amber-700"
        onClick={() => setActiveAgent('proposal-generator')}
      >
        <FileText size={14} className="mr-1" /> Proposal
      </button>
      
      <button 
        className="flex items-center py-1 px-2 bg-emerald-100 hover:bg-emerald-200 rounded text-xs font-medium text-emerald-700"
        onClick={() => setActiveAgent('ai-ae')}
      >
        <Video size={14} className="mr-1" /> AI Demo
      </button>
      
      <button 
        className="flex items-center py-1 px-2 bg-red-100 hover:bg-red-200 rounded text-xs font-medium text-red-700"
        onClick={() => setActiveAgent('objection-handler')}
      >
        <Shield size={14} className="mr-1" /> Handle Objections
      </button>
      
      <button 
        className="flex items-center py-1 px-2 bg-blue-100 hover:bg-blue-200 rounded text-xs font-medium text-blue-700"
        onClick={() => setActiveAgent('cold-outreach-closer')}
      >
        <Send size={14} className="mr-1" /> Outreach Closer
      </button>

      {/* Agent Modal */}
      {activeAgent && (
        <AgentModal
          agentId={activeAgent}
          data={deal}
          onClose={() => setActiveAgent(null)}
        />
      )}
    </div>
  );
};

export default DealAgentButtons;