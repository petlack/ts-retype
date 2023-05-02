import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { shebang } from '../config/shebang.mjs';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const config = [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    external: [
      'commander',
      'date-fns',
      'glob',
      'progress',
      'ramda',
      'refractor',
      'typescript',
    ],
    plugins: [
      typescript(),
      commonjs(),
      nodeResolve({
        preferBuiltins: true,
      }),
    ],
  },
  {
    input: 'src/snippet.ts',
    output: {
      file: 'dist/snippet.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      typescript(),
      commonjs(),
    ],
  },
  {
    input: 'src/types/index.ts',
    output: {
      file: 'dist/types.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    external: [],
    plugins: [
      typescript(),
      commonjs(),
      nodeResolve({
        preferBuiltins: true,
      }),
    ],
  },
  {
    input: 'src/ts-retype.ts',
    output: {
      file: 'dist/ts-retype.cjs',
      format: 'cjs',
      exports: 'named',
      // banner: '#!/usr/bin/env node',
      sourcemap: true,
    },
    external: ['fs', 'path', 'readline', 'typescript'],
    plugins: [
      nodeResolve({
        preferBuiltins: true,
      }),
      commonjs(),
      typescript(),
      esbuild(),
      terser(),
      shebang(),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  },
  {
    input: 'src/snippet.ts',
    output: {
      file: 'dist/snippet.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  },
  {
    input: 'src/types/index.ts',
    output: {
      file: 'dist/types.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  },
];

export default config;