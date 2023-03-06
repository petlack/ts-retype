# TypeScript Retype

Discover duplicate TypeScript types in your codebase. TypeScript retype finds duplicates of Literal and
Interface types.

## Install

```bash
npm install -g ts-retype
```

or

```bash
yarn global add ts-retype
```

## Usage with CLI

```bash
ts-retype /path/to/project
```

or

```bash
npx ts-retype /path/to/project
```

## Usage with Library

```typescript
import { createTypeClusters } from 'ts-retype';

const groups = findDuplicates({
  dir: '/path/to/dir',
  glob = '**/*.ts',
  ignore = ['**/node_modules/**', '**/dist/**'],
});

console.log(groups);
```

## Data Format

Defined in [SimilarityGroup](src/types.ts)

```typescript
[
  {
    name: Identical | HasIdenticalProperties,
    clusters: [
      {
        name: string,
        files: [
          {
            file: string,
            pos: [number, number],
          },
        ],
        names: Map<string, number>,
        properties: [
          {
            key: string,
            value: string,
            type: string,
          },
        ],
      },
    ],
  },
];
```

## Configuration

Following options are available

- `--ignore=**/node_modules/**`
- `--glob=**/*.ts`
- `--out=/path/to/dir`

## Development

```bash
npm run dev
```
