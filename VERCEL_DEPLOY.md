# Vercel Deployment Guide

## 🚀 Deploying to Vercel

This React + Vite application is configured for optimal Vercel deployment with proper SPA routing support.

### Quick Deploy

1. **Connect to Vercel**
   ```bash
   # Install Vercel CLI (if not already installed)
   npm i -g vercel
   
   # Deploy from project root
   vercel
   ```

2. **Configure Environment Variables**
   - Set `BUILD_TARGET=production` in Vercel dashboard
   - Configure any API endpoints for production

### Configuration Files

- **`vercel.json`** - Main deployment configuration with SPA routing
- **`.vercelignore`** - Files to exclude from deployment
- **`package.json`** - Contains `vercel:build` script

### Key Features

✅ **SPA Routing Support** - All routes redirect to `/index.html`  
✅ **Optimized Caching** - Static assets cached for 1 year  
✅ **Bun Runtime** - Fast builds with Bun package manager  
✅ **Production Build** - Optimized bundle with tree shaking  

### Build Configuration

```json
{
  "buildCommand": "BUILD_TARGET=production bun x vite build",
  "outputDirectory": "dist",
  "installCommand": "bun install",
  "framework": null
}
```

### Troubleshooting

#### Index Page Not Showing

1. **Check Vercel Logs**
   - Go to Vercel dashboard → Project → Functions tab
   - Check for build errors

2. **Verify Build Output**
   ```bash
   bun run vercel:build
   # Check that dist/index.html exists
   ```

3. **Test Locally**
   ```bash
   bun run preview
   # Should serve the built app correctly
   ```

#### Common Issues

- **404 on Refresh**: Fixed by SPA rewrites in `vercel.json`
- **Build Failures**: Check Bun compatibility or fallback to npm
- **Large Bundle**: Consider code splitting for chunks > 1MB

### Manual Deploy Steps

1. **Build the project**
   ```bash
   bun run vercel:build
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Verify deployment**
   - Check that routes work correctly
   - Test client-side navigation
   - Verify assets load properly

### Environment Variables

Set these in Vercel dashboard:

| Variable | Value | Purpose |
|----------|-------|---------|
| `BUILD_TARGET` | `production` | Optimize build for production |
| `NODE_ENV` | `production` | Standard production flag |

### Performance Optimizations

- Static assets cached for 1 year
- Gzip/Brotli compression enabled
- Code splitting with manual chunks
- Tree shaking for smaller bundles

For more details, see the [Vercel Documentation](https://vercel.com/docs).
