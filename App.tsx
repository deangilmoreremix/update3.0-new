import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Phase 3 Performance Optimizations
import { QueryProvider } from './src/providers/QueryProvider';
import { CacheFirstDataProvider } from './src/components/optimized/CacheFirstComponents';

import { AIToolsProvider } from './AIToolsProvider';
import { TenantProvider } from './TenantProvider';
import { RoleProvider } from './RoleBasedAccess';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { ProtectedRoute, SuperAdminRoute, ResellerRoute, UserRoute } from './auth/ProtectedRoute';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { NavigationProvider } from './src/contexts/NavigationContext';

// Infrastructure Components
import ErrorBoundary from './src/components/ErrorBoundary';
import { LoadingProvider } from './src/contexts/LoadingContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { LoadingFallback, ComponentLoadingFallback, FeatureLoadingFallback } from './src/components/LoadingFallback';

// Auth Pages (keep non-lazy for critical authentication path)
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Landing Pages (immediate load)
import LandingPage from './pages/Landing/LandingPage';

// Lazy load all main application pages for performance
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
const Settings = React.lazy(() => import('./pages/Settings'));
const AITools = React.lazy(() => import('./pages/AITools'));
const SalesTools = React.lazy(() => import('./pages/SalesTools'));
const LeadAutomation = React.lazy(() => import('./pages/LeadAutomation'));
const CircleProspecting = React.lazy(() => import('./pages/CircleProspecting'));
const FormsAndSurveys = React.lazy(() => import('./pages/FormsAndSurveys'));
const FormPublic = React.lazy(() => import('./pages/FormPublic'));
const FAQ = React.lazy(() => import('./pages/FAQ'));

// Feature Status Dashboard for testing
const FeatureStatusDashboard = React.lazy(() => import('./pages/FeatureStatusDashboard'));

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

// Create simple inline components for missing pages (moved to separate files to fix linting)
// These components are defined but imports are handled by lazy loading

// Feature Pages
const AiToolsFeaturePage = React.lazy(() => import('./pages/Landing/FeaturePage/AiToolsFeaturePage'));
const ContactsFeaturePage = React.lazy(() => import('./pages/Landing/FeaturePage/ContactsFeaturePage'));
const PipelineFeaturePage = React.lazy(() => import('./pages/Landing/FeaturePage/PipelineFeaturePage'));
const AiAssistantFeaturePage = React.lazy(() => import('./pages/Landing/FeaturePage/AiAssistantFeaturePage'));
const VisionAnalyzerFeaturePage = React.lazy(() => import('./pages/Landing/FeaturePage/VisionAnalyzerFeaturePage'));
const ImageGeneratorFeaturePage = React.lazy(() => import('./pages/Landing/FeaturePage/ImageGeneratorFeaturePage'));
const SemanticSearchFeaturePage = React.lazy(() => import('./pages/Landing/FeaturePage/SemanticSearchFeaturePage'));
const FunctionAssistantFeaturePage = React.lazy(() => import('./pages/Landing/FeaturePage/FunctionAssistantFeaturePage'));
const CommunicationsFeaturePage = React.lazy(() => import('./pages/Landing/FeaturePage/CommunicationsFeaturePage'));
const GoalCardDemo = React.lazy(() => import('./pages/GoalCardDemo'));
const AIGoalsPage = React.lazy(() => import('./pages/AIGoals/AIGoalsPageEnhanced'));
const PartnerOnboardingPage = React.lazy(() => import('./pages/PartnerOnboardingPage'));
const PartnerDashboard = React.lazy(() => import('./pages/PartnerDashboard'));
const SuperAdminDashboard = React.lazy(() => import('./pages/SuperAdminDashboard'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));
const WhiteLabelCustomization = React.lazy(() => import('./pages/WhiteLabelCustomization'));
const PartnerManagementPage = React.lazy(() => import('./pages/PartnerManagementPage'));
const RevenueSharingPage = React.lazy(() => import('./pages/RevenueSharingPage'));
const FeaturePackageManagementPage = React.lazy(() => import('./pages/FeaturePackageManagementPage'));
const UnauthorizedPage = React.lazy(() => import('./pages/UnauthorizedPage'));

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
    <ErrorBoundary>
      {/* Phase 3: Advanced Caching & State Management */}
      <QueryProvider>
        <CacheFirstDataProvider>
          <ThemeProvider>
            <LoadingProvider>
              <NotificationProvider>
                <TenantProvider>
                  <RoleProvider>
                    <EnhancedHelpProvider>
                      <AIToolsProvider>
                        <Router>
                          <NavigationProvider>
                            <Suspense fallback={<LoadingFallback />}>
                              <Routes>
                              {/* Auth routes */}
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />
                              <Route path="/signup" element={<Register />} />
                              <Route path="/forgot-password" element={<ForgotPassword />} />

                              {/* Public routes */}
                              <Route path="/" element={<Navigate to="/feature-status" replace />} />
                              <Route path="/landing" element={<LandingPage />} />
                              
                              {/* Feature Status Dashboard for testing */}
                              <Route path="/feature-status" element={
                                <Suspense fallback={<ComponentLoadingFallback message="Loading Feature Status..." />}>
                                  <FeatureStatusDashboard />
                                </Suspense>
                              } />
                              
                              <Route path="/form/:formId" element={
                                <Suspense fallback={<ComponentLoadingFallback message="Loading Form..." />}>
                                  <FormPublic />
                                </Suspense>
                              } />
                              
                              <Route path="/faq" element={
                                <Suspense fallback={<ComponentLoadingFallback message="Loading FAQ..." />}>
                                  <FAQ />
                                </Suspense>
                              } />

                              {/* Main application routes with optimized loading */}
                              <Route path="/dashboard" element={
                                <AuthenticatedLayout>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Dashboard" />}>
                                    <Dashboard />
                                  </Suspense>
                                </AuthenticatedLayout>
                              } />

                              <Route path="/contacts" element={
                                <AuthenticatedLayout>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Contacts" />}>
                                    <Contacts />
                                  </Suspense>
                                </AuthenticatedLayout>
                              } />

                              <Route path="/contacts/:id" element={
                                <AuthenticatedLayout>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Contact Details" />}>
                                    <ContactDetail />
                                  </Suspense>
                                </AuthenticatedLayout>
                              } />

                              <Route path="/pipeline" element={
                                <AuthenticatedLayout>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Pipeline" />}>
                                    <Pipeline />
                                  </Suspense>
                                </AuthenticatedLayout>
                              } />

                              <Route path="/tasks" element={
                                <AuthenticatedLayout>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Tasks" />}>
                                    <Tasks />
                                  </Suspense>
                                </AuthenticatedLayout>
                              } />

                              <Route path="/tasks/calendar" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Calendar" />}>
                                    <TaskCalendarView />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/calendar" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Calendar" />}>
                                    <TaskCalendarView />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/appointments" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Appointments" />}>
                                    <Appointments />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/phone-system" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Phone System" />}>
                                    <PhoneSystem />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/text-messages" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Messages" />}>
                                    <TextMessages />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/video-email" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Video Email" />}>
                                    <VideoEmail />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/invoicing" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Invoicing" />}>
                                    <Invoicing />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/ai-tools" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<FeatureLoadingFallback feature="AI Tools" />}>
                                    <AITools />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/sales-tools" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<FeatureLoadingFallback feature="Sales Tools" />}>
                                    <SalesTools />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/lead-automation" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<FeatureLoadingFallback feature="Lead Automation" />}>
                                    <LeadAutomation />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/circle-prospecting" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<FeatureLoadingFallback feature="Circle Prospecting" />}>
                                    <CircleProspecting />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/forms" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Forms" />}>
                                    <FormsAndSurveys />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/business-analysis" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<FeatureLoadingFallback feature="Business Analysis" />}>
                                    <BusinessAnalyzer />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/content-library" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Content Library" />}>
                                    <ContentLibrary />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/voice-profiles" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<FeatureLoadingFallback feature="Voice Profiles" />}>
                                    <VoiceProfiles />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/campaigns" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Campaigns" />}>
                                    <CommunicationHub />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/communication-hub" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Communication Hub" />}>
                                    <CommunicationHub />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/document-center" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Document Center" />}>
                                    <DocumentCenter />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/analytics-dashboard" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Analytics" />}>
                                    <AnalyticsDashboard />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/lead-capture" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<FeatureLoadingFallback feature="Lead Capture" />}>
                                    <LeadCapture />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              <Route path="/settings" element={
                                <ProtectedRoute>
                                  <Suspense fallback={<ComponentLoadingFallback message="Loading Settings" />}>
                                    <Settings />
                                  </Suspense>
                                </ProtectedRoute>
                              } />

                              {/* Feature Pages (public) */}
                              <Route path="/features/ai-tools" element={
                                <Suspense fallback={<FeatureLoadingFallback feature="AI Tools" />}>
                                  <AiToolsFeaturePage />
                                </Suspense>
                              } />
                              
                              <Route path="/features/contacts" element={
                                <Suspense fallback={<FeatureLoadingFallback feature="Contacts" />}>
                                  <ContactsFeaturePage />
                                </Suspense>
                              } />
                              
                              <Route path="/features/pipeline" element={
                                <Suspense fallback={<FeatureLoadingFallback feature="Pipeline" />}>
                                  <PipelineFeaturePage />
                                </Suspense>
                              } />
                              
                              <Route path="/features/ai-assistant" element={
                                <Suspense fallback={<FeatureLoadingFallback feature="AI Assistant" />}>
                                  <AiAssistantFeaturePage />
                                </Suspense>
                              } />
                              
                              <Route path="/features/vision-analyzer" element={
                                <Suspense fallback={<FeatureLoadingFallback feature="Vision Analyzer" />}>
                                  <VisionAnalyzerFeaturePage />
                                </Suspense>
                              } />
                              
                              <Route path="/features/image-generator" element={
                                <Suspense fallback={<FeatureLoadingFallback feature="Image Generator" />}>
                                  <ImageGeneratorFeaturePage />
                                </Suspense>
                              } />
                              
                              <Route path="/features/semantic-search" element={
                                <Suspense fallback={<FeatureLoadingFallback feature="Semantic Search" />}>
                                  <SemanticSearchFeaturePage />
                                </Suspense>
                              } />
                              
                              <Route path="/features/function-assistant" element={
                                <Suspense fallback={<FeatureLoadingFallback feature="Function Assistant" />}>
                                  <FunctionAssistantFeaturePage />
                                </Suspense>
                              } />
                              
                              <Route path="/features/communications" element={
                                <Suspense fallback={<FeatureLoadingFallback feature="Communications" />}>
                                  <CommunicationsFeaturePage />
                                </Suspense>
                              } />
                              
                              <Route path="/demo/goal-cards" element={
                                <Suspense fallback={<ComponentLoadingFallback message="Loading Goal Cards Demo" />}>
                                  <GoalCardDemo />
                                </Suspense>
                              } />

                              {/* Role-based routes */}
                              <Route path="/ai-goals" element={
                                <UserRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<FeatureLoadingFallback feature="AI Goals" />}>
                                      <AIGoalsPage />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </UserRoute>
                              } />

                              <Route path="/partner/onboard" element={
                                <Suspense fallback={<ComponentLoadingFallback message="Loading Partner Onboarding" />}>
                                  <PartnerOnboardingPage />
                                </Suspense>
                              } />

                              <Route path="/partner/dashboard" element={
                                <ResellerRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading Partner Dashboard" />}>
                                      <PartnerDashboard />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </ResellerRoute>
                              } />

                              {/* Admin routes */}
                              <Route path="/admin/dashboard" element={
                                <SuperAdminRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading Admin Dashboard" />}>
                                      <SuperAdminDashboard />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </SuperAdminRoute>
                              } />

                              <Route path="/admin/users" element={
                                <SuperAdminRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading User Management" />}>
                                      <UserManagement />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </SuperAdminRoute>
                              } />

                              <Route path="/admin/white-label" element={
                                <SuperAdminRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading White Label" />}>
                                      <WhiteLabelCustomization />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </SuperAdminRoute>
                              } />

                              <Route path="/admin/partner-management" element={
                                <SuperAdminRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading Partner Management" />}>
                                      <PartnerManagementPage />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </SuperAdminRoute>
                              } />

                              <Route path="/admin/revenue-sharing" element={
                                <SuperAdminRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading Revenue Sharing" />}>
                                      <RevenueSharingPage />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </SuperAdminRoute>
                              } />

                              <Route path="/admin/feature-packages" element={
                                <SuperAdminRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading Feature Packages" />}>
                                      <FeaturePackageManagementPage />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </SuperAdminRoute>
                              } />

                              {/* Additional aliased routes */}
                              <Route path="/task-management" element={
                                <ProtectedRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading Task Management" />}>
                                      <Tasks />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </ProtectedRoute>
                              } />

                              <Route path="/task-automation" element={
                                <ProtectedRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<FeatureLoadingFallback feature="Task Automation" />}>
                                      <LeadAutomation />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </ProtectedRoute>
                              } />

                              <Route path="/project-tracker" element={
                                <ProtectedRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading Project Tracker" />}>
                                      <Tasks />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </ProtectedRoute>
                              } />

                              <Route path="/time-tracking" element={
                                <ProtectedRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading Time Tracking" />}>
                                      <Tasks />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </ProtectedRoute>
                              } />

                              <Route path="/workflow-builder" element={
                                <ProtectedRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<FeatureLoadingFallback feature="Workflow Builder" />}>
                                      <LeadAutomation />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </ProtectedRoute>
                              } />

                              <Route path="/deadline-manager" element={
                                <ProtectedRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading Deadline Manager" />}>
                                      <Tasks />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </ProtectedRoute>
                              } />

                              <Route path="/image-generator" element={
                                <ProtectedRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<FeatureLoadingFallback feature="Image Generator" />}>
                                      <AITools />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </ProtectedRoute>
                              } />

                              <Route path="/ai-model-demo" element={
                                <ProtectedRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<FeatureLoadingFallback feature="AI Model Demo" />}>
                                      <AITools />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </ProtectedRoute>
                              } />

                              <Route path="/feature-access-demo" element={
                                <ProtectedRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading Feature Access" />}>
                                      <Settings />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </ProtectedRoute>
                              } />

                              <Route path="/sso-config" element={
                                <SuperAdminRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading SSO Config" />}>
                                      <Settings />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </SuperAdminRoute>
                              } />

                              <Route path="/white-label" element={
                                <SuperAdminRoute>
                                  <AuthenticatedLayout>
                                    <Suspense fallback={<ComponentLoadingFallback message="Loading White Label" />}>
                                      <WhiteLabelCustomization />
                                    </Suspense>
                                  </AuthenticatedLayout>
                                </SuperAdminRoute>
                              } />

                              {/* Catch-all routes */}
                              <Route path="/unauthorized" element={
                                <Suspense fallback={<LoadingFallback message="Loading..." />}>
                                  <UnauthorizedPage />
                                </Suspense>
                              } />
                            </Routes>
                          </Suspense>
                        </NavigationProvider>
                      </Router>
                    </AIToolsProvider>
                  </EnhancedHelpProvider>
                </RoleProvider>
              </TenantProvider>
            </NotificationProvider>
          </LoadingProvider>
        </ThemeProvider>
        </CacheFirstDataProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;