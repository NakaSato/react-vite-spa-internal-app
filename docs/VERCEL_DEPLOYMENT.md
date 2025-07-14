# Vercel Deployment with Rolldown

This guide covers deploying your Rolldown-optimized React SPA to Vercel.

## 🚀 Quick Deploy

### 1. Install Vercel CLI

```bash
bun add -g vercel
```

### 2. Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## ⚙️ Configuration

### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "buildCommand": "bun build:rolldown",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "bun install",
  "devCommand": "bun dev:rolldown"
}
```

### Build Scripts

```bash
# Development with Rolldown optimizations
bun dev:rolldown

# Vercel-optimized development
bun dev:vercel

# Production build with Rolldown
bun build:rolldown

# Vercel-optimized build
bun build:vercel

# Vercel-specific commands
bun vercel:build
bun vercel:dev
```

## 🔧 Environment Variables

Set these in your Vercel project settings:

```env
BUILD_TARGET=vercel
NODE_ENV=production
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_ENABLE_ROLLDOWN=true
```

## 📦 Build Optimizations

### Rolldown Optimizations for Vercel

1. **Chunk Splitting**: Optimized for Vercel's CDN caching
2. **Tree Shaking**: Aggressive dead code elimination
3. **Minification**: Reduced bundle size
4. **Source Maps**: Disabled for production to reduce size

### Bundle Analysis

```bash
# Analyze bundle size
bun build:vercel --analyze

# Check bundle performance
bun build:rolldown && bun serve
```

## 🌐 Deployment Strategies

### 1. Automatic Deployment

Connect your GitHub repository to Vercel for automatic deployments:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Build Command**: `bun build:rolldown`
   - **Output Directory**: `dist`
   - **Install Command**: `bun install`

### 2. Manual Deployment

```bash
# Build and deploy
bun build:rolldown
vercel --prod

# Or use the Vercel-optimized build
bun build:vercel
vercel --prod
```

### 3. Preview Deployments

```bash
# Deploy to preview URL
vercel

# Deploy specific branch
vercel --prod --confirm
```

## 🛠️ Vercel-Specific Features

### Edge Functions

If you need serverless functions, create them in the `api/` directory:

```javascript
// api/hello.js
export default function handler(request, response) {
  response.status(200).json({ message: 'Hello from Vercel!' });
}
```

### Environment Variables

Set in Vercel Dashboard > Project Settings > Environment Variables:

- `VITE_API_BASE_URL`
- `VITE_ENABLE_ROLLDOWN`
- `NODE_ENV` (automatically set to `production`)

### Custom Headers

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 📊 Performance Monitoring

### Vercel Analytics

Add to your Vercel project:

```bash
bun add @vercel/analytics
```

Then in your `main.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### Bundle Analysis

```bash
# Check build output
bun build:vercel --report

# Analyze with bundlephobia
npx bundlephobia
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Timeout**: Increase build timeout in Vercel settings
2. **Bundle Size**: Use code splitting and dynamic imports
3. **Memory Issues**: Optimize dependencies and chunk sizes

### Debug Build

```bash
# Enable verbose logging
DEBUG=* bun build:vercel

# Check Vercel logs
vercel logs
```

### Performance Tips

1. **Use Rolldown chunking**: Better tree-shaking and smaller bundles
2. **Enable compression**: Vercel automatically compresses files
3. **Optimize images**: Use Vercel's image optimization
4. **CDN caching**: Leverage Vercel's global CDN

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] Build script optimized for Vercel
- [ ] Bundle size under limits
- [ ] Source maps disabled for production
- [ ] Security headers configured
- [ ] Analytics integrated
- [ ] Performance monitoring enabled
- [ ] Error tracking configured

## 📈 Monitoring

### Vercel Dashboard

Monitor your deployment:

- Build logs
- Performance metrics
- Error tracking
- Analytics data

### Custom Monitoring

```typescript
// Add to your app
if (import.meta.env.PROD) {
  // Track performance
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Load time:', perfData.loadEventEnd - perfData.loadEventStart);
  });
}
```

Your Rolldown-optimized React SPA is now ready for production deployment on Vercel! 🎉
