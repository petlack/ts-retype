import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
// import { viteSingleFile } from 'vite-plugin-singlefile';
// import { visualizer } from 'rollup-plugin-visualizer';
// import dynamicImport from 'vite-plugin-dynamic-import';
// import json from '@rollup/plugin-json';

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    // build: {
    //   rollupOptions: {
    //     input: {
    //       index: 'index.html',
    //       data: 'src/data.json',
    //     },
    //   }
    // },
    optimizeDeps: {
        include: ['react/jsx-runtime'],
    },
    plugins: [
        react(),
        tsconfigPaths(),
        // viteSingleFile(),
        // visualizer({
        //     emitFile: true,
        //     filename: 'stats.html',
        // }),
    ],
});
