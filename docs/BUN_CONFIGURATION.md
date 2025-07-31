# 🚀 Bun Configuration Guide

## **Bun as Default Package Manager**

This project is now configured to use **Bun** as the default package manager and runtime for improved performance and developer experience.

### **📦 Installation & Setup**

#### **Install Bun (if not already installed)**
```bash
curl -fsSL https://bun.sh/install | bash
# or
npm install -g bun
```

#### **Install Project Dependencies**
```bash
bun install
```

### **🔧 Available Scripts**

All scripts are now optimized for Bun:

```bash
# Development
bun run dev          # Start development server with Vite + Bun
bun run dev:bun      # Start with Bun's native hot reload (experimental)

# Building
bun run build        # Production build
bun run preview      # Preview production build
bun run build:analyze # Build with bundle analysis

# Testing
bun test            # Run tests with Bun's native test runner
bun run test:run    # Run tests with Vitest
bun run test:coverage # Run tests with coverage

# Code Quality
bun run type-check  # TypeScript type checking
bun run lint        # ESLint checking
bun run lint:fix    # Auto-fix linting issues

# Maintenance
bun run clean           # Clean build artifacts and caches
bun run install:clean   # Clean install (removes node_modules and lockfiles)
```

### **⚙️ Configuration Files**

#### **1. .bunfig.toml**
Bun-specific configuration for package management and runtime behavior:
- Lockfile management
- Registry settings
- Cache configuration
- Test runner settings

#### **2. bun.config.ts**
Build configuration for potential Bun builds (currently using Vite):
- Entry points and output configuration
- Target and format settings
- Minification and sourcemap settings

#### **3. package.json Updates**
- `packageManager`: Specifies Bun version
- `engines`: Bun version requirements
- `bun`: Bun-specific install settings
- Scripts updated to use `bun run` prefix

### **🚀 Performance Benefits**

#### **Installation Speed**
- **~3-5x faster** package installation compared to npm
- Uses native code instead of JavaScript
- Better dependency resolution algorithm

#### **Runtime Performance**
- Faster script execution with Bun's JavaScript runtime
- Built-in bundler and test runner
- Native TypeScript support

#### **Developer Experience**
- Hot reload with `--hot` flag
- Integrated test runner with `bun test`
- Built-in bundler alternative to Vite (optional)

### **🔄 Migration from npm/yarn**

If migrating from npm or yarn:

```bash
# Remove old lockfiles
rm package-lock.json yarn.lock

# Install with Bun
bun install

# Update scripts (already done in package.json)
# Test the setup
bun run dev
```

### **📁 File Structure Changes**

```
project-root/
├── .bunfig.toml          # Bun configuration
├── bun.config.ts         # Bun build config (optional)
├── bun.lockb             # Bun lockfile (binary)
├── package.json          # Updated with Bun settings
└── vite.config.ts        # Updated with MUI chunking
```

### **🎯 Current Setup**

- **Package Manager**: Bun 1.2.18
- **Build Tool**: Vite (for compatibility)
- **Test Runner**: Bun test + Vitest fallback
- **Runtime**: Bun for scripts, Node.js for Vite
- **Lockfile**: bun.lockb (binary format)

### **🔍 Verification**

Test your Bun setup:

```bash
# Check Bun version
bun --version

# Verify dependencies
bun run type-check

# Test development server
bun run dev

# Test build process
bun run build
```

### **🚨 Troubleshooting**

#### **Common Issues**

1. **Vite not starting**: Ensure Vite is installed globally or in project
2. **Type errors**: Run `bun run type-check` to verify TypeScript
3. **Module resolution**: Check `.bunfig.toml` registry settings

#### **Fallback to npm**

If you need to fallback to npm temporarily:
```bash
# Use npm for specific command
npm run dev

# Or change package.json scripts back to remove "bun run" prefix
```

### **🔮 Future Enhancements**

- **Full Bun Build**: Replace Vite with Bun's native bundler
- **Bun Test Migration**: Migrate from Vitest to Bun's test runner
- **Edge Runtime**: Deploy with Bun runtime instead of Node.js
- **Hot Reload**: Use Bun's native hot reload for faster development

---

**✅ Bun is now your default package manager!**

Run `bun run dev` to start developing with improved performance and faster package management.
