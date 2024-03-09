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
import { scan } from '@ts-retype/search';

const { data, meta } = scan({
    exclude: ['**/node_modules/**', '**/dist/**'],
    include: ['**/*.{ts,tsx}'],
    rootDir: '.',
});

console.log(meta);

for (const dup of data) {
    console.log(dup.group, dup.names, dup.files);
}
```

See [Data Format](#data-format) for result format.

## Configuration

### CLI options

```console
Usage: @ts-retype/bin [options] [rootDir]

Options:
  -V, --version                      output the version number
  -c, --config [file-path]           load config - if no path provided, loads
                                     .retyperc from current directory. if not
                                     set, use default config
  -e, --exclude [glob...]            glob patterns that will be ignored
  -g, --init [file-path]             initializes with default config. if no
                                     path is provided, creates .retyperc in the
                                     current directory
  -i, --include [glob...]            glob patterns that will be included in
                                     search
  -j, --json <file-path>             file path to export JSON report to. if not
                                     set, does not export JSON.
  -n, --noHtml                       if set, does not export HTML
  -o, --output <file-path|dir-path>  HTML report file path - if provided with
                                     dir, create index.html file inside the dir
  -h, --help                         display help for command

```

### .retyperc

```json
{
  "exclude": ["**/node_modules/**","**/dist/**"],
  "include": ["**/*.{ts,tsx}"],
  "json": "./apps/vis/src/assets/data.json",
  "noHtml": false,
  "output": "./retype-report.html",
  "rootDir": "."
}
```

## Data Format

Defined in [TypeDuplicate](src/types.ts)

```typescript
export type TypeDuplicate = {
  files: {
    name: string;
    file: string;
    lines: [number, number];
    pos: [number, number];
    offset: number;
    type: 'interface' | 'literal' | 'alias' | 'function' | 'enum' | 'union';
    src: string;
    srcHgl?: TokenRoot;
    properties?: { name: string; type: string }[];
  }[];
  group: 'different' | 'renamed' | 'identical';
  names: { count: number; name: string }[];
  members?: string[];
  parameters?: { name: string; type: string }[];
  properties?: { name: string; type: string }[];
  returnType?: string;
  signature?: {
    name?: string;
    params: { name: string; type?: string }[];
    return?: string;
    strMin?: string;
    strFull?: string;
  };
  types?: string[];
};
```

## Development

```bash
just clean
just install
just build-all
just test-all
just dev vis
just dev doc
just build-watch uikit
just rebuild uikit
just build uikit
just test search
```
