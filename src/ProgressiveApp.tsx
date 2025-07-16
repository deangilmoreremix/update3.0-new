import { Routes, Route } from 'react-router-dom';

// Import real page components
import DashboardPage from './pages/Dashboard';
import PipelinePage from './pages/Pipeline';
import ContactsPage from './pages/Contacts';

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
    <div className="min-h-screen h-full w-full flex flex-col">
      <SimpleNavbar />
      <div className="flex-1 w-full overflow-hidden">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default ProgressiveApp;
