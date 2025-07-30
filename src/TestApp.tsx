import React from 'react';

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 App Loading Test</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
        <h3>Test Info:</h3>
        <ul>
          <li>React: ✅ Working</li>
          <li>Vite: ✅ Working</li>
          <li>TypeScript: ✅ Working</li>
        </ul>
      </div>
      <button 
        onClick={() => alert('Button click works!')}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Click
      </button>
    </div>
  );
}

export default TestApp;
