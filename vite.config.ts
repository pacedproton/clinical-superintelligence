import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Multi-page static build: each page is a real HTML document, prerendered
// after the client build by scripts/prerender.mjs.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        caseStudy: resolve(__dirname, 'case-study/index.html'),
      },
    },
  },
});
