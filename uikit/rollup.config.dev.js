import path from 'path';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import resolve from 'rollup-plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import alias from '@rollup/plugin-alias';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRootDir = path.resolve(__dirname);

const external = [
  'react',
  'ramda',
  '@emtion/react',
  'react/jsx-runtime',
  'theme-ui',
  '@theme-ui/components',
  '@theme-ui/color',
  'polished',
  'minisearch',
];

const plugins = [
  alias({
    customResolver: resolve({ extensions: ['.tsx', '.ts', '.js'] }),
    entries: Object.entries({
      '~/*': ['./src/*'],
    }).map(([alias, value]) => ({
      find: new RegExp(`${alias.replace('/*', '')}`),
      replacement: path.resolve(projectRootDir, `${value[0].replace('/*', '')}`),
    })),
  }),
  esbuild({
    include: /\.[jt]sx?$/,
    exclude: /node_modules/,
    sourceMap: true,
    minify: process.env.NODE_ENV === 'production',
    target: 'esnext',
    jsx: 'automatic',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    treeShaking: true,
    tsconfig: 'tsconfig.json',
    loaders: {
      '.json': 'json',
    },
  }),
  postcss({
    extract: true,
    modules: false,
    sourceMap: true,
    use: ['sass'],
  }),
  // dts(),
];

function module(name) {
  return {
    input: `src/${name}`,
    output: {
      file: `dist/${name.split('.').slice(0, -1).join('.')}.js`,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    external,
    plugins,
  };
}

export default [
  module('index.ts'),
  module('hooks/index.ts'),
  module('components/index.ts'),
  module('theme/generate.ts'),
];
