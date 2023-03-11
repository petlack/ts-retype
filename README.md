[![tests](https://github.com/petlack/ts-retype/actions/workflows/run-tests.yml/badge.svg)](https://github.com/petlack/ts-retype/actions/workflows/run-tests.yml)
[![CodeQL](https://github.com/petlack/ts-retype/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/petlack/ts-retype/actions/workflows/github-code-scanning/codeql)
[![npm version](https://img.shields.io/npm/v/ts-retype.svg)](https://www.npmjs.com/package/ts-retype)
![coverage](https://raw.githubusercontent.com/petlack/ts-retype/gh-pages/badge-coverage.svg)

# TS retype

Discover duplicate TypeScript types in your codebase. TS retype finds duplicates of Literal and
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

const groups = createTypeClusters({
  project: '/path/to/dir',
  include: ['**/*.ts'],
  exclude: ['**/node_modules/**', '**/dist/**'],
});

console.log(groups);
```

See [Data Format](#data-format) for result format.

## Configuration

### CLI options

```console
Usage: ts-retype [options] <path-to-project>

Arguments:
  path-to-project                    path to project

Options:
  -V, --version                      output the version number
  -c, --config [path]                load config - if no path provided, loads .retyperc from current directory. if not set,
                                     use default config
  -o, --output <file-path|dir-path>  HTML report file name - if provided with directory, it will create index.html file
                                     inside (default: "./retype-report.html")
  -j, --json <file-path>             JSON report file name. if not set, does not export JSON.
  -i, --include [glob...]            glob patterns that will be included in search
  -x, --exclude [glob...]            glob patterns that will be ignored
  -h, --help                         display help for command
```

### .retyperc

```json
{
  "include": ["**/*.ts"],
  "exclude": ["**/node_modules/**", "**/dist/**"],
  "output": "./retype-report.html"
}
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

## Development

```bash
npm run dev
```
