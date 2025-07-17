import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { AIToolsProvider } from './AIToolsProvider';
import { TenantProvider } from './TenantProvider';
import { RoleProvider } from './RoleBasedAccess';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { queryClient } from './lib/queryClient';
import { ProtectedRoute, SuperAdminRoute, ResellerRoute, UserRoute } from './auth/ProtectedRoute';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { NavigationProvider } from './src/contexts/NavigationContext';
import { VideoCallProvider } from './src/contexts/VideoCallContext';

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

// New Feature Pages
import CommunicationHub from './pages/CommunicationHub';
import DocumentCenter from './pages/DocumentCenter';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import LeadCapture from './pages/LeadCapture';

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
import AIGoalsPage from './pages/AIGoals/AIGoalsPageEnhanced';
import PartnerOnboardingPage from './pages/PartnerOnboardingPage';
import PartnerDashboard from './pages/PartnerDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import UserManagement from './pages/UserManagement';
import WhiteLabelCustomization from './pages/WhiteLabelCustomization';
import PartnerManagementPage from './pages/PartnerManagementPage';
import RevenueSharingPage from './pages/RevenueSharingPage';
import FeaturePackageManagementPage from './pages/FeaturePackageManagementPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Layout Components
import Navbar from './Navbar';

// Layout wrapper for authenticated pages
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TenantProvider>
          <RoleProvider>
            <EnhancedHelpProvider>
              <AIToolsProvider>
                <VideoCallProvider>
                  <Router>
                    <NavigationProvider>
                      <Routes>
                        {/* Auth routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/signup" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        {/* Public routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/form/:formId" element={<FormPublic />} />
                        <Route path="/faq" element={<FAQ />} />

                        {/* Feature pages */}
                        <Route path="/ai-tools-feature" element={<AiToolsFeaturePage />} />
                        <Route path="/contacts-feature" element={<ContactsFeaturePage />} />
                        <Route path="/pipeline-feature" element={<PipelineFeaturePage />} />
                        <Route path="/ai-assistant-feature" element={<AiAssistantFeaturePage />} />
                        <Route path="/vision-analyzer-feature" element={<VisionAnalyzerFeaturePage />} />
                        <Route path="/image-generator-feature" element={<ImageGeneratorFeaturePage />} />
                        <Route path="/semantic-search-feature" element={<SemanticSearchFeaturePage />} />
                        <Route path="/function-assistant-feature" element={<FunctionAssistantFeaturePage />} />
                        <Route path="/communications-feature" element={<CommunicationsFeaturePage />} />

                        {/* Protected routes with role-based access */}
                        <Route path="/dashboard" element={
                          <UserRoute>
                            <AuthenticatedLayout>
                              <Dashboard />
                            </AuthenticatedLayout>
                          </UserRoute>
                        } />

                        <Route path="/contacts" element={
                          <UserRoute>
                            <AuthenticatedLayout>
                              <Contacts />
                            </AuthenticatedLayout>
                          </UserRoute>
                        } />

                        <Route path="/contacts/:id" element={
                          <UserRoute>
                            <AuthenticatedLayout>
                              <ContactDetail />
                            </AuthenticatedLayout>
                          </UserRoute>
                        } />

                        <Route path="/pipeline" element={
                          <UserRoute>
                            <AuthenticatedLayout>
                              <Pipeline />
                            </AuthenticatedLayout>
                          </UserRoute>
                        } />

                        <Route path="/tasks" element={
                          <UserRoute>
                            <AuthenticatedLayout>
                              <Tasks />
                            </AuthenticatedLayout>
                          </UserRoute>
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

                        <Route path="/phone-system" element={
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
                            <AuthenticatedLayout>
                              <AITools />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/sales-tools" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <SalesTools />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/lead-automation" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <LeadAutomation />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/circle-prospecting" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <CircleProspecting />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/forms-and-surveys" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <FormsAndSurveys />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/settings" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <Settings />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/business-analyzer" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <BusinessAnalyzer />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/content-library" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <ContentLibrary />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/voice-profiles" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <VoiceProfiles />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/communication-hub" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <CommunicationHub />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/document-center" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <DocumentCenter />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/analytics-dashboard" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <AnalyticsDashboard />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/lead-capture" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <LeadCapture />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/ai-goals" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <AIGoalsPage />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/goals" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <AIGoalsPage />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        <Route path="/goal-demo" element={
                          <ProtectedRoute>
                            <AuthenticatedLayout>
                              <GoalCardDemo />
                            </AuthenticatedLayout>
                          </ProtectedRoute>
                        } />

                        {/* Partner and Admin routes */}
                        <Route path="/partner-onboarding" element={
                          <ResellerRoute>
                            <AuthenticatedLayout>
                              <PartnerOnboardingPage />
                            </AuthenticatedLayout>
                          </ResellerRoute>
                        } />

                        <Route path="/partner-dashboard" element={
                          <ResellerRoute>
                            <AuthenticatedLayout>
                              <PartnerDashboard />
                            </AuthenticatedLayout>
                          </ResellerRoute>
                        } />

                        <Route path="/super-admin" element={
                          <SuperAdminRoute>
                            <AuthenticatedLayout>
                              <SuperAdminDashboard />
                            </AuthenticatedLayout>
                          </SuperAdminRoute>
                        } />

                        <Route path="/user-management" element={
                          <SuperAdminRoute>
                            <AuthenticatedLayout>
                              <UserManagement />
                            </AuthenticatedLayout>
                          </SuperAdminRoute>
                        } />

                        <Route path="/partner-management" element={
                          <SuperAdminRoute>
                            <AuthenticatedLayout>
                              <PartnerManagementPage />
                            </AuthenticatedLayout>
                          </SuperAdminRoute>
                        } />

                        <Route path="/revenue-sharing" element={
                          <SuperAdminRoute>
                            <AuthenticatedLayout>
                              <RevenueSharingPage />
                            </AuthenticatedLayout>
                          </SuperAdminRoute>
                        } />

                        <Route path="/feature-packages" element={
                          <SuperAdminRoute>
                            <AuthenticatedLayout>
                              <FeaturePackageManagementPage />
                            </AuthenticatedLayout>
                          </SuperAdminRoute>
                        } />

                        <Route path="/white-label" element={
                          <SuperAdminRoute>
                            <AuthenticatedLayout>
                              <WhiteLabelCustomization />
                            </AuthenticatedLayout>
                          </SuperAdminRoute>
                        } />

                        {/* Unauthorized route */}
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                      </Routes>
                    </NavigationProvider>
                  </Router>
                </VideoCallProvider>
              </AIToolsProvider>
            </EnhancedHelpProvider>
          </RoleProvider>
        </TenantProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
