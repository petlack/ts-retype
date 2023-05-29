import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath } from 'url';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRootDir = path.resolve(__dirname);

const externals = [
  'react',
  'react-dom',
  'ramda',
  '@emtion/react',
  'react/jsx-runtime',
  'theme-ui',
  '@theme-ui/components',
  '@theme-ui/color',
  'polished',
  'minisearch',
  'chroma-js',
  'react-icons/fa',
  'react-icons/md',
  'react-focus-lock',
  '@floating-ui/react',
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
  typescript({ tsconfig: './tsconfig.json' }),
];

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
    external: externals,
    plugins: [
      // external(),
      // resolve(),
      ...plugins,
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
        file: 'dist/hooks.js',
        format: 'esm',
        sourcemap: true,
        name: '@ts-retype/uikit/hooks',
      },
    ],
    external: externals,
    plugins: [
      // external(),
      // resolve(),
      ...plugins,
      visualizer({
        emitFile: true,
        filename: 'stats-hooks.html',
      }),
    ],
  },

  {
    input: 'src/components/index.ts',
    output: [
      {
        file: 'dist/components.js',
        format: 'esm',
        sourcemap: true,
        name: '@ts-retype/uikit/components',
      },
    ],
    external: externals,
    plugins: [
      // external(),
      // resolve(),
      ...plugins,
      postcss({
        extract: true,
        modules: false,
        sourceMap: true,
        use: ['sass'],
      }),
      visualizer({
        emitFile: true,
        filename: 'stats-components.html',
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
    plugins: [...plugins, dts()],
  },

  {
    input: 'src/hooks/index.ts',
    output: {
      file: 'dist/hooks.d.ts',
      format: 'es',
    },
    plugins: [...plugins, dts()],
  },

  {
    input: 'src/components/index.ts',
    output: {
      file: 'dist/components.d.ts',
      format: 'es',
    },
    external: [/\.css|\.styl|\.scss$/],
    plugins: [...plugins, dts()],
  },

  {
    input: 'src/theme/generate.ts',
    output: [{ file: 'dist/generate.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];
