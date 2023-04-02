import { scan } from 'ts-retype';

const duplicates = await scan({
  exclude: ['**/node_modules/**', '**/dist/**'],
  include: ['**/*.{ts,tsx}'],
  rootDir: '/path/to/project',
});

for (const dup of duplicates) {
  console.log(dup.group, dup.names, dup.files);
}
