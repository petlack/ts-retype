import { chmodSync, statSync } from 'fs';

// import { Plugin } from 'rollup';

// type RequiredParts<T, Keys extends keyof T = keyof T> =
//   Pick<T, Exclude<keyof T, Keys>> & Required<Pick<T, Extract<keyof T, Keys>>>
// export type ExecutablePlugin = RequiredParts<Plugin, 'generateBundle' | 'writeBundle'>

// Set EXECUTABLE bit on file mode
const EXECUTABLE_MODE = 0o111;

export function executable() { //: ExecutablePlugin {
  let file;

  return {
    name: 'rollup-plugin-executable',

    generateBundle(options) {
      // Store main output file name here as `writeBundle` does not
      // have this data as it seems.
      file = options.file;
    },

    writeBundle() {
      if (!file) {
        return;
      }

      const { mode } = statSync(file);

      // eslint-disable-next-line no-bitwise
      const newMode = mode | EXECUTABLE_MODE;

      chmodSync(file, newMode);
    }
  };
}