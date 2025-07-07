import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { AIToolsProvider } from './components/AIToolsProvider';
import { TenantProvider } from './components/TenantProvider';
import { RoleProvider } from './components/RoleBasedAccess';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { HelpProvider } from './contexts/HelpContext';
import { queryClient } from './lib/queryClient';
import Navbar from './components/Navbar';

// Main pages
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Pipeline from './pages/Pipeline';
import AIGoalsPage from './pages/AIGoalsPage';
import { FeatureTestPage } from './pages/FeatureTestPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminSignup from './pages/SuperAdminSignup';
import LandingPage from './pages/Landing/LandingPage';

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

// Simple layout wrapper with navbar
const SimpleLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    {children}
  </div>
);

function App() {
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
                    <SimpleLayout>
                      <Dashboard />
                    </SimpleLayout>
                  } />
                  <Route path="/contacts" element={
                    <SimpleLayout>
                      <Contacts />
                    </SimpleLayout>
                  } />
                  <Route path="/contacts/:id" element={
                    <SimpleLayout>
                      <Contacts />
                    </SimpleLayout>
                  } />
                  <Route path="/pipeline" element={
                    <SimpleLayout>
                      <Pipeline />
                    </SimpleLayout>
                  } />
                  <Route path="/deals" element={
                    <SimpleLayout>
                      <Pipeline />
                    </SimpleLayout>
                  } />
                  {/* Main navigation routes */}
                  <Route path="/ai-goals" element={
                    <SimpleLayout>
                      <AIGoalsPage />
                    </SimpleLayout>
                  } />
                  <Route path="/features" element={
                    <SimpleLayout>
                      <FeatureTestPage />
                    </SimpleLayout>
                  } />
                  <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
                  <Route path="/super-admin-signup" element={<SuperAdminSignup />} />

                  <Route path="/video-email" element={
                    <SimpleLayout>
                      <PlaceholderPage title="Video Email" />
                    </SimpleLayout>
                  } />
                  <Route path="/text-messages" element={
                    <SimpleLayout>
                      <PlaceholderPage title="Text Messages" />
                    </SimpleLayout>
                  } />
                  <Route path="/campaigns" element={
                    <SimpleLayout>
                      <PlaceholderPage title="Campaigns" />
                    </SimpleLayout>
                  } />
                  <Route path="/content-library" element={
                    <SimpleLayout>
                      <PlaceholderPage title="Content Library" />
                    </SimpleLayout>
                  } />
                  <Route path="/voice-profiles" element={
                    <SimpleLayout>
                      <PlaceholderPage title="Voice Profiles" />
                    </SimpleLayout>
                  } />
                  <Route path="/business-analysis" element={
                    <SimpleLayout>
                      <PlaceholderPage title="Business Analysis" />
                    </SimpleLayout>
                  } />
                  <Route path="/forms" element={
                    <SimpleLayout>
                      <PlaceholderPage title="Forms" />
                    </SimpleLayout>
                  } />
                  <Route path="/admin/white-label" element={
                    <SimpleLayout>
                      <PlaceholderPage title="White Label Admin" />
                    </SimpleLayout>
                  } />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/" element={<LandingPage />} />
                </Routes>
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