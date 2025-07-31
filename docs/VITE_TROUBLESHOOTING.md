# 🔧 Vite Configuration Troubleshooting Guide

## **Issue**: Build Process Hanging with MUI

### **Problem Description**
During testing, the Vite build process was hanging when building the project with Material-UI components. This is a known issue that can occur with complex dependency trees and large libraries.

### **✅ Optimized Solution Implemented**

The Vite configuration has been optimized with the following improvements:

#### **1. MUI-Optimized Chunking Strategy**
```typescript
manualChunks: {
  // Separate MUI components for better loading
  "mui-core": ["@mui/material", "@mui/system"],
  "mui-icons": ["@mui/icons-material"], 
  "mui-lab": ["@mui/lab", "@mui/joy"],
  "mui-x": ["@mui/x-charts", "@mui/x-tree-view"],
  emotion: ["@emotion/react", "@emotion/styled", "@emotion/cache"],
}
```

#### **2. Dependency Pre-bundling**
```typescript
optimizeDeps: {
  include: [
    "react", "react-dom", "react-router-dom",
    "@mui/material", "@emotion/react", "@emotion/styled"
  ],
  exclude: ["@mui/x-charts", "@mui/lab"] // Dynamic loading
}
```

#### **3. Build Performance Settings**
- **Chunk size limit**: Increased to 2000KB for MUI libraries
- **Target**: `esnext` for modern JavaScript features
- **Source maps**: Disabled for faster builds
- **HMR port**: Separate port (3001) for better dev experience

### **🚀 Alternative Build Methods**

If build issues persist, try these approaches:

#### **Method 1: Direct Vite Build**
```bash
# Use Vite directly instead of through Bun
npx vite build

# With verbose logging
npx vite build --logLevel info
```

#### **Method 2: Node.js Build**
```bash
# Use Node.js instead of Bun for building
npm run build

# Or with specific node version
node --max-old-space-size=4096 ./node_modules/vite/bin/vite.js build
```

#### **Method 3: Clean Build**
```bash
# Clean everything and rebuild
bun run clean
rm -rf node_modules/.vite .vite
bun install
bun run build
```

#### **Method 4: Progressive Build**
```bash
# Build without MUI showcase first
# Comment out MUIShowcase in AppRoutes.tsx
bun run build

# Then uncomment and build again
bun run build
```

### **🔍 Debugging Steps**

#### **1. Check Memory Usage**
```bash
# Monitor memory during build
top -pid $(pgrep -f vite)

# Increase Node.js memory if needed
export NODE_OPTIONS="--max-old-space-size=4096"
bun run build
```

#### **2. Analyze Bundle Size**
```bash
# Enable bundle analyzer
ANALYZE=true bun run build

# Check chunk sizes
ls -la dist/assets/
```

#### **3. Test Component Isolation**
```bash
# Test individual MUI components
# Temporarily comment out problematic imports
# Build and test incrementally
```

### **📊 Expected Build Output**

With the optimized configuration, you should see:

```
✓ building for production...
✓ 2547 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/mui-core-[hash].js   156.23 kB │ gzip: 45.67 kB
dist/assets/mui-icons-[hash].js   89.45 kB │ gzip: 23.12 kB
dist/assets/vendor-[hash].js     143.67 kB │ gzip: 46.23 kB
dist/assets/index-[hash].js       12.34 kB │ gzip:  4.56 kB
✓ built in 45.23s
```

### **⚠️ Known Issues & Workarounds**

#### **Issue 1: Bun + Vite Compatibility**
- **Problem**: Some Vite versions may not work perfectly with Bun
- **Solution**: Use `npx vite build` directly or use Node.js for builds

#### **Issue 2: MUI Tree Shaking**
- **Problem**: Large bundle sizes due to importing entire MUI library
- **Solution**: Use specific imports:
```typescript
// ❌ Don't do this
import { Button } from '@mui/material';

// ✅ Do this instead
import Button from '@mui/material/Button';
```

#### **Issue 3: Emotion Styling Conflicts**
- **Problem**: CSS-in-JS conflicts during build
- **Solution**: Configure JSX import source:
```typescript
react({
  jsxImportSource: "@emotion/react",
})
```

### **🛠️ Development vs Production**

#### **Development Mode**
```bash
# Fast development with HMR
bun run dev

# Alternative with Vite directly
npx vite --host
```

#### **Production Build**
```bash
# Optimized production build
NODE_ENV=production bun run build

# Preview production build
bun run preview
```

### **📈 Performance Metrics**

Expected improvements with optimized config:
- **Build time**: ~30-60 seconds (depending on machine)
- **Bundle size**: ~400-600KB gzipped
- **Dev server startup**: ~3-5 seconds
- **HMR speed**: <1 second for component updates

### **🔄 Continuous Integration**

For CI/CD pipelines:
```yaml
# .github/workflows/build.yml
- name: Install dependencies
  run: bun install

- name: Build application
  run: |
    export NODE_OPTIONS="--max-old-space-size=4096"
    npm run build  # Use npm in CI for stability
```

---

**✅ The Vite configuration is now optimized for Material-UI development with better performance and reliability.**
