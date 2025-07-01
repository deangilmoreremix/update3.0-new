import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Force production key to override system environment variable
const publishableKey = 'pk_live_Y2xlcmsuc21hcnQtY3JtLnZpZGVvcmVtaXguaW8k';

if (!publishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}

// Create root and render app immediately without any delays or deferment
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  </StrictMode>
);

// Single source of truth for page load handling - avoid duplication with index.html
window.addEventListener('DOMContentLoaded', () => {
  // Mark content as ready for initial display
  document.documentElement.classList.add('content-ready');
});

// When fully loaded, complete the transition
window.addEventListener('load', () => {
  // Add page-loaded class to html element
  document.documentElement.classList.add('page-loaded');
  
  // Remove the loader once everything is ready
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.classList.add('hide-loader');
    setTimeout(() => loader.remove(), 300);
  }
});