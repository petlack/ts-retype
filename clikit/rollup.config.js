import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { executable } from '../config/executable.mjs';
import { shebang } from '../config/shebang.mjs';

const external = [
  'react',
  'meow',
  'ink',
  'ramda',
  'fs',
  'ink-big-text',
  'colors',
  'path',
  'minisearch',
  'child_process',
];

const plugins = [
  esbuild({
    include: /\.[jt]sx?$/,
    exclude: /node_modules/,
    sourceMap: true,
    minify: process.env.NODE_ENV === 'production',
    target: 'esnext',
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    treeShaking: true,
    tsconfig: 'tsconfig.json',
    loaders: {
      '.json': 'json',
    },
  }),
  executable(),
  shebang(),
];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    external,
    plugins,
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
  {
    input: 'src/cli.tsx',
    output: {
      file: 'dev/cli.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    external,
    plugins,
  },
  {
    input: 'src/hello.tsx',
    output: {
      file: 'dev/hello.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    external,
    plugins,
  },
];