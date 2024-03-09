import { scan } from '@ts-retype/retype';

const { data, meta } = scan({
  exclude: ['**/node_modules/**', '**/dist/**'],
  include: ['**/*.{ts,tsx}'],
  rootDir: '.',
});

console.log(meta);

for (const dup of data) {
  console.log(dup.group, dup.names, dup.files);
}