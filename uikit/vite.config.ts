import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
});
