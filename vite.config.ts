
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Conditionally import componentTagger if available
let componentTagger = () => null;
try {
  componentTagger = require('lovable-tagger').componentTagger;
} catch (e) {
  // Module not found, using fallback
  console.warn('lovable-tagger not found, using fallback');
}

export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' && (typeof componentTagger === 'function' ? componentTagger() : null),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.svg'],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        manualChunks: {
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom', 
            'sonner',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-slider',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator',
            '@tanstack/react-query'
          ],
        },
      },
      external: ['lovable-tagger', 'react-type-animation', 'react-fast-marquee', 'pg', 'uuid'],
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  }
}));
