import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { AIToolsProvider } from './components/AIToolsProvider';
import { TenantProvider } from './components/TenantProvider';
import { RoleProvider } from './components/RoleBasedAccess';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { queryClient } from './lib/queryClient';

// Main pages
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Pipeline from './pages/Pipeline';
import AuthenticatedLayout from './components/layout/AuthenticatedLayout';

function App() {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // Handle missing Clerk key gracefully
  if (!publishableKey) {
    console.warn('Clerk authentication disabled - VITE_CLERK_PUBLISHABLE_KEY not configured');
    
    // Return app without Clerk wrapper for development
    return (
      <QueryClientProvider client={queryClient}>
        <TenantProvider>
          <RoleProvider>
            <EnhancedHelpProvider>
              <AIToolsProvider>
                <Router>
                  <Routes>
                    {/* Main routes */}
                    <Route path="/dashboard" element={
                      <AuthenticatedLayout>
                        <Dashboard />
                      </AuthenticatedLayout>
                    } />
                    <Route path="/contacts" element={
                      <AuthenticatedLayout>
                        <Contacts />
                      </AuthenticatedLayout>
                    } />
                    <Route path="/pipeline" element={
                      <AuthenticatedLayout>
                        <Pipeline />
                      </AuthenticatedLayout>
                    } />
                    <Route path="/" element={
                      <AuthenticatedLayout>
                        <Dashboard />
                      </AuthenticatedLayout>
                    } />
                  </Routes>
                </Router>
              </AIToolsProvider>
            </EnhancedHelpProvider>
          </RoleProvider>
        </TenantProvider>
      </QueryClientProvider>
    );
  }

  // Clerk implementation would go here if needed
  return null;
}

export default App;