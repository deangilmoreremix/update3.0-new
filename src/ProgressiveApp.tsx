import { Routes, Route } from 'react-router-dom';

// Import context providers
import { ThemeProvider } from './contexts/ThemeContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import { AIToolsProvider } from './components/AIToolsProvider';

// Use the complete redesigned Dashboard from smartcrmdash integration
import Dashboard from './components/Dashboard';

// Import redesigned Enhanced page components for other pages
import PipelineEnhanced from '../pages/PipelineEnhanced';
import ContactsEnhanced from '../pages/ContactsEnhanced';

function SimpleNavbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">SmartCRM</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            <a href="/pipeline" className="text-gray-600 hover:text-gray-900">Pipeline</a>
            <a href="/contacts" className="text-gray-600 hover:text-gray-900">Contacts</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function ProgressiveApp() {
  return (
    <ThemeProvider>
      <DashboardLayoutProvider>
        <AIToolsProvider>
          <div className="min-h-screen h-full w-full flex flex-col">
            <SimpleNavbar />
            <div className="flex-1 w-full overflow-hidden">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pipeline" element={<PipelineEnhanced />} />
                <Route path="/contacts" element={<ContactsEnhanced />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </div>
          </div>
        </AIToolsProvider>
      </DashboardLayoutProvider>
    </ThemeProvider>
  );
}

export default ProgressiveApp;
