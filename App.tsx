import React, { Suspense } from 'react';
import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Settings as SettingsIcon } from 'lucide-react';


import { AIToolsProvider } from './AIToolsProvider';
import { TenantProvider } from './TenantProvider';
import { RoleProvider } from './RoleBasedAccess';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { queryClient } from './lib/queryClient';
import { ProtectedRoute, SuperAdminRoute, ResellerRoute, UserRoute } from './auth/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { VideoCallProvider } from './contexts/VideoCallContext';

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Landing Pages (keep these non-lazy as they're likely to be used immediately)
import LandingPage from './pages/Landing/LandingPage';

// Auth Pages (keep these non-lazy as they're critical for first load)
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register'; 
import ForgotPassword from './pages/Auth/ForgotPassword';

// Lazy load heavy components to reduce initial bundle size
const Dashboard = React.lazy(() => import('./pages/DashboardEnhanced'));
const Contacts = React.lazy(() => import('./pages/ContactsEnhanced'));
const ContactDetail = React.lazy(() => import('./pages/ContactDetail'));
const Pipeline = React.lazy(() => import('./pages/PipelineEnhanced'));
const Tasks = React.lazy(() => import('./pages/TasksSimple'));
const TaskCalendarView = React.lazy(() => import('./pages/TaskCalendarView'));
const Appointments = React.lazy(() => import('./pages/Appointments'));
const PhoneSystem = React.lazy(() => import('./pages/PhoneSystem'));
const TextMessages = React.lazy(() => import('./pages/TextMessages'));
const VideoEmail = React.lazy(() => import('./pages/VideoEmail'));
const Invoicing = React.lazy(() => import('./pages/Invoicing'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));
const AITools = React.lazy(() => import('./pages/AITools'));
const SalesTools = React.lazy(() => import('./pages/SalesTools'));
const LeadAutomation = React.lazy(() => import('./pages/LeadAutomation'));
const CircleProspecting = React.lazy(() => import('./pages/CircleProspecting'));
const FormsAndSurveys = React.lazy(() => import('./pages/FormsAndSurveys'));
const FormPublic = React.lazy(() => import('./pages/FormPublic'));
const FAQ = React.lazy(() => import('./pages/FAQ'));

// Business Analysis
const BusinessAnalyzer = React.lazy(() => import('./pages/BusinessAnalysis/BusinessAnalyzer'));

// Content Library
const ContentLibrary = React.lazy(() => import('./pages/ContentLibrary/ContentLibrary'));

// Voice Profiles
const VoiceProfiles = React.lazy(() => import('./pages/VoiceProfiles/VoiceProfiles'));

// New Feature Pages
const CommunicationHub = React.lazy(() => import('./pages/CommunicationHub'));
const DocumentCenter = React.lazy(() => import('./pages/DocumentCenter'));
const AnalyticsDashboard = React.lazy(() => import('./pages/AnalyticsDashboard'));
const LeadCapture = React.lazy(() => import('./pages/LeadCapture'));

// Feature Pages (keep non-lazy for landing page performance)
import AiToolsFeaturePage from './pages/Landing/FeaturePage/AiToolsFeaturePage';
import ContactsFeaturePage from './pages/Landing/FeaturePage/ContactsFeaturePage';
import PipelineFeaturePage from './pages/Landing/FeaturePage/PipelineFeaturePage';
import AiAssistantFeaturePage from './pages/Landing/FeaturePage/AiAssistantFeaturePage';
import VisionAnalyzerFeaturePage from './pages/Landing/FeaturePage/VisionAnalyzerFeaturePage';
import ImageGeneratorFeaturePage from './pages/Landing/FeaturePage/ImageGeneratorFeaturePage';
import SemanticSearchFeaturePage from './pages/Landing/FeaturePage/SemanticSearchFeaturePage';
import FunctionAssistantFeaturePage from './pages/Landing/FeaturePage/FunctionAssistantFeaturePage';
import CommunicationsFeaturePage from './pages/Landing/FeaturePage/CommunicationsFeaturePage';

// Admin and specialized pages
const GoalCardDemo = React.lazy(() => import('./pages/GoalCardDemo'));
const AIGoalsPage = React.lazy(() => import('./pages/AIGoals/AIGoalsPageEnhanced'));
const PartnerOnboardingPage = React.lazy(() => import('./pages/PartnerOnboardingPage'));
const PartnerDashboard = React.lazy(() => import('./pages/PartnerDashboard'));
const SuperAdminDashboard = React.lazy(() => import('./pages/SuperAdminDashboard'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));
const WhiteLabelCustomization = React.lazy(() => import('./pages/WhiteLabelCustomization'));
const PartnerManagementPage = React.lazy(() => import('./pages/PartnerManagementPage'));
import RevenueSharingPage from './pages/RevenueSharingPage';
import FeaturePackageManagementPage from './pages/FeaturePackageManagementPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Layout Components
import Navbar from './Navbar';
import ErrorBoundary from './src/components/common/ErrorBoundary';

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
    <ErrorBoundary>
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
                      {/* Auth routes (available for future Clerk integration) */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/signup" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />

                      {/* Public routes */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/landing" element={<LandingPage />} />
                      <Route path="/form/:formId" element={<FormPublic />} />
                      <Route path="/faq" element={<FAQ />} />

                      {/* Protected routes with role-based access */}
                      <Route path="/dashboard" element={
                        <AuthenticatedLayout>
                          <Suspense fallback={<LoadingSpinner />}>
                            <Dashboard />
                          </Suspense>
                        </AuthenticatedLayout>
                      } />

                      <Route path="/contacts" element={
                        <AuthenticatedLayout>
                          <Suspense fallback={<LoadingSpinner />}>
                            <Contacts />
                          </Suspense>
                        </AuthenticatedLayout>
                      } />

                      <Route path="/contacts/:id" element={
                        <AuthenticatedLayout>
                          <Suspense fallback={<LoadingSpinner />}>
                            <ContactDetail />
                          </Suspense>
                        </AuthenticatedLayout>
                      } />

                      <Route path="/pipeline" element={
                        <AuthenticatedLayout>
                          <Suspense fallback={<LoadingSpinner />}>
                            <Pipeline />
                          </Suspense>
                        </AuthenticatedLayout>
                      } />

                      <Route path="/tasks" element={
                        <AuthenticatedLayout>
                          <Suspense fallback={<LoadingSpinner />}>
                            <Tasks />
                          </Suspense>
                        </AuthenticatedLayout>
                      } />

                      <Route path="/tasks/calendar" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <TaskCalendarView />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/calendar" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <TaskCalendarView />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/appointments" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <Appointments />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/phone-system" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <PhoneSystem />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/text-messages" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <TextMessages />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/video-email" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <VideoEmail />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/invoicing" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <Invoicing />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/ai-tools" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <AITools />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/sales-tools" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <SalesTools />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/lead-automation" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <LeadAutomation />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/circle-prospecting" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <CircleProspecting />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/forms" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <FormsAndSurveys />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/business-analysis" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <BusinessAnalyzer />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/content-library" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <ContentLibrary />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/voice-profiles" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <VoiceProfiles />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/campaigns" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <CommunicationHub />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/communication-hub" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <CommunicationHub />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/document-center" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <DocumentCenter />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/analytics-dashboard" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <AnalyticsDashboard />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/lead-capture" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <LeadCapture />
                          </Suspense>
                        </ProtectedRoute>
                      } />

                      <Route path="/settings" element={
                        <ProtectedRoute>
                          <Suspense fallback={<LoadingSpinner />}>
                            <SettingsPage />
                          </Suspense>
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
                      <Route path="/ai-goals" element={
                        <UserRoute>
                          <AuthenticatedLayout>
                            <AIGoalsPage />
                          </AuthenticatedLayout>
                        </UserRoute>
                      } />
                      <Route path="/partner/onboard" element={<PartnerOnboardingPage />} />
                      <Route path="/partner/dashboard" element={
                        <ResellerRoute>
                          <AuthenticatedLayout>
                            <PartnerDashboard />
                          </AuthenticatedLayout>
                        </ResellerRoute>
                      } />
                      <Route path="/admin/dashboard" element={
                        <SuperAdminRoute>
                          <AuthenticatedLayout>
                            <SuperAdminDashboard />
                          </AuthenticatedLayout>
                        </SuperAdminRoute>
                      } />
                      <Route path="/admin/users" element={
                        <SuperAdminRoute>
                          <AuthenticatedLayout>
                            <UserManagement />
                          </AuthenticatedLayout>
                        </SuperAdminRoute>
                      } />
                      <Route path="/admin/white-label" element={
                        <SuperAdminRoute>
                          <AuthenticatedLayout>
                            <WhiteLabelCustomization />
                          </AuthenticatedLayout>
                        </SuperAdminRoute>
                      } />
                      <Route path="/admin/partner-management" element={
                        <SuperAdminRoute>
                          <AuthenticatedLayout>
                            <PartnerManagementPage />
                          </AuthenticatedLayout>
                        </SuperAdminRoute>
                      } />
                      <Route path="/admin/revenue-sharing" element={
                        <SuperAdminRoute>
                          <AuthenticatedLayout>
                            <RevenueSharingPage />
                          </AuthenticatedLayout>
                        </SuperAdminRoute>
                      } />
                      <Route path="/admin/feature-packages" element={
                        <SuperAdminRoute>
                          <AuthenticatedLayout>
                            <FeaturePackageManagementPage />
                          </AuthenticatedLayout>
                        </SuperAdminRoute>
                      } />

                      {/* Additional routes for advanced navbar tools */}
                      <Route path="/task-management" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Tasks />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/task-automation" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <LeadAutomation />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/project-tracker" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Tasks />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/time-tracking" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Tasks />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/workflow-builder" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <LeadAutomation />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/deadline-manager" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Tasks />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/image-generator" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <AITools />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/ai-model-demo" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <AITools />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/feature-access-demo" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                              <SettingsPage />
                            </Suspense>
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/sso-config" element={
                        <SuperAdminRoute>
                          <AuthenticatedLayout>
                            <Suspense fallback={<LoadingSpinner />}>
                              <SettingsPage />
                            </Suspense>
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
    </ErrorBoundary>
  );
}

export default App;