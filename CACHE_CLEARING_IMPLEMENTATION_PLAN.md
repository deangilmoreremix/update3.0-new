# 🚨 Netlify Cache Clearing Implementation Plan
## Fix: "useVideoCall must be used within a VideoCallProvider" Error

---

## 🎯 **PROBLEM ANALYSIS**

### **Issue Identified:**
- **Error**: `useVideoCall must be used within a VideoCallProvider`
- **Root Cause**: Cached old bundle files (`index-D2WB2prQ.js`) serving outdated code
- **Location**: https://smart-crm.videoremix.io still serving old assets
- **Impact**: Users seeing old broken version instead of fixed application

### **Cache Layers Involved:**
1. **Browser Cache** - User's local browser cache
2. **Netlify CDN Cache** - Netlify's edge cache servers
3. **DNS Cache** - Domain name resolution cache
4. **Service Worker Cache** - If implemented in app

---

## 🔧 **COMPREHENSIVE CACHE CLEARING STRATEGY**

### **Phase 1: Immediate Cache Busting (5 minutes)**

#### **Step 1A: Force New Build with Cache Busting**
```bash
# Update package.json to force new build hash
npm version patch --no-git-tag-version
git add package.json
git commit -m "🚀 Force cache bust - increment version for new deployment"
git push origin main
```

#### **Step 1B: Netlify Build Cache Clear**
```bash
# Clear Netlify build cache via API (if available)
# OR manually trigger in Netlify UI: Site Settings > Build & Deploy > Clear cache
```

#### **Step 1C: Add Cache-Busting Headers**
```toml
# Update netlify.toml with aggressive cache clearing
[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
    Pragma = "no-cache"
    Expires = "0"

[[headers]]
  for = "/assets/*.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
    
[[headers]]
  for = "/assets/*.css"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

---

### **Phase 2: Vite Build Configuration Updates (10 minutes)**

#### **Step 2A: Update Vite Config for Better Cache Busting**
```typescript
// vite.config.ts modifications
export default defineConfig({
  // ... existing config
  build: {
    rollupOptions: {
      output: {
        // Force new chunk names with timestamp
        chunkFileNames: 'assets/[name]-[hash]-' + Date.now() + '.js',
        entryFileNames: 'assets/[name]-[hash]-' + Date.now() + '.js',
        assetFileNames: 'assets/[name]-[hash]-' + Date.now() + '.[ext]'
      }
    },
    // Clear output directory
    emptyOutDir: true
  }
})
```

#### **Step 2B: Add Build-Time Cache Busting**
```json
// Update package.json scripts
{
  "scripts": {
    "build": "rm -rf dist && vite build",
    "build:clean": "npm run clean && vite build",
    "clean": "rm -rf dist node_modules/.vite",
    "deploy": "npm run build:clean && echo 'Build complete for deployment'"
  }
}
```

---

### **Phase 3: VideoCallProvider Context Fix (15 minutes)**

#### **Step 3A: Verify VideoCallProvider Wrapper**
```typescript
// src/App.tsx - Ensure proper provider hierarchy
function App() {
  return (
    <ThemeProvider>
      <VideoCallProvider>  {/* This must wrap ALL components using useVideoCall */}
        <AIToolsProvider>
          <NavigationProvider>
            <DashboardLayoutProvider> 
              <EnhancedHelpProvider>
                <ModalsProvider>
                  {/* All app content here */}
                </ModalsProvider>
              </EnhancedHelpProvider>
            </DashboardLayoutProvider>
          </NavigationProvider>
        </AIToolsProvider>
      </VideoCallProvider>
    </ThemeProvider>
  );
}
```

#### **Step 3B: Audit All useVideoCall Usage**
```bash
# Find all components using useVideoCall
grep -r "useVideoCall" src/ --include="*.tsx" --include="*.ts"

# Verify each component is within VideoCallProvider scope
```

#### **Step 3C: Add Error Boundary for Context Issues**
```typescript
// src/components/VideoCallErrorBoundary.tsx
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const VideoCallErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      if (error.message.includes('useVideoCall must be used within')) {
        setHasError(true);
        console.error('VideoCall context error detected, reloading page...');
        setTimeout(() => window.location.reload(), 1000);
      }
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2>Loading latest version...</h2>
          <p>Clearing cache and reloading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
```

---

### **Phase 4: Netlify Deployment Optimization (10 minutes)**

#### **Step 4A: Update Netlify Configuration**
```toml
# netlify.toml - Complete cache optimization
[build]
  command = "npm ci && npm run build:clean"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = ""
  NODE_ENV = "production"
  # Force cache busting
  BUILD_TIMESTAMP = "$BUILD_ID"

# Aggressive cache clearing during deployment
[build.processing]
  skip_processing = false

# Force SPA routing with cache clearing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true
  headers = {Cache-Control = "no-cache"}

# Security and cache headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# HTML - No cache to ensure updates
[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
    Pragma = "no-cache"
    Expires = "0"
    Clear-Site-Data = "cache"

# Assets - Short cache during debugging
[[headers]]
  for = "/assets/*.js"
  [headers.values]
    Cache-Control = "public, max-age=300, must-revalidate"  # 5 minutes only

[[headers]]
  for = "/assets/*.css"
  [headers.values]
    Cache-Control = "public, max-age=300, must-revalidate"  # 5 minutes only
```

#### **Step 4B: Add Deploy Preview URL**
```bash
# Create deploy-preview script
echo '#!/bin/bash
echo "🚀 Deploying to Netlify with cache clearing..."
echo "Build timestamp: $(date)"
npm run build:clean
echo "✅ Build complete - new assets generated"
' > deploy-with-cache-clear.sh
chmod +x deploy-with-cache-clear.sh
```

---

### **Phase 5: Browser Cache Clearing Instructions (5 minutes)**

#### **Step 5A: Add Cache Clearing Service Worker**
```typescript
// public/sw.js - Service worker for cache management
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Clear all caches on activation
          return caches.delete(cacheName);
        })
      );
    })
  );
});
```

#### **Step 5B: Add Cache Clearing Utility**
```typescript
// src/utils/cacheClear.ts
export const clearAllCaches = async () => {
  try {
    // Clear browser cache
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Force reload from server
    window.location.reload();
  } catch (error) {
    console.error('Cache clearing failed:', error);
    // Fallback: force reload
    window.location.href = window.location.href;
  }
};
```

#### **Step 5C: Add Cache Clear Button (Development)**
```typescript
// src/components/CacheClearButton.tsx
import React from 'react';
import { clearAllCaches } from '../utils/cacheClear';

export const CacheClearButton: React.FC = () => {
  const handleClearCache = () => {
    if (confirm('Clear all caches and reload? This will help load the latest version.')) {
      clearAllCaches();
    }
  };

  // Only show in development or when errors detected
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <button
      onClick={handleClearCache}
      className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded z-50"
    >
      Clear Cache & Reload
    </button>
  );
};
```

---

### **Phase 6: Deployment Verification (10 minutes)**

#### **Step 6A: Pre-deployment Checklist**
```bash
# Run before deployment
echo "🔍 Pre-deployment verification..."

# 1. Verify VideoCallProvider is properly wrapped
grep -n "VideoCallProvider" src/App.tsx

# 2. Check for useVideoCall usage outside provider
find src/ -name "*.tsx" -exec grep -l "useVideoCall" {} \; | xargs grep -n "useVideoCall"

# 3. Build test
npm run build:clean

# 4. Bundle analysis
ls -la dist/assets/

echo "✅ Pre-deployment checks complete"
```

#### **Step 6B: Post-deployment Verification**
```bash
# Check new deployment
curl -I https://smart-crm.videoremix.io/
curl -I https://smart-crm.videoremix.io/assets/

# Verify new asset hashes
echo "New assets should have different hashes than: index-D2WB2prQ.js"
```

---

## 📋 **IMPLEMENTATION SEQUENCE**

### **Immediate Actions (Execute in Order):**

1. **🚨 Emergency Cache Clear** (2 mins)
   - Update netlify.toml with no-cache headers
   - Commit and push immediately

2. **🔧 Fix VideoCallProvider** (5 mins)
   - Verify App.tsx provider hierarchy
   - Add error boundary for graceful handling

3. **🚀 Force New Build** (3 mins)
   - Increment package.json version
   - Update vite.config.ts for new asset names
   - Commit and push

4. **🧹 Clear Netlify Build Cache** (2 mins)
   - Manual clear in Netlify UI
   - Or use Netlify CLI: `netlify build --clear-cache`

5. **🔍 Verify Deployment** (3 mins)
   - Check new asset URLs in browser
   - Verify no more VideoCallProvider errors

---

## ⚠️ **EXPECTED OUTCOMES**

### **Success Indicators:**
- ✅ New asset URLs (not `index-D2WB2prQ.js`)
- ✅ No "useVideoCall must be used within a VideoCallProvider" errors
- ✅ Full application loads properly
- ✅ All video call features functional

### **Fallback Plan:**
If cache clearing doesn't work immediately:
1. Change domain temporarily (subdomain redirect)
2. Use `?v=timestamp` query parameters
3. Implement progressive web app cache strategy

---

## 🎯 **READY FOR APPROVAL**

This plan will:
1. ✅ Clear all cache layers (browser, CDN, build)
2. ✅ Fix the VideoCallProvider context issue
3. ✅ Force generation of new asset bundles
4. ✅ Ensure users get the latest working version
5. ✅ Provide fallback mechanisms for cache issues

**Estimated Total Time**: 30-45 minutes
**Risk Level**: Low (all changes are safe and reversible)

**Approve this plan to proceed with implementation?**
