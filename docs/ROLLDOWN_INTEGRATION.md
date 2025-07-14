# Rolldown Integration Guide

This project has been enhanced to support Rolldown, a Rust-based bundler that's designed to be a faster alternative to Rollup. Rolldown is being developed by the Vite team and aims to provide significant performance improvements.

## What is Rolldown?

Rolldown is a JavaScript bundler written in Rust, designed to be the future bundler for Vite. It's based on Oxc (JavaScript Oxidation Compiler) and provides:

- **Faster builds** due to Rust's performance
- **Better tree-shaking** with advanced static analysis
- **Improved compatibility** with existing Rollup plugins
- **Enhanced developer experience** with better error messages

## Current Setup

### Scripts Available

- `bun dev` - Standard Vite development server
- `bun dev:rolldown` - Vite development with Rolldown-optimized configuration
- `bun build` - Standard Vite build
- `bun build:rolldown` - Vite build with Rolldown-optimized configuration
- `bun build:pure-rolldown` - Direct Rolldown build (experimental)

### Configuration Files

1. **`vite.config.ts`** - Standard Vite configuration with Rolldown optimizations
2. **`vite.config.rolldown.ts`** - Rolldown-optimized Vite configuration
3. **`rolldown.config.js`** - Direct Rolldown configuration (experimental)
4. **`rolldown.plugins.ts`** - Custom Rolldown plugins

## Features

### Performance Optimizations

- **Faster development builds** with improved bundling speed
- **Better tree-shaking** for smaller production bundles
- **Improved chunk splitting** for better caching
- **Enhanced sourcemap generation** for better debugging

### Compatibility

- **Full React support** with JSX/TSX transformation
- **CSS processing** with PostCSS and Tailwind
- **Asset handling** for images and other static files
- **TypeScript support** with proper type checking

## Migration Benefits

1. **Faster Build Times**: Rolldown can provide 2-5x faster builds compared to Rollup
2. **Better Tree Shaking**: More aggressive dead code elimination
3. **Smaller Bundles**: Better optimization leads to smaller output files
4. **Future-Proof**: Rolldown is planned to be the default bundler for Vite

## Usage

### Development

```bash
# Standard development (uses optimized Vite with Rolldown enhancements)
bun dev

# Rolldown-optimized development
bun dev:rolldown
```

### Production Builds

```bash
# Standard production build (with Rolldown optimizations)
bun build

# Rolldown-optimized production build
bun build:rolldown

# Direct Rolldown build (experimental)
bun build:pure-rolldown
```

## Current Status

- ✅ **Rolldown dependency** installed and configured
- ✅ **Vite integration** with Rolldown optimizations
- ✅ **Custom plugins** for React, CSS, and asset handling
- ✅ **Development scripts** for different build modes
- ⚠️ **Experimental features** - Direct Rolldown builds are experimental

## Notes

- The project maintains backward compatibility with standard Vite builds
- Rolldown is still in beta, so some features may not be fully stable
- The `build:pure-rolldown` script is experimental and may not work with all features
- For production use, stick with `build:rolldown` which uses Vite with Rolldown optimizations

## Future Updates

As Rolldown matures, we'll:
1. Migrate more features to direct Rolldown builds
2. Add more Rolldown-specific optimizations
3. Update plugins to use native Rolldown APIs
4. Improve build performance further

## Troubleshooting

If you encounter issues:
1. Use `bun build` for the most stable build
2. Use `bun build:rolldown` for Rolldown optimizations with Vite stability
3. Check the Rolldown documentation for latest updates
4. Report issues to the Rolldown team if using experimental features
