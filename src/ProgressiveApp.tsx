import { Routes, Route } from 'react-router-dom';

// Simple placeholder components to test imports one by one
function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">SmartCRM Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-600">Dashboard is loading with basic imports...</p>
        </div>
      </div>
    </div>
  );
}

function PipelinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sales Pipeline</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-600">Pipeline management coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function ContactsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contacts</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-600">Contact management coming soon...</p>
        </div>
      </div>
    </div>
  );
}

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
