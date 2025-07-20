import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProviders } from './components/providers/AppProviders';
import Navbar from './components/Navbar';
import PlaceholderPage from './components/PlaceholderPage';

// Lazy load pages to improve initial load time
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Contacts = React.lazy(() => import('./pages/Contacts'));
const Pipeline = React.lazy(() => import('./pages/Pipeline'));
const AITools = React.lazy(() => import('./pages/AITools'));
const Settings = React.lazy(() => import('./pages/Settings'));
const AIGoals = React.lazy(() => import('./pages/AIGoals'));
const Appointments = React.lazy(() => import('./pages/Appointments'));
const SalesTools = React.lazy(() => import('./pages/SalesTools'));
const Tasks = React.lazy(() => import('./pages/Tasks'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <AppProviders>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        
        {/* Main Content with padding for top navbar */}
        <main className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Primary Navigation */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/ai-tools" element={<AITools />} />
                <Route path="/ai-goals" element={<AIGoals />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/settings" element={<Settings />} />

                {/* Sales Tools Routes */}
                <Route path="/sales-tools" element={<SalesTools />} />
                <Route path="/lead-automation" element={<PlaceholderPage title="Lead Automation" />} />
                <Route path="/circle-prospecting" element={<PlaceholderPage title="Circle Prospecting" />} />
                <Route path="/phone-system" element={<PlaceholderPage title="Phone System" />} />
                <Route path="/invoicing" element={<PlaceholderPage title="Invoicing" />} />
                <Route path="/sales-analytics" element={<PlaceholderPage title="Sales Analytics" />} />
                <Route path="/deal-pipeline" element={<PlaceholderPage title="Deal Pipeline" />} />
                <Route path="/quote-builder" element={<PlaceholderPage title="Quote Builder" />} />
                <Route path="/commission-tracker" element={<PlaceholderPage title="Commission Tracker" />} />
                <Route path="/follow-up-reminders" element={<PlaceholderPage title="Follow-up Reminders" />} />
                <Route path="/territory-management" element={<PlaceholderPage title="Territory Management" />} />

                {/* Task Tools Routes */}
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/task-automation" element={<PlaceholderPage title="Task Automation" />} />
                <Route path="/project-tracker" element={<PlaceholderPage title="Project Tracker" />} />
                <Route path="/time-tracking" element={<PlaceholderPage title="Time Tracking" />} />
                <Route path="/workflow-builder" element={<PlaceholderPage title="Workflow Builder" />} />
                <Route path="/deadline-manager" element={<PlaceholderPage title="Deadline Manager" />} />

                {/* Communication Tools Routes */}
                <Route path="/email-composer" element={<PlaceholderPage title="Email Composer" />} />
                <Route path="/campaigns" element={<PlaceholderPage title="Campaigns" />} />
                <Route path="/video-email" element={<PlaceholderPage title="Video Email" />} />
                <Route path="/text-messages" element={<PlaceholderPage title="Text Messages" />} />
                <Route path="/group-calls" element={<PlaceholderPage title="Group Calls" />} />
                <Route path="/call-recording" element={<PlaceholderPage title="Call Recording" />} />
                <Route path="/in-call-messaging" element={<PlaceholderPage title="In-Call Messaging" />} />
                <Route path="/call-analytics" element={<PlaceholderPage title="Call Analytics" />} />
                <Route path="/connection-quality" element={<PlaceholderPage title="Connection Quality" />} />

                {/* Content Tools Routes */}
                <Route path="/content-library" element={<PlaceholderPage title="Content Library" />} />
                <Route path="/voice-profiles" element={<PlaceholderPage title="Voice Profiles" />} />
                <Route path="/business-analysis" element={<PlaceholderPage title="Business Analysis" />} />
                <Route path="/image-generator" element={<PlaceholderPage title="Image Generator" />} />
                <Route path="/forms" element={<PlaceholderPage title="Forms" />} />
                <Route path="/ai-model-demo" element={<PlaceholderPage title="AI Model Demo" />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </AppProviders>
  );
}

export default App;