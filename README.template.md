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
@import apps/doc/src/generated/input/tsRetype.ts
```

See [Data Format](#data-format) for result format.

## Configuration

### CLI options

```console
@import apps/doc/src/generated/input/cmdHelp.txt
```

### .retyperc

```json
@import apps/doc/src/generated/input/retyperc.json
```

## Data Format

Defined in [TypeDuplicate](src/types.ts)

```typescript
@import apps/doc/src/generated/input/TypeDuplicate.ts
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
