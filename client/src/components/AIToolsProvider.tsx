import React, { createContext, useContext, useState, ReactNode } from 'react';
import AIToolModal from './shared/AIToolModal';
import { 
  Brain, 
  Mail, 
  MessageSquare, 
  FileText, 
  Phone, 
  Target, 
  FileSearch, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  ChevronRight,
  CheckCheck,
  ArrowRight,
  Play,
  User,
  Clock,
  Star,
  ExternalLink,
  BarChart,
  Users,
  Briefcase,
  Eye,
  Image,
  Mic,
  Search,
  Zap,
  MessagesSquare,
  CheckCircle,
  Sparkles,
  Shield,
  Volume2,
  Reply,
  Calendar,
  FileCode,
  FileJson,
  X,
  Hash
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StreamingChat from '../components/aiTools/StreamingChat';
import RealTimeFormValidation from '../components/aiTools/RealTimeFormValidation';
import LiveDealAnalysis from '../components/aiTools/LiveDealAnalysis';
import InstantAIResponseGenerator from '../components/aiTools/InstantAIResponseGenerator';
import DocumentAnalyzerRealtime from '../components/aiTools/DocumentAnalyzerRealtime';
import RealTimeEmailComposer from '../components/aiTools/RealTimeEmailComposer';
import VoiceAnalysisRealtime from '../components/aiTools/VoiceAnalysisRealtime';
import SmartSearchRealtime from '../components/aiTools/SmartSearchRealtime';
import AutoFormCompleter from '../components/aiTools/AutoFormCompleter';

// Import AI tool components
import EmailAnalysisContent from './aiTools/EmailAnalysisContent';
import MeetingSummaryContent from './aiTools/MeetingSummaryContent';
import CallScriptContent from './aiTools/CallScriptContent';
import SubjectLineContent from './aiTools/SubjectLineContent';
import CompetitorAnalysisContent from './aiTools/CompetitorAnalysisContent';
import MarketTrendContent from './aiTools/MarketTrendContent';
import SalesInsightsContent from './aiTools/SalesInsightsContent';
import SalesForecastContent from './aiTools/SalesForecastContent';
import EmailComposerContent from './aiTools/EmailComposerContent';
import ObjectionHandlerContent from './aiTools/ObjectionHandlerContent';
import CustomerPersonaContent from './aiTools/CustomerPersonaContent';
import VoiceToneOptimizerContent from './aiTools/VoiceToneOptimizerContent';
import EmailResponseContent from './aiTools/EmailResponseContent';
import VisualContentGeneratorContent from './aiTools/VisualContentGeneratorContent';
import MeetingAgendaContent from './aiTools/MeetingAgendaContent';

// Feature Components
import AIAssistantChat from './aiTools/AIAssistantChat';
import VisionAnalyzerContent from './aiTools/VisionAnalyzerContent';
import ImageGeneratorContent from './aiTools/ImageGeneratorContent';
import SemanticSearchContent from './aiTools/SemanticSearchContent';
import FunctionAssistantContent from './aiTools/FunctionAssistantContent';

// Reasoning-based content generators
import ReasoningEmailGenerator from './aiTools/ReasoningEmailGenerator';
import ReasoningProposalGenerator from './aiTools/ReasoningProposalGenerator';
import ReasoningScriptGenerator from './aiTools/ReasoningScriptGenerator';
import ReasoningObjectionHandler from './aiTools/ReasoningObjectionHandler';
import ReasoningSocialContent from './aiTools/ReasoningSocialContent';

type AIToolType = 
  | 'email-analysis' 
  | 'meeting-summary'
  | 'proposal-generator'
  | 'call-script'
  | 'subject-optimizer' 
  | 'competitor-analysis' 
  | 'market-trends' 
  | 'sales-insights' 
  | 'sales-forecast'
  | 'email-composer'
  | 'objection-handler'
  | 'customer-persona'
  | 'voice-tone-optimizer'
  | 'email-response'
  | 'visual-content-generator'
  | 'meeting-agenda'
  // Advanced features
  | 'ai-assistant'
  | 'vision-analyzer'
  | 'image-generator'
  | 'speech-to-text'
  | 'semantic-search'
  | 'json-tools'
  | 'streaming-chat'
  | 'function-assistant'
  // New real-time features
  | 'form-validation'
  | 'live-deal-analysis'
  | 'instant-response'
  | 'document-analyzer-realtime'
  | 'realtime-email-composer'
  | 'voice-analysis-realtime'
  | 'smart-search-realtime'
  | 'auto-form-completer'
  // Reasoning-based content generators
  | 'reasoning-email'
  | 'reasoning-proposal'
  | 'reasoning-script'
  | 'reasoning-objection'
  | 'reasoning-social';

interface AIToolsContextProps {
  openTool: (tool: AIToolType) => void;
  closeTool: () => void;
  isToolOpen: boolean;
  currentTool: AIToolType | null;
}

const AIToolsContext = createContext<AIToolsContextProps>({
  openTool: () => {},
  closeTool: () => {},
  isToolOpen: false,
  currentTool: null
});

export const useAITools = () => useContext(AIToolsContext);

interface AIToolsProviderProps {
  children: ReactNode;
}

export const AIToolsProvider: React.FC<AIToolsProviderProps> = ({ children }) => {
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState<AIToolType | null>(null);

  const openTool = (tool: AIToolType) => {
    console.log('Opening tool:', tool);
    console.log('Before state update - isOpen:', isToolOpen, 'currentTool:', currentTool);
    
    // Force immediate state update using callback form
    setCurrentTool(() => tool);
    setIsToolOpen(() => true);
    
    // Also trigger a manual re-render after a brief delay
    setTimeout(() => {
      setIsToolOpen(true);
      setCurrentTool(tool);
      console.log('Force update - tool should be open now');
    }, 50);
  };

  const closeTool = () => {
    setIsToolOpen(false);
    // Optional: Reset currentTool after modal is closed
    // setTimeout(() => setCurrentTool(null), 300);
  };

  // Get tool information based on type
  const getToolInfo = (tool: AIToolType | null) => {
    switch(tool) {
      case 'email-analysis':
        return {
          title: 'Email Analysis',
          icon: <Mail size={24} />,
          component: <EmailAnalysisContent />
        };
      case 'meeting-summary':
        return {
          title: 'Meeting Summarizer',
          icon: <MessageSquare size={24} />,
          component: <MeetingSummaryContent />
        };
      case 'proposal-generator':
        return {
          title: 'Proposal Generator',
          icon: <FileText size={24} />,
          component: null
        };
      case 'call-script':
        return {
          title: 'Call Script Generator',
          icon: <Phone size={24} />,
          component: <CallScriptContent />
        };
      case 'subject-optimizer':
        return {
          title: 'Email Subject Line Optimizer',
          icon: <Target size={24} />,
          component: <SubjectLineContent />
        };
      case 'competitor-analysis':
        return {
          title: 'Competitor Analysis',
          icon: <FileSearch size={24} />,
          component: <CompetitorAnalysisContent />
        };
      case 'market-trends':
        return {
          title: 'Market Trend Analysis',
          icon: <TrendingUp size={24} />,
          component: <MarketTrendContent />
        };
      case 'sales-insights':
        return {
          title: 'Sales Insights',
          icon: <Brain size={24} />,
          component: <SalesInsightsContent />
        };
      case 'sales-forecast':
        return {
          title: 'Sales Forecasting',
          icon: <PieChart size={24} />,
          component: <SalesForecastContent />
        };
      case 'email-composer':
        return {
          title: 'Smart Email Composer',
          icon: <Mail size={24} />,
          component: <EmailComposerContent />
        };
      case 'objection-handler':
        return {
          title: 'Objection Handler',
          icon: <Shield size={24} />,
          component: <ObjectionHandlerContent />
        };
      case 'customer-persona':
        return {
          title: 'Customer Persona Generator',
          icon: <Users size={24} />,
          component: <CustomerPersonaContent />
        };
      case 'voice-tone-optimizer':
        return {
          title: 'Voice Tone Optimizer',
          icon: <Volume2 size={24} />,
          component: <VoiceToneOptimizerContent />
        };
      case 'email-response':
        return {
          title: 'Email Response Generator',
          icon: <Reply size={24} />,
          component: <EmailResponseContent />
        };
      case 'visual-content-generator':
        return {
          title: 'Visual Content Generator',
          icon: <Image size={24} />,
          component: <VisualContentGeneratorContent />
        };
      case 'meeting-agenda':
        return {
          title: 'Meeting Agenda Generator',
          icon: <Calendar size={24} />,
          component: <MeetingAgendaContent />
        };
      // Advanced features
      case 'ai-assistant':
        return {
          title: 'AI Assistant',
          icon: <Brain size={24} />,
          component: <AIAssistantChat />
        };
      case 'vision-analyzer':
        return {
          title: 'Vision Analyzer',
          icon: <Eye size={24} />,
          component: <VisionAnalyzerContent />
        };
      case 'image-generator':
        return {
          title: 'Image Generator',
          icon: <Image size={24} />,
          component: <ImageGeneratorContent />
        };
      case 'speech-to-text':
        return {
          title: 'Speech to Text',
          icon: <Mic size={24} />,
          component: null
        };
      case 'semantic-search':
        return {
          title: 'Semantic Search',
          icon: <Search size={24} />,
          component: <SemanticSearchContent />
        };
      case 'json-tools':
        return {
          title: 'Structured Data Extraction',
          icon: <FileJson size={24} />,
          component: null
        };
      case 'streaming-chat':
        return {
          title: 'Real-time Chat',
          icon: <MessagesSquare size={24} />,
          component: <StreamingChat />
        };
      case 'function-assistant':
        return {
          title: 'CRM Function Assistant',
          icon: <Zap size={24} />,
          component: <FunctionAssistantContent />
        };
      // New real-time tools
      case 'form-validation':
        return {
          title: 'Real-time Form Validation',
          icon: <CheckCircle size={24} />,
          component: <RealTimeFormValidation />
        };
      case 'live-deal-analysis':
        return {
          title: 'Live Deal Analysis',
          icon: <BarChart3 size={24} />,
          component: <LiveDealAnalysis />
        };
      case 'instant-response':
        return {
          title: 'Instant Response Generator',
          icon: <Sparkles size={24} />,
          component: <InstantAIResponseGenerator />
        };
      case 'document-analyzer-realtime':
        return {
          title: 'Real-time Document Analyzer',
          icon: <Eye size={24} />,
          component: <DocumentAnalyzerRealtime />
        };
      case 'realtime-email-composer':
        return {
          title: 'Real-time Email Composer',
          icon: <Mail size={24} />,
          component: <RealTimeEmailComposer />
        };
      case 'voice-analysis-realtime':
        return {
          title: 'Real-time Voice Analysis',
          icon: <Mic size={24} />,
          component: <VoiceAnalysisRealtime />
        };
      case 'smart-search-realtime':
        return {
          title: 'Smart Search with Live Results',
          icon: <Search size={24} />,
          component: <SmartSearchRealtime />
        };
      case 'auto-form-completer':
        return {
          title: 'AI-Powered Form Auto-completion',
          icon: <CheckCircle size={24} />,
          component: <AutoFormCompleter />
        };
      // Reasoning-based content generators
      case 'reasoning-email':
        return {
          title: 'AI Reasoning Email Generator',
          icon: <Mail size={24} />,
          component: <ReasoningEmailGenerator />
        };
      case 'reasoning-proposal':
        return {
          title: 'AI Reasoning Proposal Generator',
          icon: <FileText size={24} />,
          component: <ReasoningProposalGenerator />
        };
      case 'reasoning-script':
        return {
          title: 'AI Reasoning Call Script Generator',
          icon: <Phone size={24} />,
          component: <ReasoningScriptGenerator />
        };
      case 'reasoning-objection':
        return {
          title: 'AI Reasoning Objection Handler',
          icon: <Shield size={24} />,
          component: <ReasoningObjectionHandler />
        };
      case 'reasoning-social':
        return {
          title: 'AI Reasoning Social Content Generator',
          icon: <Hash size={24} />,
          component: <ReasoningSocialContent />
        };
      default:
        return {
          title: '',
          icon: <Brain size={24} />,
          component: null
        };
    }
  };

  const toolInfo = getToolInfo(currentTool);

  console.log('Provider render - isToolOpen:', isToolOpen, 'currentTool:', currentTool);

  return (
    <AIToolsContext.Provider value={{ openTool, closeTool, isToolOpen, currentTool }}>
      {children}

      {isToolOpen && currentTool && (
        <AIToolModal 
          isOpen={isToolOpen}
          onClose={closeTool}
          title={toolInfo?.title || 'AI Tool'}
          icon={toolInfo?.icon || <Brain size={24} />}
          maxWidth="max-w-5xl"
        >
          {toolInfo?.component || <div>Tool not found</div>}
        </AIToolModal>
      )}
    </AIToolsContext.Provider>
  );
};