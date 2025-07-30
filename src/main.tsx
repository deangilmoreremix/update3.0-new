import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MinimalWorkingApp from './MinimalWorkingApp';
import { SimpleErrorBoundary } from './SimpleErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimpleErrorBoundary>
      <MinimalWorkingApp />
    </SimpleErrorBoundary>
  </StrictMode>
);
