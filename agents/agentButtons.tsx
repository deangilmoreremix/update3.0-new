import React from 'react';
import { Brain, Target, FileText, MessageSquare, Shield, Zap, Video, Phone, Calendar, Mail, RefreshCw, Send, Headphones } from 'lucide-react';

const agentIconMap: Record<string, { label: string; icon: React.ReactNode }> = {
  // Contact Module Agents
  'lead-enrichment': {
    label: 'Lead Enrichment',
    icon: <Brain size={18} className="text-blue-600" />
  },
  'ai-sdr': {
    label: 'SDR Sequence',
    icon: <Target size={18} className="text-purple-600" />
  },
  'personalized-email': {
    label: 'Personalized Email',
    icon: <Mail size={18} className="text-indigo-600" />
  },
  'lead-scoring': {
    label: 'Lead Scoring',
    icon: <Zap size={18} className="text-amber-600" />
  },
  
  // Deal Module Agents
  'ai-ae': {
    label: 'AI AE Demo',
    icon: <Video size={18} className="text-emerald-600" />
  },
  'objection-handler': {
    label: 'Objection Handler',
    icon: <Shield size={18} className="text-red-600" />
  },
  'cold-outreach-closer': {
    label: 'Outreach Closer',
    icon: <Send size={18} className="text-blue-600" />
  },
  'smart-demo-bot': {
    label: 'Smart Demo Bot',
    icon: <Video size={18} className="text-purple-600" />
  },
  'proposal-generator': {
    label: 'Proposal Generator',
    icon: <FileText size={18} className="text-amber-600" />
  },
  
  // Task Module Agents
  'follow-up': {
    label: 'Follow-Up',
    icon: <RefreshCw size={18} className="text-green-600" />
  },
  'voice-agent': {
    label: 'Voice Agent',
    icon: <Headphones size={18} className="text-indigo-600" />
  },
  'sms-campaigner': {
    label: 'SMS Campaigner',
    icon: <MessageSquare size={18} className="text-blue-600" />
  },
  
  // Calendar Module Agents
  'meetings-agent': {
    label: 'Meetings Agent',
    icon: <Calendar size={18} className="text-cyan-600" />
  },
  'ai-dialer': {
    label: 'AI Dialer',
    icon: <Phone size={18} className="text-blue-600" />
  },
  'ai-journeys': {
    label: 'AI Journeys',
    icon: <Zap size={18} className="text-violet-600" />
  },
  
  // Campaign Module Agents
  'whatsapp-nurturer': {
    label: 'WhatsApp Nurturer',
    icon: <MessageSquare size={18} className="text-green-600" />
  },
  'reengagement-agent': {
    label: 'Reengagement',
    icon: <RefreshCw size={18} className="text-orange-600" />
  }
};

export default agentIconMap;