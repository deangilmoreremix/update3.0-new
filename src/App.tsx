import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProviders } from './components/providers/AppProviders';
import AuthenticatedLayout from './components/layouts/AuthenticatedLayout';
import PlaceholderPage from './components/PlaceholderPage';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Pipeline = lazy(() => import('./pages/Pipeline'));
const AITools = lazy(() => import('./pages/AITools'));
const AIGoals = lazy(() => import('./pages/AIGoals'));
const Settings = lazy(() => import('./pages/Settings'));
const LandingPage = lazy(() => import('./pages/Landing/LandingPage'));

const Appointments = lazy(() => import('./pages/Appointments'));
const SalesTools = lazy(() => import('./pages/SalesTools'));
const Tasks = lazy(() => import('./pages/Tasks'));
const LeadAutomation = lazy(() => import('./pages/LeadAutomation'));
const CircleProspecting = lazy(() => import('./pages/CircleProspecting'));
const PhoneSystem = lazy(() => import('./pages/PhoneSystem'));
const Invoicing = lazy(() => import('./pages/Invoicing'));
const VideoEmail = lazy(() => import('./pages/VideoEmail'));
const TextMessages = lazy(() => import('./pages/TextMessages'));
const ContentLibrary = lazy(() => import('./pages/ContentLibrary/ContentLibrary'));
const VoiceProfiles = lazy(() => import('./pages/VoiceProfiles/VoiceProfiles'));
const BusinessAnalysis = lazy(() => import('./pages/BusinessAnalysis/BusinessAnalyzer'));
const Forms = lazy(() => import('./pages/FormsAndSurveys'));
const TaskCalendar = lazy(() => import('./pages/TaskCalendarView'));

// Auth pages
const SignIn = lazy(() => import('./pages/Auth/Login'));
const SignUp = lazy(() => import('./pages/Auth/Register'));

function App() {
  return (
    <AppProviders>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Suspense fallback={<div>Loading...</div>}>
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
            <Route path="/pipeline" element={
              <AuthenticatedLayout>
                <Pipeline />
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
            <Route path="/lead-automation" element={
              <AuthenticatedLayout>
                <LeadAutomation />
              </AuthenticatedLayout>
            } />
            <Route path="/circle-prospecting" element={
              <AuthenticatedLayout>
                <CircleProspecting />
              </AuthenticatedLayout>
            } />
            <Route path="/phone-system" element={
              <AuthenticatedLayout>
                <PhoneSystem />
              </AuthenticatedLayout>
            } />
            <Route path="/invoicing" element={
              <AuthenticatedLayout>
                <Invoicing />
              </AuthenticatedLayout>
            } />
            <Route path="/video-email" element={
              <AuthenticatedLayout>
                <VideoEmail />
              </AuthenticatedLayout>
            } />
            <Route path="/text-messages" element={
              <AuthenticatedLayout>
                <TextMessages />
              </AuthenticatedLayout>
            } />
            <Route path="/content-library" element={
              <AuthenticatedLayout>
                <ContentLibrary />
              </AuthenticatedLayout>
            } />
            <Route path="/voice-profiles" element={
              <AuthenticatedLayout>
                <VoiceProfiles />
              </AuthenticatedLayout>
            } />
            <Route path="/business-analysis" element={
              <AuthenticatedLayout>
                <BusinessAnalysis />
              </AuthenticatedLayout>
            } />
            <Route path="/forms" element={
              <AuthenticatedLayout>
                <Forms />
              </AuthenticatedLayout>
            } />
            <Route path="/task-calendar" element={
              <AuthenticatedLayout>
                <TaskCalendar />
              </AuthenticatedLayout>
            } />

            {/* Catch-all */}
            <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
          </Routes>
        </Suspense>
      </div>
    </AppProviders>
  );
}

export default App;