import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { shebang } from './config/shebang.mjs';

const config = [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [esbuild()]
  },
  {
    input: 'src/ts-retype.ts',
    output: {
      file: 'dist/ts-retype.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [esbuild(), shebang()]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  },
];

export default config;