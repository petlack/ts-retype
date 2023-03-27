import { findDuplicateTypes } from 'ts-retype';

const duplicates = await findDuplicateTypes({
  exclude: ['**/node_modules/**', '**/dist/**'],
  include: ['**/*.{ts,tsx}'],
  project: '/path/to/project',
});

for (const dup of duplicates) {
  console.log(dup.group, dup.names, dup.files);
}
