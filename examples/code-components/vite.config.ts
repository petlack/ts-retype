import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    optimizeDeps: {
        include: ['react/jsx-runtime'],
    },
    plugins: [
        react(),
        visualizer({
            emitFile: true,
            filename: 'stats.html',
        }),
    ],
});
