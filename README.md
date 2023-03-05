# TypeScript Retype

Discover duplicate TypeScript types in your codebase. TypeScript retype finds duplicates of Literal and Interface types.

## Usage

```bash
npm add -D ts-retype
npx ts-retype /path/to/project
```

```typescript
import { findDuplicates, SimilarityGroup } from 'ts-retype';

const groups: SimilarityGroup[] = findDuplicates({
  dir: '/path/to/dir',
  glob = '**/*.ts',
  ignore = ['**/node_modules/**', '**/dist/**'],
});

console.log(groups);
```

## Configuration

## Development

```bash
npm run dev
```
