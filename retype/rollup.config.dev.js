import esbuild from 'rollup-plugin-esbuild';
import { executable } from '../config/executable.mjs';
import { shebang } from '../config/shebang.mjs';

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
    input: 'src/hello.ts',
    output: {
      file: 'dev/hello.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    plugins,
  },
];
