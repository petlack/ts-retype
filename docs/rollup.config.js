import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';

// import packageJson from './package.json';

const packageJson = {
  main: 'dist/index.cjs',
  module: 'dist/index.es.js',
};

const externals = [
  'react',
  'ramda',
  '@emtion/react',
  'react/jsx-runtime',
  'theme-ui',
  '@theme-ui/components',
  '@theme-ui/color',
  'polished',
  'minisearch',
  'chroma-js',
];

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        name: '@ts-retype/docs',
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: externals,
    // assetFileNames: '[name]-[hash][extname]',
    plugins: [
      // external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({
        extract: true,
        modules: false,
        sourceMap: true,
        use: ['sass', 'stylus'],
      }),
      visualizer({
        emitFile: true,
        filename: 'stats.html',
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: [/\.css|\.styl|\.scss$/],
    plugins: [dts()],
  },
];
