import { Plugin } from 'rolldown';

// Custom plugin for React support in Rolldown
export function rolldownReactPlugin(): Plugin {
  return {
    name: 'rolldown-react',
    resolveId(id) {
      // Handle React imports
      if (id === 'react' || id === 'react-dom') {
        return id;
      }
      return null;
    },
    load(id) {
      // Handle JSX/TSX files
      if (id.endsWith('.jsx') || id.endsWith('.tsx')) {
        // This would be handled by the JSX transformer
        return null;
      }
      return null;
    },
    transform(code, id) {
      // Transform JSX/TSX files
      if (id.endsWith('.jsx') || id.endsWith('.tsx')) {
        // JSX transformation would happen here
        // For now, we'll let Vite handle this
        return null;
      }
      return null;
    },
  };
}

// Plugin for handling CSS imports
export function rolldownCssPlugin(): Plugin {
  return {
    name: 'rolldown-css',
    resolveId(id) {
      if (id.endsWith('.css')) {
        return id;
      }
      return null;
    },
    load(id) {
      if (id.endsWith('.css')) {
        // CSS processing would happen here
        return null;
      }
      return null;
    },
  };
}

// Plugin for handling static assets
export function rolldownAssetsPlugin(): Plugin {
  return {
    name: 'rolldown-assets',
    resolveId(id) {
      // Handle image and other asset imports
      if (id.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/)) {
        return id;
      }
      return null;
    },
    load(id) {
      if (id.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/)) {
        // Asset processing would happen here
        return null;
      }
      return null;
    },
  };
}
