import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AIToolsProvider } from './components/AIToolsProvider';
import { TenantProvider } from './components/TenantProvider';
import { RoleProvider } from './components/RoleBasedAccess';
import { NavbarPositionProvider } from './components/layout/NavbarPositionProvider';
import { AppLayout } from './components/layout/AppLayout';

// Landing Pages
import LandingPage from './pages/Landing/LandingPage';

// Auth Pages (preserved for future Clerk integration)
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Main pages
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Pipeline from './pages/Pipeline';
import Tasks from './pages/Tasks';
import TaskCalendarView from './pages/TaskCalendarView';
import Appointments from './pages/Appointments';
import PhoneSystem from './pages/PhoneSystem';
import TextMessages from './pages/TextMessages';
import VideoEmail from './pages/VideoEmail';
import Invoicing from './pages/Invoicing';
import Settings from './pages/Settings';
import AITools from './pages/AITools';
import SalesTools from './pages/SalesTools';
import LeadAutomation from './pages/LeadAutomation';
import CircleProspecting from './pages/CircleProspecting';
import FormsAndSurveys from './pages/FormsAndSurveys';
import FormPublic from './pages/FormPublic';
import FAQ from './pages/FAQ';

// Business Analysis
import BusinessAnalyzer from './pages/BusinessAnalysis/BusinessAnalyzer';

// Content Library
import ContentLibrary from './pages/ContentLibrary/ContentLibrary';

// Voice Profiles
import VoiceProfiles from './pages/VoiceProfiles/VoiceProfiles';

// Feature Pages
import AiToolsFeaturePage from './pages/Landing/FeaturePage/AiToolsFeaturePage';
import ContactsFeaturePage from './pages/Landing/FeaturePage/ContactsFeaturePage';
import PipelineFeaturePage from './pages/Landing/FeaturePage/PipelineFeaturePage';
import AiAssistantFeaturePage from './pages/Landing/FeaturePage/AiAssistantFeaturePage';
import VisionAnalyzerFeaturePage from './pages/Landing/FeaturePage/VisionAnalyzerFeaturePage';
import ImageGeneratorFeaturePage from './pages/Landing/FeaturePage/ImageGeneratorFeaturePage';
import SemanticSearchFeaturePage from './pages/Landing/FeaturePage/SemanticSearchFeaturePage';
import FunctionAssistantFeaturePage from './pages/Landing/FeaturePage/FunctionAssistantFeaturePage';
import CommunicationsFeaturePage from './pages/Landing/FeaturePage/CommunicationsFeaturePage';
import GoalCardDemo from './pages/GoalCardDemo';
import { AIGoalsPage } from './pages/AIGoalsPage';
import PartnerOnboardingPage from './pages/PartnerOnboardingPage';
import PartnerDashboard from './pages/PartnerDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import UserManagement from './pages/UserManagement';
import WhiteLabelCustomization from './pages/WhiteLabelCustomization';

// Layout Components
import Navbar from './components/Navbar';

// Protected Route wrapper (simplified without Clerk)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // For now, all routes are accessible without authentication
  // This can be updated when Clerk is re-enabled
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AppLayout>
        <main className="pt-16">
          {children}
        </main>
      </AppLayout>
    </div>
  );
};

function App() {
  return (
    <TenantProvider>
      <RoleProvider>
        <NavbarPositionProvider>
          <AIToolsProvider>
            <Router>
            <Routes>
              {/* Auth routes (available for future Clerk integration) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/form/:formId" element={<FormPublic />} />
              <Route path="/faq" element={<FAQ />} />
              
              {/* Protected routes (temporarily open for development) */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/contacts" element={
                <ProtectedRoute>
                  <Contacts />
                </ProtectedRoute>
              } />
              
              <Route path="/contacts/:id" element={
                <ProtectedRoute>
                  <ContactDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/pipeline" element={
                <ProtectedRoute>
                  <Pipeline />
                </ProtectedRoute>
              } />
              
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } />
              
              <Route path="/tasks/calendar" element={
                <ProtectedRoute>
                  <TaskCalendarView />
                </ProtectedRoute>
              } />
              
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <TaskCalendarView />
                </ProtectedRoute>
              } />
              
              <Route path="/appointments" element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              } />
              
              <Route path="/phone" element={
                <ProtectedRoute>
                  <PhoneSystem />
                </ProtectedRoute>
              } />
              
              <Route path="/text-messages" element={
                <ProtectedRoute>
                  <TextMessages />
                </ProtectedRoute>
              } />
              
              <Route path="/video-email" element={
                <ProtectedRoute>
                  <VideoEmail />
                </ProtectedRoute>
              } />
              
              <Route path="/invoicing" element={
                <ProtectedRoute>
                  <Invoicing />
                </ProtectedRoute>
              } />
              
              <Route path="/ai-tools" element={
                <ProtectedRoute>
                  <AITools />
                </ProtectedRoute>
              } />
              
              <Route path="/sales-tools" element={
                <ProtectedRoute>
                  <SalesTools />
                </ProtectedRoute>
              } />
              
              <Route path="/lead-automation" element={
                <ProtectedRoute>
                  <LeadAutomation />
                </ProtectedRoute>
              } />
              
              <Route path="/circle-prospecting" element={
                <ProtectedRoute>
                  <CircleProspecting />
                </ProtectedRoute>
              } />
              
              <Route path="/forms-surveys" element={
                <ProtectedRoute>
                  <FormsAndSurveys />
                </ProtectedRoute>
              } />
              
              <Route path="/business-analysis" element={
                <ProtectedRoute>
                  <BusinessAnalyzer />
                </ProtectedRoute>
              } />
              
              <Route path="/content-library" element={
                <ProtectedRoute>
                  <ContentLibrary />
                </ProtectedRoute>
              } />
              
              <Route path="/voice-profiles" element={
                <ProtectedRoute>
                  <VoiceProfiles />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Feature Pages */}
              <Route path="/features/ai-tools" element={<AiToolsFeaturePage />} />
              <Route path="/features/contacts" element={<ContactsFeaturePage />} />
              <Route path="/features/pipeline" element={<PipelineFeaturePage />} />
              <Route path="/features/ai-assistant" element={<AiAssistantFeaturePage />} />
              <Route path="/features/vision-analyzer" element={<VisionAnalyzerFeaturePage />} />
              <Route path="/features/image-generator" element={<ImageGeneratorFeaturePage />} />
              <Route path="/features/semantic-search" element={<SemanticSearchFeaturePage />} />
              <Route path="/features/function-assistant" element={<FunctionAssistantFeaturePage />} />
              <Route path="/features/communications" element={<CommunicationsFeaturePage />} />
              <Route path="/demo/goal-cards" element={<GoalCardDemo />} />
              <Route path="/ai-goals" element={<AIGoalsPage />} />
              <Route path="/partner/onboard" element={<PartnerOnboardingPage />} />
              <Route path="/partner/dashboard" element={<PartnerDashboard />} />
              <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/white-label" element={<WhiteLabelCustomization />} />
            </Routes>
            </Router>
          </AIToolsProvider>
        </NavbarPositionProvider>
      </RoleProvider>
    </TenantProvider>
  );
}

export default App;