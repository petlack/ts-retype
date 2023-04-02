import * as fs from 'fs';
import { resolveConfig, resolveOptions } from '../src/cmd';

function createConfigRc(file: string, config: object) {
  fs.writeFileSync(file, JSON.stringify(config, null, 2));
}

function rmConfigRc(file: string) {
  fs.unlinkSync(file);
}

type Options = {
  foo: number;
  bar: number;
  xyz: number;
};

describe('resolveConfig', () => {
  afterEach(() => {
    try {
      rmConfigRc('./.configrc');
    } catch {
      /* empty */
    }
  });

  it('returns defaults given null', () => {
    const given = resolveConfig(null, { foo: 1 });
    const expected = { foo: 1 };
    expect(given).toEqual(expected);
  });
  it('merges with defaults given config file', () => {
    createConfigRc('./.configrc', { foo: 2, bar: 1 });
    const given = resolveConfig('./.configrc', { foo: 1, abc: 3 });
    const expected = { foo: 2, bar: 1, abc: 3 };
    expect(given).toEqual(expected);
  });
});

describe('resolveOptions', () => {
  afterEach(() => {
    rmConfigRc('./.configrc');
  });

  it('sets default value if missing from options & config', () => {
    createConfigRc('./.configrc', { foo: 2, bar: 1 });
    const given = resolveOptions<Options>({ foo: 1 }, { foo: 2, bar: 2, xyz: 4 }, './.configrc');
    const expected = { foo: 1, bar: 2, xyz: 4 };
    expect(given).toEqual(expected);
  });
});
