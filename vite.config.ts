import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/nostr-nips/',
  plugins: [react()],
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
