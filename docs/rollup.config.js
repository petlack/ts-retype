import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
// import styles from 'rollup-plugin-styles';
// import dts from 'rollup-plugin-dts';

// import packageJson from './package.json';

const packageJson = {
  main: 'dist/App.cjs',
  module: 'dist/App.es.js',
};

export default [
  {
    input: 'src/App.tsx',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        name: '@ts-retype/docs',
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    // assetFileNames: '[name]-[hash][extname]',
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({
        extract: true,
        modules: false,
        sourceMap: true,
        use: ['sass', 'stylus'],
      }),
    ],
  },
  // {
  //   input: 'dist/types/index.d.ts',
  //   output: [{ file: 'dist/index.d.ts', format: 'esm' }],
  //   external: [/\.css|\.styl|\.scss$/],
  //   plugins: [dts()],
  // },
];
