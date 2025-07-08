import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ExactNavbar from './components/layout/ExactNavbar';
import Dashboard from './components/Dashboard';
import VideoCallOverlay from './components/VideoCallOverlay';
import VideoCallPreviewWidget from './components/VideoCallPreviewWidget';
import DevicePermissionChecker from './components/DevicePermissionChecker';
import { AIToolsProvider } from './components/AIToolsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
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

import './components/styles/design-system.css';

function App() {
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <VideoCallProvider>
        <AIToolsProvider>
          <NavigationProvider>
            <DashboardLayoutProvider>
              <EnhancedHelpProvider>
                <Router>
                  <div className="min-h-screen h-full w-full flex flex-col transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-br from-gray-50 via-white to-gray-100">
                    <DevicePermissionChecker />
                    <ExactNavbar />
                    <div className="flex-1 w-full overflow-hidden">
                      <Routes>
                        {/* Main Dashboard */}
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        
                        {/* Core CRM Pages */}
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/pipeline" element={<Pipeline />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/analytics" element={<AnalyticsDashboard />} />
                        
                        {/* Communication Pages */}
                        <Route path="/communication-hub" element={<CommunicationHub />} />
                        <Route path="/document-center" element={<DocumentCenter />} />
                        <Route path="/video-email" element={<VideoEmail />} />
                        <Route path="/text-messages" element={<TextMessages />} />
                        
                        {/* Sales Tools Pages */}
                        <Route path="/sales-tools" element={<SalesTools />} />
                        <Route path="/lead-automation" element={<LeadAutomation />} />
                        <Route path="/appointments" element={<Appointments />} />
                        <Route path="/phone-system" element={<PhoneSystem />} />
                        <Route path="/invoicing" element={<Invoicing />} />
                        
                        {/* Content & AI Pages */}
                        <Route path="/content-library" element={<ContentLibrary />} />
                        <Route path="/voice-profiles" element={<VoiceProfiles />} />
                        <Route path="/business-analysis" element={<BusinessAnalyzer />} />
                        <Route path="/forms" element={<FormsAndSurveys />} />
                        <Route path="/ai-tools" element={<AITools />} />
                        
                        {/* Redirect unknown routes to dashboard */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </div>
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
            </DashboardLayoutProvider>
          </NavigationProvider>
        </AIToolsProvider>
      </VideoCallProvider>
    </ThemeProvider>
  );
}

export default App;