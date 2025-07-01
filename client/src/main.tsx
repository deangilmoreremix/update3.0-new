import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// Create root and render app immediately without any delays or deferment
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
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