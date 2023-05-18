import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'esm',
        sourcemap: true,
        name: '@ts-retype/uikit',
      },
    ],
    plugins: [
      external(),
      resolve(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({
        extract: true,
        modules: false,
        sourceMap: true,
        use: ['sass'],
      }),
      visualizer({
        emitFile: true,
        filename: 'stats-index.html',
      }),
    ],
  },

  {
    input: 'src/hooks/index.ts',
    output: [
      {
        file: 'dist/hooks/index.js',
        format: 'esm',
        sourcemap: true,
        name: '@ts-retype/uikit/hooks',
      },
    ],
    plugins: [
      external(),
      resolve(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({
        extract: true,
        modules: false,
        sourceMap: true,
        use: ['sass'],
      }),
      visualizer({
        emitFile: true,
        filename: 'stats-hooks.html',
      }),
    ],
  },

  {
    input: 'src/theme/generate.ts',
    output: [
      {
        file: 'dist/generate.js',
        format: 'esm',
        sourcemap: true,
        name: '@ts-retype/uikit/generate',
      },
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      visualizer({
        emitFile: true,
        filename: 'stats-generate.html',
      }),
    ],
  },

  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: [/\.css|\.styl|\.scss$/],
    plugins: [dts()],
  },

  {
    input: 'src/hooks/index.ts',
    output: {
      file: 'dist/hooks/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },

  {
    input: 'src/theme/generate.ts',
    output: [{ file: 'dist/generate.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];
