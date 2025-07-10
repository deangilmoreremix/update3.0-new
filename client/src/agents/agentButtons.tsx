import React from 'react';
import { 
  Brain, Target, Mail, Zap, FileText, Video, Shield, Send,
  CheckSquare, Phone, MessageSquare, Calendar, Headphones,
  Navigation, Hash, RefreshCw
} from 'lucide-react';

const agentButtonMap: Record<string, { label: string; icon: React.ReactElement }> = {
  // Contact Module Agents
  'lead-enrichment': {
    label: 'Lead Enrichment',
    icon: <Brain size={16} />
  },
  'ai-sdr': {
    label: 'AI SDR',
    icon: <Target size={16} />
  },
  'personalized-email': {
    label: 'Personalized Email',
    icon: <Mail size={16} />
  },
  'lead-scoring': {
    label: 'Lead Scoring',
    icon: <Zap size={16} />
  },
  
  // Deal Module Agents
  'proposal-generator': {
    label: 'Proposal Generator',
    icon: <FileText size={16} />
  },
  'ai-ae': {
    label: 'AI Account Executive',
    icon: <Video size={16} />
  },
  'objection-handler': {
    label: 'Objection Handler',
    icon: <Shield size={16} />
  },
  'cold-outreach-closer': {
    label: 'Cold Outreach Closer',
    icon: <Send size={16} />
  },
  'smart-demo-bot': {
    label: 'Smart Demo Bot',
    icon: <Video size={16} />
  },
  
  // Task Module Agents
  'follow-up': {
    label: 'Follow-up Agent',
    icon: <CheckSquare size={16} />
  },
  'voice-agent': {
    label: 'Voice Agent',
    icon: <Phone size={16} />
  },
  'sms-campaigner': {
    label: 'SMS Campaigner',
    icon: <MessageSquare size={16} />
  },
  
  // Calendar Module Agents
  'meetings-agent': {
    label: 'Meetings Agent',
    icon: <Calendar size={16} />
  },
  'ai-dialer': {
    label: 'AI Dialer',
    icon: <Headphones size={16} />
  },
  'ai-journeys': {
    label: 'AI Journeys',
    icon: <Navigation size={16} />
  },
  
  // Campaign Module Agents
  'whatsapp-nurturer': {
    label: 'WhatsApp Nurturer',
    icon: <Hash size={16} />
  },
  'reengagement-agent': {
    label: 'Re-engagement Agent',
    icon: <RefreshCw size={16} />
  }
};

export default agentButtonMap;