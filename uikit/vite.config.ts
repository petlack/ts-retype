import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    react(),
    tsconfigPaths(),
    visualizer({
      emitFile: true,
      filename: 'stats.html',
    }),
  ],
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
});
