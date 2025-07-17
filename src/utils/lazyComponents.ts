import { lazy } from 'react';

// Lazy load pages for better performance (using correct paths)
export const Dashboard = lazy(() => import('../../pages/DashboardEnhanced'));
export const Contacts = lazy(() => import('../../pages/ContactsEnhanced'));
export const ContactDetail = lazy(() => import('../../pages/ContactDetail'));
export const Pipeline = lazy(() => import('../../pages/PipelineEnhanced'));
export const Tasks = lazy(() => import('../../pages/TasksSimple'));
export const TaskCalendar = lazy(() => import('../../pages/TaskCalendarView'));
export const Appointments = lazy(() => import('../../pages/Appointments'));
export const PhoneSystem = lazy(() => import('../../pages/PhoneSystem'));
export const TextMessages = lazy(() => import('../../pages/TextMessages'));
export const VideoEmail = lazy(() => import('../../pages/VideoEmail'));
export const Invoicing = lazy(() => import('../../pages/Invoicing'));
export const Settings = lazy(() => import('../../pages/Settings'));
export const AITools = lazy(() => import('../../pages/AITools'));
export const SalesTools = lazy(() => import('../../pages/SalesTools'));
export const LeadAutomation = lazy(() => import('../../pages/LeadAutomation'));
export const CircleProspecting = lazy(() => import('../../pages/CircleProspecting'));
export const FormsAndSurveys = lazy(() => import('../../pages/FormsAndSurveys'));
export const BusinessAnalyzer = lazy(() => import('../../pages/BusinessAnalysis/BusinessAnalyzer'));
export const ContentLibrary = lazy(() => import('../../pages/ContentLibrary/ContentLibrary'));
export const VoiceProfiles = lazy(() => import('../../pages/VoiceProfiles/VoiceProfiles'));
export const CommunicationHub = lazy(() => import('../../pages/CommunicationHub'));
export const DocumentCenter = lazy(() => import('../../pages/DocumentCenter'));
export const AnalyticsDashboard = lazy(() => import('../../pages/AnalyticsDashboard'));
export const LeadCapture = lazy(() => import('../../pages/LeadCapture'));

// AI Goals and Demo Pages
export const AIGoalsPage = lazy(() => import('../../pages/AIGoals/AIGoalsPageEnhanced'));
export const GoalCardDemo = lazy(() => import('../../pages/GoalCardDemo'));

// Partner and Admin Pages
export const PartnerOnboardingPage = lazy(() => import('../../pages/PartnerOnboardingPage'));
export const PartnerDashboard = lazy(() => import('../../pages/PartnerDashboard'));
export const SuperAdminDashboard = lazy(() => import('../../pages/SuperAdminDashboard'));
export const UserManagement = lazy(() => import('../../pages/UserManagement'));
export const WhiteLabelCustomization = lazy(() => import('../../pages/WhiteLabelCustomization'));
export const PartnerManagementPage = lazy(() => import('../../pages/PartnerManagementPage'));
export const RevenueSharingPage = lazy(() => import('../../pages/RevenueSharingPage'));
export const FeaturePackageManagementPage = lazy(() => import('../../pages/FeaturePackageManagementPage'));

// Feature Pages
export const AiToolsFeaturePage = lazy(() => import('../../pages/Landing/FeaturePage/AiToolsFeaturePage'));
export const ContactsFeaturePage = lazy(() => import('../../pages/Landing/FeaturePage/ContactsFeaturePage'));
export const PipelineFeaturePage = lazy(() => import('../../pages/Landing/FeaturePage/PipelineFeaturePage'));
export const AiAssistantFeaturePage = lazy(() => import('../../pages/Landing/FeaturePage/AiAssistantFeaturePage'));
export const VisionAnalyzerFeaturePage = lazy(() => import('../../pages/Landing/FeaturePage/VisionAnalyzerFeaturePage'));
export const ImageGeneratorFeaturePage = lazy(() => import('../../pages/Landing/FeaturePage/ImageGeneratorFeaturePage'));
export const SemanticSearchFeaturePage = lazy(() => import('../../pages/Landing/FeaturePage/SemanticSearchFeaturePage'));
export const FunctionAssistantFeaturePage = lazy(() => import('../../pages/Landing/FeaturePage/FunctionAssistantFeaturePage'));
export const CommunicationsFeaturePage = lazy(() => import('../../pages/Landing/FeaturePage/CommunicationsFeaturePage'));

// Public Pages (non-lazy for faster initial load)
export const LandingPage = lazy(() => import('../../pages/Landing/LandingPage'));
export const FormPublic = lazy(() => import('../../pages/FormPublic'));
export const FAQ = lazy(() => import('../../pages/FAQ'));
export const UnauthorizedPage = lazy(() => import('../../pages/UnauthorizedPage'));

// Auth Pages (keep non-lazy for critical path)
export { default as Login } from '../../pages/Auth/Login';
export { default as Register } from '../../pages/Auth/Register';
export { default as ForgotPassword } from '../../pages/Auth/ForgotPassword';
