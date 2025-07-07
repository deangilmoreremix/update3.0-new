import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { AIToolsProvider } from './components/AIToolsProvider';
import { TenantProvider } from './components/TenantProvider';
import { RoleProvider } from './components/RoleBasedAccess';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { HelpProvider } from './contexts/HelpContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { queryClient } from './lib/queryClient';
import Navbar from './components/Navbar';
import { ContactsModal } from './components/modals/ContactsModal';
import VideoCallOverlay from './components/VideoCallOverlay';
import VideoCallPreviewWidget from './components/VideoCallPreviewWidget';
import DevicePermissionChecker from './components/DevicePermissionChecker';
import './components/styles/design-system.css';

// Main pages
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Pipeline from './pages/Pipeline';
import AIGoalsPage from './pages/AIGoalsPage';
import { FeatureTestPage } from './pages/FeatureTestPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminSignup from './pages/SuperAdminSignup';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import LandingPage from './pages/Landing/LandingPage';

// Feature pages
import ContactsFeaturePage from './pages/Landing/FeaturePage/ContactsFeaturePage';
import PipelineFeaturePage from './pages/Landing/FeaturePage/PipelineFeaturePage';
import AiToolsFeaturePage from './pages/Landing/FeaturePage/AiToolsFeaturePage';
import CommunicationsFeaturePage from './pages/Landing/FeaturePage/CommunicationsFeaturePage';
import AiAssistantFeaturePage from './pages/Landing/FeaturePage/AiAssistantFeaturePage';
import VisionAnalyzerFeaturePage from './pages/Landing/FeaturePage/VisionAnalyzerFeaturePage';
import ImageGeneratorFeaturePage from './pages/Landing/FeaturePage/ImageGeneratorFeaturePage';
import FunctionAssistantFeaturePage from './pages/Landing/FeaturePage/FunctionAssistantFeaturePage';
import SemanticSearchFeaturePage from './pages/Landing/FeaturePage/SemanticSearchFeaturePage';
import SpeechToTextFeaturePage from './pages/Landing/FeaturePage/SpeechToTextFeaturePage';
import AutomationFeaturePage from './pages/Landing/FeaturePage/AutomationFeaturePage';
import AppointmentsFeaturePage from './pages/Landing/FeaturePage/AppointmentsFeaturePage';
import DesignShowcase from './pages/DesignShowcase';

// Create placeholder pages for missing routes
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600 mb-8">This page is under development</p>
      <Link to="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Return to Dashboard
      </Link>
    </div>
  </div>
);

// Enhanced layout wrapper with video call support and theme-aware design
const EnhancedLayout = ({ children, isContactsModalOpen, setIsContactsModalOpen }: { 
  children: React.ReactNode;
  isContactsModalOpen: boolean;
  setIsContactsModalOpen: (open: boolean) => void;
}) => (
  <div className="min-h-screen h-full w-full flex flex-col transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <DevicePermissionChecker />
    <Navbar onContactsClick={() => setIsContactsModalOpen(true)} />
    <div className="flex-1 w-full overflow-hidden">
      {children}
    </div>
    <VideoCallOverlay />
    <VideoCallPreviewWidget />
    
    {/* ContactsModal rendered at the root level */}
    <ContactsModal
      isOpen={isContactsModalOpen}
      onClose={() => setIsContactsModalOpen(false)}
    />
  </div>
);

function App() {
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <VideoCallProvider>
          <TenantProvider>
            <RoleProvider>
              <HelpProvider>
                <EnhancedHelpProvider>
                  <AIToolsProvider>
                    <NavigationProvider>
                      <DashboardLayoutProvider>
              <Router>
                <Routes>
                  <Route path="/dashboard" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <Dashboard onContactsClick={() => setIsContactsModalOpen(true)} />
                    </EnhancedLayout>
                  } />
                  <Route path="/contacts" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <Dashboard onContactsClick={() => setIsContactsModalOpen(true)} />
                    </EnhancedLayout>
                  } />
                  <Route path="/contacts/:id" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <Dashboard onContactsClick={() => setIsContactsModalOpen(true)} />
                    </EnhancedLayout>
                  } />
                  <Route path="/pipeline" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <Pipeline />
                    </EnhancedLayout>
                  } />
                  <Route path="/deals" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <Pipeline />
                    </EnhancedLayout>
                  } />
                  {/* Main navigation routes */}
                  <Route path="/ai-goals" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <AIGoalsPage />
                    </EnhancedLayout>
                  } />
                  <Route path="/features" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <FeatureTestPage />
                    </EnhancedLayout>
                  } />
                  <Route path="/design-showcase" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <DesignShowcase />
                    </EnhancedLayout>
                  } />
                  <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
                  <Route path="/super-admin-signup" element={<SuperAdminSignup />} />
                  
                  {/* Authentication routes */}
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/login" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  <Route path="/video-email" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Video Email" />
                    </EnhancedLayout>
                  } />
                  <Route path="/text-messages" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Text Messages" />
                    </EnhancedLayout>
                  } />
                  <Route path="/campaigns" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Campaigns" />
                    </EnhancedLayout>
                  } />
                  <Route path="/content-library" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Content Library" />
                    </EnhancedLayout>
                  } />
                  <Route path="/voice-profiles" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Voice Profiles" />
                    </EnhancedLayout>
                  } />
                  <Route path="/business-analysis" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Business Analysis" />
                    </EnhancedLayout>
                  } />
                  <Route path="/forms" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Forms" />
                    </EnhancedLayout>
                  } />
                  <Route path="/admin/white-label" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="White Label Admin" />
                    </EnhancedLayout>
                  } />
                  
                  {/* Feature pages from landing navigation */}
                  <Route path="/features/ai-tools" element={<AiToolsFeaturePage />} />
                  <Route path="/features/contacts" element={<ContactsFeaturePage />} />
                  <Route path="/features/pipeline" element={<PipelineFeaturePage />} />
                  <Route path="/features/ai-assistant" element={<AiAssistantFeaturePage />} />
                  <Route path="/features/vision-analyzer" element={<VisionAnalyzerFeaturePage />} />
                  <Route path="/features/image-generator" element={<ImageGeneratorFeaturePage />} />
                  <Route path="/features/function-assistant" element={<FunctionAssistantFeaturePage />} />
                  <Route path="/features/semantic-search" element={<SemanticSearchFeaturePage />} />
                  <Route path="/features/communications" element={<CommunicationsFeaturePage />} />
                  
                  {/* Newly created feature pages */}
                  <Route path="/features/speech-to-text" element={<SpeechToTextFeaturePage />} />
                  <Route path="/features/automation" element={<AutomationFeaturePage />} />
                  <Route path="/features/appointments" element={<AppointmentsFeaturePage />} />
                  
                  {/* Company pages from footer */}
                  <Route path="/about" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="About Us" />
                    </EnhancedLayout>
                  } />
                  <Route path="/contact" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Contact" />
                    </EnhancedLayout>
                  } />
                  <Route path="/faq" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="FAQ" />
                    </EnhancedLayout>
                  } />
                  <Route path="/blog" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Blog" />
                    </EnhancedLayout>
                  } />
                  <Route path="/careers" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Careers" />
                    </EnhancedLayout>
                  } />
                  <Route path="/press" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Press" />
                    </EnhancedLayout>
                  } />
                  <Route path="/partners" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Partners" />
                    </EnhancedLayout>
                  } />
                  <Route path="/privacy" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Privacy Policy" />
                    </EnhancedLayout>
                  } />
                  <Route path="/terms" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Terms of Service" />
                    </EnhancedLayout>
                  } />
                  <Route path="/security" element={
                    <EnhancedLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Security" />
                    </EnhancedLayout>
                  } />
                  
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/" element={<LandingPage />} />
                </Routes>

                {/* Enhanced Contacts Modal */}
                <ContactsModal 
                  isOpen={isContactsModalOpen} 
                  onClose={() => setIsContactsModalOpen(false)} 
                />
              </Router>
                      </DashboardLayoutProvider>
                    </NavigationProvider>
                  </AIToolsProvider>
                </EnhancedHelpProvider>
              </HelpProvider>
            </RoleProvider>
          </TenantProvider>
        </VideoCallProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;