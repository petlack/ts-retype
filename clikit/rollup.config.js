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

function example(name) {
  return {
    input: `examples/${name}`,
    output: {
      file: `examples/dev/${name.split('.').at(0)}.js`,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    external,
    plugins,
  };
}

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
  example('console.tsx'),
  example('counter.tsx'),
  example('dynamic-list.tsx'),
  example('fetch.tsx'),
  example('header.tsx'),
  example('interactive.tsx'),
  example('layout.tsx'),
  example('logger-json.tsx'),
  example('logger-multiple.tsx'),
  example('logger-string.tsx'),
  example('oneoff-capture.tsx'),
  example('oneoff-side-effect.tsx'),
  example('playground.tsx'),
  example('simple-list.tsx'),
  example('stateful-app.tsx'),
  example('tree.tsx'),
];
