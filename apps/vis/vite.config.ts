import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    optimizeDeps: {
        include: ['react/jsx-runtime'],
    },
    plugins: [
        react(),
        tsconfigPaths(),
        viteSingleFile(),
        visualizer({
            emitFile: true,
            filename: 'stats.html',
        }),
    ],
});
