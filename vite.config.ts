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
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    global: 'window',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'ui-vendor';
            }
            if (id.includes('@tanstack/react-query') || id.includes('react-hook-form') || id.includes('zod')) {
              return 'data-vendor';
            }
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'chart-vendor';
            }
            if (id.includes('openai') || id.includes('@google/generative-ai') || id.includes('composio-core')) {
              return 'ai-vendor';
            }
            if (id.includes('@supabase')) {
              return 'backend-vendor';
            }
            if (id.includes('lodash') || id.includes('axios')) {
              return 'utils-vendor';
            }
            return 'vendor';
          }
          
          // Page chunks for code splitting
          if (id.includes('pages/DashboardEnhanced')) {
            return 'dashboard';
          }
          if (id.includes('pages/AITools')) {
            return 'ai-tools';
          }
          if (id.includes('pages/ContactsEnhanced')) {
            return 'contacts';
          }
          if (id.includes('pages/PipelineEnhanced')) {
            return 'pipeline';
          }
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 500
  }
});