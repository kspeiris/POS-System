import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  root: rootDir,
  plugins: [react()],
  build: {
    outDir: resolve(rootDir, 'dist'),
    emptyOutDir: true,
  },
});
