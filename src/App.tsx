import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// Import page components
import DashboardPage from './pages/Dashboard';
import PipelinePage from './pages/Pipeline';
import ContactsPage from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import AIToolsPage from './pages/AITools';
import TasksPage from './pages/Tasks';
import SettingsPage from './pages/Settings';
import AppointmentsPage from './pages/Appointments';
import VideoEmailPage from './pages/VideoEmail';
import TextMessagesPage from './pages/TextMessages';
import SalesToolsPage from './pages/SalesTools';
import LeadAutomationPage from './pages/LeadAutomation';
import CircleProspectingPage from './pages/CircleProspecting';
import PhoneSystemPage from './pages/PhoneSystem';
import InvoicingPage from './pages/Invoicing';
import FormsAndSurveysPage from './pages/FormsAndSurveys';
import WhiteLabelCustomization from './pages/WhiteLabelCustomization';
const VideoCallOverlay = React.lazy(() => import('./components/VideoCallOverlay'));
const VideoCallPreviewWidget = React.lazy(() => import('./components/VideoCallPreviewWidget'));
import DevicePermissionChecker from './components/DevicePermissionChecker';
import { AIToolsProvider } from './components/AIToolsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { ModalsProvider } from './components/ModalsProvider';
import { ContactsModal } from './components/modals/ContactsModal';
import './components/styles/design-system.css';

function App() {
  // Prevent unnecessary re-renders with useState instead of using a boolean directly
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [shouldRenderVideoComponents, setShouldRenderVideoComponents] = useState(false);
  
  // Delay loading video components to improve initial render performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRenderVideoComponents(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <VideoCallProvider>
        <AIToolsProvider>
          <NavigationProvider>
            <DashboardLayoutProvider> 
              <EnhancedHelpProvider>
                <ModalsProvider>
                  <div className="min-h-screen h-full w-full flex flex-col transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-br from-gray-50 via-white to-gray-100">
                    <DevicePermissionChecker />
                    <Navbar onOpenPipelineModal={() => {
                      const modalsContext = (document.getElementById('root') as any)?.__MODALS_CONTEXT;
                      if (modalsContext && modalsContext.openPipelineModal) {
                        modalsContext.openPipelineModal();
                      }
                    }} />
                    <div className="flex-1 w-full overflow-hidden">
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/pipeline" element={<PipelinePage />} />
                        <Route path="/contacts" element={<ContactsPage />} />
                        <Route path="/contacts/:id" element={<ContactDetail />} />
                        <Route path="/ai-tools" element={<AIToolsPage />} />
                        <Route path="/ai-goals" element={<AIToolsPage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        
                        {/* Sales Tools Routes */}
                        <Route path="/sales-tools" element={<SalesToolsPage />} />
                        <Route path="/lead-automation" element={<LeadAutomationPage />} />
                        <Route path="/circle-prospecting" element={<CircleProspectingPage />} />
                        <Route path="/appointments" element={<AppointmentsPage />} />
                        <Route path="/phone-system" element={<PhoneSystemPage />} />
                        <Route path="/invoicing" element={<InvoicingPage />} />
                        
                        {/* Communication Tools Routes */}
                        <Route path="/video-email" element={<VideoEmailPage />} />
                        <Route path="/text-messages" element={<TextMessagesPage />} />
                        <Route path="/email-composer" element={<AIToolsPage />} />
                        <Route path="/campaigns" element={<AIToolsPage />} />
                        
                        {/* Content & Forms Routes */}
                        <Route path="/forms" element={<FormsAndSurveysPage />} />
                        <Route path="/content-library" element={<AIToolsPage />} />
                        <Route path="/voice-profiles" element={<AIToolsPage />} />
                        <Route path="/business-analysis" element={<AIToolsPage />} />
                        <Route path="/image-generator" element={<AIToolsPage />} />
                        <Route path="/ai-model-demo" element={<AIToolsPage />} />
                        
                        {/* Task Management Routes */}
                        <Route path="/task-automation" element={<TasksPage />} />
                        <Route path="/project-tracker" element={<TasksPage />} />
                        <Route path="/time-tracking" element={<TasksPage />} />
                        <Route path="/workflow-builder" element={<TasksPage />} />
                        <Route path="/deadline-manager" element={<TasksPage />} />
                        
                        {/* Sales Analytics Routes */}
                        <Route path="/sales-analytics" element={<AIToolsPage />} />
                        <Route path="/quote-builder" element={<AIToolsPage />} />
                        <Route path="/commission-tracker" element={<AIToolsPage />} />
                        <Route path="/follow-up-reminders" element={<AIToolsPage />} />
                        <Route path="/territory-management" element={<AIToolsPage />} />
                        
                        {/* White-Label Customization Route */}
                        <Route path="/white-label" element={<WhiteLabelCustomization />} />
                        
                        {/* Fallback to dashboard for unknown routes */}
                        <Route path="*" element={<DashboardPage />} />
                      </Routes>
                    </div>
                  
                  {/* Lazy load video components with suspense to prevent layout shifts */}
                  {shouldRenderVideoComponents && (
                    <React.Suspense fallback={null}>
                      <VideoCallOverlay />
                      <VideoCallPreviewWidget />
                    </React.Suspense>
                  )}
                    
                    {/* ContactsModal rendered at the root level */}
                    <ContactsModal
                      isOpen={isContactsModalOpen}
                      onClose={() => setIsContactsModalOpen(false)}
                    />
                  </div>
                </ModalsProvider>
              </EnhancedHelpProvider>
            </DashboardLayoutProvider>
          </NavigationProvider>
        </AIToolsProvider>
      </VideoCallProvider>
    </ThemeProvider>
  );
}

export default App;