import React from 'react';

const TestSimpleApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2563eb' }}>🎉 App is Working!</h1>
      <p>This is a test component to verify the React app is functioning.</p>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        borderRadius: '10px',
        color: 'white',
        margin: '20px 0'
      }}>
        <h2>✅ React is Loaded</h2>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
      </div>
      <button 
        onClick={() => alert('Button clicked!')}
        style={{
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>
    </div>
  );
};

export default TestSimpleApp;
