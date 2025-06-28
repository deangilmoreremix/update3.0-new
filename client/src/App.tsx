import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AIToolsProvider } from './components/AIToolsProvider';

// Landing Pages
import LandingPage from './pages/Landing/LandingPage';

// Main pages
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AIToolsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AIToolsProvider>
  );
}

export default App;