import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

// Simple components for each page
const Dashboard = () => (
  <div style={{ padding: '20px' }}>
    <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>🏠 Dashboard</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', borderRadius: '10px', color: 'white' }}>
        <h3>Total Contacts</h3>
        <p style={{ fontSize: '2em', margin: '10px 0' }}>150</p>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '20px', borderRadius: '10px', color: 'white' }}>
        <h3>Active Deals</h3>
        <p style={{ fontSize: '2em', margin: '10px 0' }}>42</p>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '20px', borderRadius: '10px', color: 'white' }}>
        <h3>Revenue</h3>
        <p style={{ fontSize: '2em', margin: '10px 0' }}>$125K</p>
      </div>
    </div>
  </div>
);

const Contacts = () => (
  <div style={{ padding: '20px' }}>
    <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>👥 Contacts</h1>
    <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <p>Contact management interface would go here.</p>
    </div>
  </div>
);

const Pipeline = () => (
  <div style={{ padding: '20px' }}>
    <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>📊 Pipeline</h1>
    <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <p>Sales pipeline would go here.</p>
    </div>
  </div>
);

const AITools = () => (
  <div style={{ padding: '20px' }}>
    <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>🤖 AI Tools</h1>
    <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <p>AI-powered tools and automation would go here.</p>
    </div>
  </div>
);

// Navigation component
const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '🏠 Dashboard' },
    { path: '/contacts', label: '👥 Contacts' },
    { path: '/pipeline', label: '📊 Pipeline' },
    { path: '/ai-tools', label: '🤖 AI Tools' },
  ];

  return (
    <nav style={{ 
      background: '#1f2937', 
      padding: '10px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', padding: '0 20px' }}>
        {navItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            style={{
              color: location.pathname === path ? '#60a5fa' : '#d1d5db',
              textDecoration: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              background: location.pathname === path ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

// Main app component
const MinimalWorkingApp: React.FC = () => {
  return (
    <BrowserRouter>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to br, #f8fafc, #e2e8f0)',
        fontFamily: 'Arial, sans-serif'
      }}>
        <header style={{ background: 'white', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ 
              margin: 0, 
              color: '#1f2937',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2rem'
            }}>
              🚀 CRM Dashboard
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>
              Modern Customer Relationship Management
            </p>
          </div>
        </header>
        
        <Navigation />
        
        <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/ai-tools" element={<AITools />} />
          </Routes>
        </main>
        
        <footer style={{ 
          background: '#1f2937', 
          color: '#d1d5db', 
          textAlign: 'center', 
          padding: '20px',
          marginTop: '40px'
        }}>
          <p>© 2025 Modern CRM - Working App Demo</p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default MinimalWorkingApp;
