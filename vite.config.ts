import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    hmr: {
      port: 5173,
    },
  },
  define: {
    global: 'window',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'framer-motion'],
          charts: ['recharts', 'd3-scale', 'd3-shape'],
          forms: ['react-hook-form'],
          utils: ['lodash', 'uuid'],
          ai: ['openai'],
          // Supabase chunk
          supabase: ['@supabase/supabase-js', '@supabase/auth-js'],
          // Query and state management
          query: ['@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});