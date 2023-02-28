import { createFilter } from '@rollup/pluginutils';
import { chmod } from 'fs/promises';
import MagicString from 'magic-string';

export function shebang({
  include = ['**/**'],
  exclude = []
} = {}) {
  const filter = createFilter(include, exclude);
  const scripts = new Set()
  const mode = 0o755;
  const prefix = '#!/usr/bin/env node'
  const separator = '\n\n';
  return {
    name: 'shebang-node',

    renderChunk(code, { isEntry, facadeModuleId, fileName }, { file, dir, sourcemap }) {
      if (!isEntry || !facadeModuleId || !filter(facadeModuleId)) {
        return;
      }

      scripts.add(file || join(dir || process.cwd(), fileName))

      const header = `${prefix}${separator}`;

      if (!sourcemap) {
        return `${header}${code}`;
      }

      const magicString = new MagicString(code);
      magicString.prepend(header);

      return {
        code: magicString.toString(),
        map: magicString.generateMap({ includeContent: true, hires: true })
      };
    },

    async writeBundle() {
      await Promise.all([...scripts].map(file => chmod(file, mode)));
    },

  };
}