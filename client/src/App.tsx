import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { AIToolsProvider } from './components/AIToolsProvider';
import { TenantProvider } from './components/TenantProvider';
import { RoleProvider } from './components/RoleBasedAccess';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { HelpProvider } from './contexts/HelpContext';
import { queryClient } from './lib/queryClient';
import Navbar from './components/Navbar';
import { ContactsModal } from './components/modals/ContactsModal';

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

// Simple layout wrapper with navbar and modal support
const SimpleLayout = ({ children, isContactsModalOpen, setIsContactsModalOpen }: { 
  children: React.ReactNode;
  isContactsModalOpen: boolean;
  setIsContactsModalOpen: (open: boolean) => void;
}) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar onContactsClick={() => setIsContactsModalOpen(true)} />
    {children}
  </div>
);

function App() {
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <RoleProvider>
          <HelpProvider>
            <EnhancedHelpProvider>
              <AIToolsProvider>
              <Router>
                <Routes>
                  <Route path="/dashboard" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <Dashboard onContactsClick={() => setIsContactsModalOpen(true)} />
                    </SimpleLayout>
                  } />
                  <Route path="/contacts" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <Dashboard onContactsClick={() => setIsContactsModalOpen(true)} />
                    </SimpleLayout>
                  } />
                  <Route path="/contacts/:id" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <Dashboard onContactsClick={() => setIsContactsModalOpen(true)} />
                    </SimpleLayout>
                  } />
                  <Route path="/pipeline" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <Pipeline />
                    </SimpleLayout>
                  } />
                  <Route path="/deals" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <Pipeline />
                    </SimpleLayout>
                  } />
                  {/* Main navigation routes */}
                  <Route path="/ai-goals" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <AIGoalsPage />
                    </SimpleLayout>
                  } />
                  <Route path="/features" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <FeatureTestPage />
                    </SimpleLayout>
                  } />
                  <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
                  <Route path="/super-admin-signup" element={<SuperAdminSignup />} />
                  
                  {/* Authentication routes */}
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/login" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  <Route path="/video-email" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Video Email" />
                    </SimpleLayout>
                  } />
                  <Route path="/text-messages" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Text Messages" />
                    </SimpleLayout>
                  } />
                  <Route path="/campaigns" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Campaigns" />
                    </SimpleLayout>
                  } />
                  <Route path="/content-library" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Content Library" />
                    </SimpleLayout>
                  } />
                  <Route path="/voice-profiles" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Voice Profiles" />
                    </SimpleLayout>
                  } />
                  <Route path="/business-analysis" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Business Analysis" />
                    </SimpleLayout>
                  } />
                  <Route path="/forms" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Forms" />
                    </SimpleLayout>
                  } />
                  <Route path="/admin/white-label" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="White Label Admin" />
                    </SimpleLayout>
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
                  
                  {/* Missing feature pages - keep as placeholders for now */}
                  <Route path="/features/speech-to-text" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Speech to Text" />
                    </SimpleLayout>
                  } />
                  <Route path="/features/automation" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Sales Automation" />
                    </SimpleLayout>
                  } />
                  <Route path="/features/appointments" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Appointment Scheduling" />
                    </SimpleLayout>
                  } />
                  
                  {/* Company pages from footer */}
                  <Route path="/about" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="About Us" />
                    </SimpleLayout>
                  } />
                  <Route path="/contact" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Contact" />
                    </SimpleLayout>
                  } />
                  <Route path="/faq" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="FAQ" />
                    </SimpleLayout>
                  } />
                  <Route path="/blog" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Blog" />
                    </SimpleLayout>
                  } />
                  <Route path="/careers" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Careers" />
                    </SimpleLayout>
                  } />
                  <Route path="/press" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Press" />
                    </SimpleLayout>
                  } />
                  <Route path="/partners" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Partners" />
                    </SimpleLayout>
                  } />
                  <Route path="/privacy" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Privacy Policy" />
                    </SimpleLayout>
                  } />
                  <Route path="/terms" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Terms of Service" />
                    </SimpleLayout>
                  } />
                  <Route path="/security" element={
                    <SimpleLayout isContactsModalOpen={isContactsModalOpen} setIsContactsModalOpen={setIsContactsModalOpen}>
                      <PlaceholderPage title="Security" />
                    </SimpleLayout>
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
              </AIToolsProvider>
            </EnhancedHelpProvider>
          </HelpProvider>
        </RoleProvider>
      </TenantProvider>
    </QueryClientProvider>
  );
}

export default App;