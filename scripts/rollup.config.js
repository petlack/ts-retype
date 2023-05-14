import esbuild from 'rollup-plugin-esbuild';
import { executable } from '../config/executable.mjs';
import { shebang } from '../config/shebang.mjs';

const external = [];

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

function script(name) {
  return {
    input: `src/${name}`,
    output: {
      file: `dev/${name.split('.').at(0)}.js`,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    external,
    plugins,
  };
}

export default [script('remake.tsx'), script('generateTmuxDev.ts'), script('playground.ts')];
