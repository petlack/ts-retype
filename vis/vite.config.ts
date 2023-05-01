import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
// import dynamicImport from 'vite-plugin-dynamic-import';
// import json from '@rollup/plugin-json';
import { datajson } from './src/vite';

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
  plugins: [react(), viteSingleFile(), datajson()],
});
