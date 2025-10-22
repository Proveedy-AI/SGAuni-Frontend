import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    global: {}, 
  },
   optimizeDeps: {
    include: ['@dnd-kit/core', '@aws-sdk/client-s3'],
  },
});
