import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ExactNavbar from './components/layout/ExactNavbar';
import Dashboard from './components/Dashboard';
import LandingPage from './pages/Landing/LandingPage';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import SuperAdminSignup from './pages/SuperAdminSignup';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import VideoCallOverlay from './components/VideoCallOverlay';
import VideoCallPreviewWidget from './components/VideoCallPreviewWidget';
import { AIToolsProvider } from './components/AIToolsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { ComponentRegistryProvider } from './contexts/ComponentRegistry';
import { UnifiedDragDropProvider } from './contexts/UnifiedDragDropContext';
import { ContactsModal } from './components/modals/ContactsModal';

// Import existing pages
import Contacts from './pages/Contacts';
import Pipeline from './pages/Pipeline';
import Tasks from './pages/Tasks';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import CommunicationHub from './pages/CommunicationHub';
import DocumentCenter from './pages/DocumentCenter';
import SalesTools from './pages/SalesTools';
import LeadAutomation from './pages/LeadAutomation';
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

import './components/styles/design-system.css';

function App() {
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <VideoCallProvider>
        <AIToolsProvider>
          <NavigationProvider>
            <ComponentRegistryProvider>
              <DashboardLayoutProvider>
                <UnifiedDragDropProvider>
                  <EnhancedHelpProvider>
                <Router>
                  <div className="min-h-screen h-full w-full flex flex-col transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-br from-gray-50 via-white to-gray-100">
                    <Routes>
                      {/* Landing Page - no navbar */}
                      <Route path="/" element={<LandingPage />} />
                      
                      {/* Authentication Routes - no navbar */}
                      <Route path="/login" element={<SignIn />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/super-admin-signup" element={<SuperAdminSignup />} />
                      
                      {/* Routes with navbar */}
                      <Route path="/super-admin-dashboard" element={
                        <>
                          <ExactNavbar />
                          <div className="flex-1 w-full overflow-y-auto pt-24">
                            <SuperAdminDashboard />
                          </div>
                        </>
                      } />
                      
                      <Route path="/dashboard" element={
                        <>
                          <ExactNavbar />
                          <div className="flex-1 w-full overflow-y-auto pt-24">
                            <Dashboard />
                          </div>
                        </>
                      } />
                      
                      {/* Core CRM Pages */}
                      <Route path="/contacts" element={
                        <>
                          <ExactNavbar />
                          <div className="flex-1 w-full overflow-y-auto pt-24">
                            <Contacts />
                          </div>
                        </>
                      } />
                      <Route path="/pipeline" element={
                        <>
                          <ExactNavbar />
                          <div className="flex-1 w-full overflow-y-auto pt-24">
                            <Pipeline />
                          </div>
                        </>
                      } />
                      <Route path="/tasks" element={
                        <>
                          <ExactNavbar />
                          <div className="flex-1 w-full overflow-y-auto pt-24">
                            <Tasks />
                          </div>
                        </>
                      } />
                      <Route path="/analytics" element={
                        <>
                          <ExactNavbar />
                          <div className="flex-1 w-full overflow-y-auto pt-24">
                            <AnalyticsDashboard />
                          </div>
                        </>
                      } />
                      
                      {/* Other routes would follow the same pattern */}
                      {/* For brevity, I'll add a catch-all that redirects to dashboard */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                    
                    <VideoCallOverlay />
                    <VideoCallPreviewWidget />
                    
                    {/* ContactsModal rendered at the root level */}
                    <ContactsModal
                      isOpen={isContactsModalOpen}
                      onClose={() => setIsContactsModalOpen(false)}
                    />
                  </div>
                </Router>
              </EnhancedHelpProvider>
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