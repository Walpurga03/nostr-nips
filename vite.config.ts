import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import purgecss from '@fullhuman/postcss-purgecss';

export default defineConfig({
  base: '/nostr-nips/',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        purgecss({
          content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('lodash')) return 'lodash-vendor';
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600, // Erhöhtes Limit für Chunk-Warnungen
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
