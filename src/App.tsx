import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProviders } from './components/providers/AppProviders';
import Navbar from './components/Navbar';
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
import KimiDebugPage from './pages/KimiDebugPage';

import { FloatingDebugAssistant } from './components/debug/FloatingDebugAssistant';
import { KimiErrorBoundary } from './hooks/useKimiDebug';

function App() {
  return (
    <KimiErrorBoundary>
      <AppProviders>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Navbar />

          {/* Main Content with padding for top navbar */}
          <main className="pt-20 px-4">
            <div className="max-w-7xl mx-auto">
              <Routes>
                {/* Primary Navigation */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/ai-tools" element={<AITools />} />
                <Route path="/ai-goals" element={<AIGoals />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/debug" element={<KimiDebugPage />} />

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
                <Route path="/ai-model-demo" element={<PlaceholderPage title="AI Model Demo" />} />
              </Routes>
            </div>
          </main>

          {/* Kimi AI Debug Assistant - Available globally */}
          <FloatingDebugAssistant />
        </div>
      </AppProviders>
    </KimiErrorBoundary>
  );
}

export default App;
