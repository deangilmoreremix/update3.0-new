import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ExactNavbar from './components/layout/ExactNavbar';
import Dashboard from './components/Dashboard';
import LandingPage from './pages/Landing/LandingPage';
import SimpleLandingPage from './pages/Landing/SimpleLandingPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import UserRoute from './components/auth/UserRoute';
import AuthenticatedLayout from './components/auth/AuthenticatedLayout';
import SuperAdminSignup from './pages/SuperAdminSignup';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import EmailCampaignManager from './pages/EmailCampaignManager';
import VideoCallOverlay from './components/VideoCallOverlay';
import { AIToolsProvider } from './components/AIToolsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { ComponentRegistryProvider } from './contexts/ComponentRegistry';
import { UnifiedDragDropProvider } from './contexts/UnifiedDragDropContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { ContactsModal } from './components/modals/ContactsModal';
import PipelineModal from './components/modals/PipelineModal';
import { TenantProvider } from './components/TenantProvider';
import { RoleProvider } from './components/RoleBasedAccess';

// Import existing pages
import Contacts from './pages/Contacts';
import NetlifyContacts from './pages/NetlifyContacts';

import { EnhancedPipeline } from './components/EnhancedPipeline';
import Tasks from './pages/Tasks';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import CommunicationHub from './pages/CommunicationHub';
import DocumentCenter from './pages/DocumentCenter';
import SalesTools from './pages/SalesTools';
import LeadAutomation from './pages/LeadAutomation';
import CircleProspecting from './pages/CircleProspecting';
import Appointments from './pages/Appointments';
import PhoneSystem from './pages/PhoneSystem';
import Invoicing from './pages/Invoicing';
import VideoEmail from './pages/VideoEmail';
import TextMessages from './pages/TextMessages';
import ContentLibrary from './pages/ContentLibrary/ContentLibrary';
import VoiceProfiles from './pages/VoiceProfiles/VoiceProfiles';
import BusinessAnalyzer from './pages/BusinessAnalysis/BusinessAnalyzer';
import FormsAndSurveys from './pages/FormsAndSurveys';
import AITools from './pages/AITools';
import TaskManagement from './pages/TaskManagement';
import TaskAutomation from './pages/TaskAutomation';
import ProjectTracker from './pages/ProjectTracker';
import TimeTracking from './pages/TimeTracking';
import WorkflowBuilder from './pages/WorkflowBuilder';
import DeadlineManager from './pages/DeadlineManager';
import SalesAnalytics from './pages/SalesAnalytics';
import QuoteBuilder from './pages/QuoteBuilder';
import CommissionTracker from './pages/CommissionTracker';
import FollowUpReminders from './pages/FollowUpReminders';
import TerritoryManagement from './pages/TerritoryManagement';
import EmailComposer from './pages/EmailComposer';
import Campaigns from './pages/Campaigns';
import ImageGenerator from './pages/ImageGenerator';
import AIModelDemo from './pages/AIModelDemo';
import FeatureAccessDemo from './pages/FeatureAccessDemo';
import { SSOConfiguration } from './pages/SSOConfiguration';
import WhiteLabelCustomization from './pages/WhiteLabelCustomization';
import AIGoalsPage from './pages/AIGoals/AIGoalsPage';
import AIGoalsPageEnhanced from './pages/AIGoals/AIGoalsPageEnhanced';

import './components/styles/design-system.css';

function App() {
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <VideoCallProvider>
        <AIToolsProvider>
          <NavigationProvider>
            <ComponentRegistryProvider>
              <DashboardLayoutProvider>
                <UnifiedDragDropProvider>
                  <GamificationProvider>
                    <EnhancedHelpProvider>
                      <TenantProvider>
                        <RoleProvider>
                        <Router>
                          <div className="min-h-screen h-full w-full flex flex-col transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-br from-gray-50 via-white to-gray-100">
                            <Routes>
                              {/* Landing Page - no navbar */}
                              <Route path="/" element={<LandingPage />} />
                              
                              {/* Authentication Routes - no navbar */}
                              <Route path="/login" element={<Login />} />
                              <Route path="/sign-in" element={<Login />} />
                              <Route path="/signup" element={<Register />} />
                              <Route path="/sign-up" element={<Register />} />
                              <Route path="/forgot-password" element={<ForgotPassword />} />
                              <Route path="/super-admin-signup" element={<SuperAdminSignup />} />
                              
                              {/* Routes with navbar */}
                              <Route path="/super-admin-dashboard" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <SuperAdminDashboard />
                                  </div>
                                </>
                              } />
                              
                              <Route path="/email-campaigns" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <EmailCampaignManager />
                                  </div>
                                </>
                              } />
                              
                              <Route path="/dashboard" element={
                                <UserRoute>
                                  <AuthenticatedLayout>
                                    <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                    <div className="flex-1 w-full overflow-y-auto pt-24">
                                      <Dashboard />
                                    </div>
                                  </AuthenticatedLayout>
                                </UserRoute>
                              } />
                              
                              {/* Core CRM Pages */}
                              <Route path="/contacts" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <NetlifyContacts />
                                  </div>
                                </>
                              } />

                              <Route path="/tasks" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <Tasks />
                                  </div>
                                </>
                              } />
                              <Route path="/analytics" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <AnalyticsDashboard />
                                  </div>
                                </>
                              } />
                              
                              {/* Feature Access Demo */}
                              <Route path="/feature-access-demo" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <FeatureAccessDemo />
                                  </div>
                                </>
                              } />
                              
                              {/* SSO Configuration */}
                              <Route path="/sso-config" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <SSOConfiguration />
                                  </div>
                                </>
                              } />

                              {/* White Label Customization */}
                              <Route path="/white-label" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <WhiteLabelCustomization />
                                  </div>
                                </>
                              } />
                              
                              {/* Other routes would follow the same pattern */}
                              {/* Sales Tools Routes */}
                              <Route path="/sales-tools" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <SalesTools />
                                  </div>
                                </>
                              } />
                              <Route path="/lead-automation" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <LeadAutomation />
                                  </div>
                                </>
                              } />
                              <Route path="/circle-prospecting" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <CircleProspecting />
                                  </div>
                                </>
                              } />
                              <Route path="/appointments" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <Appointments />
                                  </div>
                                </>
                              } />
                              <Route path="/phone-system" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <PhoneSystem />
                                  </div>
                                </>
                              } />
                              <Route path="/invoicing" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <Invoicing />
                                  </div>
                                </>
                              } />
                              <Route path="/video-email" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <VideoEmail />
                                  </div>
                                </>
                              } />
                              <Route path="/text-messages" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <TextMessages />
                                  </div>
                                </>
                              } />
                              <Route path="/sales-analytics" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <SalesAnalytics />
                                  </div>
                                </>
                              } />
                              <Route path="/quote-builder" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <QuoteBuilder />
                                  </div>
                                </>
                              } />
                              <Route path="/commission-tracker" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <CommissionTracker />
                                  </div>
                                </>
                              } />
                              <Route path="/follow-up-reminders" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <FollowUpReminders />
                                  </div>
                                </>
                              } />
                              <Route path="/territory-management" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <TerritoryManagement />
                                  </div>
                                </>
                              } />
                              <Route path="/task-management" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <TaskManagement />
                                  </div>
                                </>
                              } />
                              <Route path="/task-automation" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <TaskAutomation />
                                  </div>
                                </>
                              } />
                              <Route path="/project-tracker" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <ProjectTracker />
                                  </div>
                                </>
                              } />
                              <Route path="/time-tracking" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <TimeTracking />
                                  </div>
                                </>
                              } />
                              <Route path="/workflow-builder" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <WorkflowBuilder />
                                  </div>
                                </>
                              } />
                              <Route path="/deadline-manager" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <DeadlineManager />
                                  </div>
                                </>
                              } />
                              <Route path="/email-composer" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <EmailComposer />
                                  </div>
                                </>
                              } />
                              <Route path="/campaigns" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <Campaigns />
                                  </div>
                                </>
                              } />
                              <Route path="/content-library" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <ContentLibrary />
                                  </div>
                                </>
                              } />
                              <Route path="/voice-profiles" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <VoiceProfiles />
                                  </div>
                                </>
                              } />
                              <Route path="/business-analysis" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <BusinessAnalyzer />
                                  </div>
                                </>
                              } />
                              <Route path="/forms" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <FormsAndSurveys />
                                  </div>
                                </>
                              } />
                              <Route path="/image-generator" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <ImageGenerator />
                                  </div>
                                </>
                              } />
                              <Route path="/ai-model-demo" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <AIModelDemo />
                                  </div>
                                </>
                              } />
                              <Route path="/ai-tools" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <AITools />
                                  </div>
                                </>
                              } />
                              
                              {/* AI Goals Routes */}
                              <Route path="/ai-goals" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <AIGoalsPageEnhanced />
                                  </div>
                                </>
                              } />
                              <Route path="/ai-goals-basic" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <AIGoalsPage />
                                  </div>
                                </>
                              } />
                              
                              {/* Pipeline Route */}
                              <Route path="/pipeline" element={
                                <>
                                  <ExactNavbar onOpenPipelineModal={() => setIsPipelineModalOpen(true)} />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <EnhancedPipeline />
                                  </div>
                                </>
                              } />
                              
                              {/* Communication Hub Route */}
                              <Route path="/communication-hub" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <CommunicationHub />
                                  </div>
                                </>
                              } />
                              
                              {/* Document Center Route */}
                              <Route path="/document-center" element={
                                <>
                                  <ExactNavbar />
                                  <div className="flex-1 w-full overflow-y-auto pt-24">
                                    <DocumentCenter />
                                  </div>
                                </>
                              } />
                              
                              {/* For brevity, I'll add a catch-all that redirects to dashboard */}
                              <Route path="*" element={<Navigate to="/dashboard" replace />} />
                            </Routes>
                            
                            <VideoCallOverlay />
                            
                            {/* ContactsModal rendered at the root level */}
                            <ContactsModal
                              isOpen={isContactsModalOpen}
                              onClose={() => setIsContactsModalOpen(false)}
                            />
                            
                            {/* PipelineModal rendered at the root level */}
                            <PipelineModal
                              isOpen={isPipelineModalOpen}
                              onClose={() => setIsPipelineModalOpen(false)}
                            />
                          </div>
                        </Router>
                        </RoleProvider>
                      </TenantProvider>
                    </EnhancedHelpProvider>
                  </GamificationProvider>
                </UnifiedDragDropProvider>
              </DashboardLayoutProvider>
            </ComponentRegistryProvider>
          </NavigationProvider>
        </AIToolsProvider>
      </VideoCallProvider>
    </ThemeProvider>
  );
}

export default App;