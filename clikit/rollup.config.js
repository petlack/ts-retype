import esbuild from 'rollup-plugin-esbuild';
import { executable } from '../config/executable.mjs';
import { shebang } from '../config/shebang.mjs';

export default [
  {
    input: 'src/cli.tsx',
    output: {
      file: 'dist/cli.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    external: [
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
    ],
    plugins: [
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
    ],
  },
];
