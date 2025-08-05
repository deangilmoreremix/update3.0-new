import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Simple throttle to avoid repeated handler execution (e.g., during HMR)
const throttle = <T extends (...args: any[]) => void>(fn: T, delay = 100) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) return;
    fn(...args);
    timeout = setTimeout(() => {
      timeout = null;
    }, delay);
  };
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Single source of truth for page load handling - avoid duplication with index.html
window.addEventListener(
  'DOMContentLoaded',
  throttle(() => {
    // Mark content as ready for initial display
    document.documentElement.classList.add('content-ready');
  })
);

// When fully loaded, complete the transition
window.addEventListener(
  'load',
  throttle(() => {
    // Add page-loaded class to html element
    document.documentElement.classList.add('page-loaded');

    // Remove the loader once everything is ready
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.classList.add('hide-loader');
      setTimeout(() => loader.remove(), 300);
    }
  })
);