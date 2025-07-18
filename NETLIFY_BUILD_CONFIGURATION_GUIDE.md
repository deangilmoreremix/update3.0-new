# 🔧 Netlify Build Configuration Updates
## For Cache Clearing Implementation

---

## 🎯 **REQUIRED CHANGES IN NETLIFY UI**

### **1. Update Build Command** ⚠️ CRITICAL
**Current**: `npm ci && npm run build`
**New**: `npm ci && npm run build:clean`

**How to Update**:
1. Go to: **Site Settings > Build & deploy > Build settings**
2. Click **"Configure"** next to Build settings
3. Change **Build command** from `npm ci && npm run build` to:
   ```bash
   npm ci && npm run build:clean
   ```
4. Click **"Save"**

**Why**: This ensures each build clears the cache first, generating fresh assets with new timestamps.

---

### **2. Node.js Version** ✅ ALREADY CORRECT
**Current**: `22.x`
**Our Config**: `22.x` ✅ MATCHES

**Status**: ✅ **NO ACTION NEEDED** - Versions already match

**Why**: Your Netlify is already set to 22.x and our netlify.toml now matches this.

---

### **3. Clear Build Cache** 🧹 IMMEDIATE ACTION
**How to Clear**:
1. Go to: **Site Settings > Build & deploy > Build settings**
2. Scroll down and click **"Clear cache and retry deploy"**
3. This will clear Netlify's build cache immediately

**Why**: Removes any cached dependencies that might interfere with the new cache-busting strategy.

---

### **4. Force New Deploy** 🚀 TRIGGER DEPLOYMENT
**How to Force Deploy**:
1. Go to: **Deploys** tab
2. Click **"Trigger deploy"** > **"Deploy site"**
3. This will use the new build command immediately

**Alternative**: Push any small change to trigger automatic deployment.

---

## 🌐 **ENVIRONMENT VARIABLES CHECK**

### **Required Variables** (Should Already Be Set):
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_OPENAI_API_KEY=your_openai_key
NODE_ENV=production
```

**To Verify**:
1. Go to: **Site Settings > Environment variables**
2. Ensure all required variables are present
3. Add any missing variables

---

## 📋 **STEP-BY-STEP NETLIFY CONFIGURATION**

### **Step 1: Update Build Command** (2 minutes)
```
Site Settings > Build & deploy > Build settings > Configure
Change: "npm ci && npm run build" 
To: "npm ci && npm run build:clean"
Save
```

### **Step 2: Update Node Version** (1 minute)  
```
Site Settings > Build & deploy > Dependency management > Configure
Change: "22.x"
To: "20.x" 
Save
```

### **Step 3: Clear Build Cache** (1 minute)
```
Site Settings > Build & deploy > Build settings
Click: "Clear cache and retry deploy"
```

### **Step 4: Verify Environment Variables** (1 minute)
```
Site Settings > Environment variables
Ensure all VITE_ variables are present
```

### **Step 5: Trigger New Deploy** (1 minute)
```
Deploys tab > Trigger deploy > Deploy site
OR push a small change to main branch
```

---

## 🎯 **EXPECTED BUILD PROCESS**

### **With New Configuration**:
1. **Install**: `npm ci` (clean install)
2. **Clean**: `npm run clean` (removes old dist and cache)
3. **Build**: `vite build` (generates new timestamped assets)
4. **Deploy**: Assets with new names deployed to CDN

### **New Asset Names Will Be**:
```
OLD: index-D2WB2prQ.js (cached, causing errors)
NEW: index-CvZlvyhN-1752872983673.js (fresh, working)
```

---

## 🚨 **TROUBLESHOOTING SPLIT TESTING**

### **Current Issue**:
Your site has **Split Testing** enabled with:
- Branch 1: `main` (50%)
- Branch 2: `codex/update-placeholder-implementations-in-openaifunctionservice` (50%)

### **⚠️ DISABLE SPLIT TESTING** (CRITICAL):
1. Go to: **Site Settings > Build & deploy > Split Testing**
2. **Turn OFF** the current split test
3. Set **100% traffic** to `main` branch

**Why**: Split testing might serve the old broken branch to 50% of users, preventing them from seeing the fixed version.

---

## 🔍 **VERIFICATION CHECKLIST**

### **After Making Changes**:
- [ ] Build command updated to `npm run build:clean`
- [ ] Node.js version set to 20.x
- [ ] Build cache cleared
- [ ] Split testing disabled (100% main branch)
- [ ] Environment variables verified
- [ ] New deploy triggered

### **Expected Results**:
- [ ] Build logs show `npm run build:clean` command
- [ ] New assets generated with timestamps
- [ ] Site loads without VideoCall provider errors
- [ ] All functionality restored

---

## 📊 **MONITORING THE FIX**

### **Check Build Logs** (After Deploy):
1. Go to: **Deploys** tab
2. Click on latest deploy
3. View **Function logs** and **Deploy logs**
4. Look for:
   ```
   Running "npm run build:clean"
   ✓ built in XX.XXs
   New assets: index-XXXXX-timestamp.js
   ```

### **Verify Live Site**:
1. Visit: https://smart-crm.videoremix.io
2. Open **Developer Tools** > **Network** tab
3. Reload page (Ctrl+F5)
4. Verify new asset names with timestamps
5. Check console for no VideoCall errors

---

## 🚀 **QUICK SUMMARY OF REQUIRED ACTIONS**

1. **Build Command**: Change to `npm ci && npm run build:clean`
2. **Node Version**: Change to `20.x`  
3. **Clear Cache**: Use "Clear cache and retry deploy"
4. **Disable Split Testing**: Set 100% to main branch
5. **Trigger Deploy**: Force new deployment

**Time Required**: ~5 minutes
**Impact**: Resolves cache issues and VideoCall provider errors

---

## ✅ **SUCCESS INDICATORS**

After these changes, you should see:
- ✅ New asset URLs with timestamps in browser network tab
- ✅ No "useVideoCall must be used within a VideoCallProvider" errors
- ✅ Full Smart CRM application functionality restored
- ✅ Build logs showing successful `build:clean` process

The cache clearing implementation will be fully operational! 🎉
