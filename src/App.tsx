import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProviders } from './components/providers/AppProviders';
import AuthenticatedLayout from './components/layouts/AuthenticatedLayout';
import PlaceholderPage from './components/PlaceholderPage';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Pipeline from './pages/Pipeline';
import AITools from './pages/AITools';
import Settings from './pages/Settings';
import AIGoals from './pages/AIGoals';
import LandingPage from './pages/Landing/LandingPage';

// Import existing pages
import Appointments from './pages/Appointments';
import SalesTools from './pages/SalesTools';
import Tasks from './pages/Tasks';

// Import auth pages
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';

function App() {
  return (
    <AppProviders>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Routes>
          {/* Landing Page - No Navbar */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Auth Pages - No Navbar */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          
          {/* App Routes - With Navbar and proper layout */}
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
          <Route path="/ai-tools" element={
            <AuthenticatedLayout>
              <AITools />
            </AuthenticatedLayout>
          } />
          <Route path="/ai-goals" element={
            <AuthenticatedLayout>
              <AIGoals />
            </AuthenticatedLayout>
          } />
          <Route path="/appointments" element={
            <AuthenticatedLayout>
              <Appointments />
            </AuthenticatedLayout>
          } />
          <Route path="/settings" element={
            <AuthenticatedLayout>
              <Settings />
            </AuthenticatedLayout>
          } />
          <Route path="/sales-tools" element={
            <AuthenticatedLayout>
              <SalesTools />
            </AuthenticatedLayout>
          } />
          <Route path="/tasks" element={
            <AuthenticatedLayout>
              <Tasks />
            </AuthenticatedLayout>
          } />
          
          {/* Other placeholder routes */}
          <Route path="/lead-automation" element={
            <AuthenticatedLayout>
              <PlaceholderPage title="Lead Automation" />
            </AuthenticatedLayout>
          } />
          <Route path="/circle-prospecting" element={
            <AuthenticatedLayout>
              <PlaceholderPage title="Circle Prospecting" />
            </AuthenticatedLayout>
          } />
          <Route path="/phone-system" element={
            <AuthenticatedLayout>
              <PlaceholderPage title="Phone System" />
            </AuthenticatedLayout>
          } />
          <Route path="/invoicing" element={
            <AuthenticatedLayout>
              <PlaceholderPage title="Invoicing" />
            </AuthenticatedLayout>
          } />
          <Route path="/ai-model-demo" element={
            <AuthenticatedLayout>
              <PlaceholderPage title="AI Model Demo" />
            </AuthenticatedLayout>
          } />
        </Routes>
      </div>
    </AppProviders>
  );
}

export default App;