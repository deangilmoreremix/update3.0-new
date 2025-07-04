import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
                  <Route path="/pipeline" element={
                    <SimpleLayout>
                      <Pipeline />
                    </SimpleLayout>
                  } />
                  <Route path="/" element={
                    <SimpleLayout>
                      <Dashboard />
                    </SimpleLayout>
                  } />
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