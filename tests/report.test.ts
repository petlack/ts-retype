import fs from 'fs';
import path from 'path';
import { rimrafSync } from 'rimraf';
import { scan } from '../src';
import { RetypeConfig } from '../src/config';
import { report } from '../src/report';

import * as url from 'url';
global.__dirname = url.fileURLToPath(new URL('.', import.meta.url));

function writeSrc(path: string, src: string) {
  fs.writeFileSync(path, src);
}

describe('clusters', () => {
  const dir = fs.mkdtempSync('ts-retype-report');
  beforeEach(() => {
    writeSrc(path.join(dir, 'foo.ts'), 'export type A = { foo: string; }');
    writeSrc(path.join(dir, 'bar.ts'), 'export type b = { foo: string; }');
  });
  afterEach(() => {
    rimrafSync(dir);
  });
  it('generates HTML report', () => {
    const config = RetypeConfig.fromCmdProps({
      rootDir: dir,
      output: dir,
      json: path.join(dir, 'report.json'),
    });
    const expected = scan(config);
    report(config);
    const html = fs.readFileSync(path.join(dir, 'index.html')).toString();
    const match = html.match(/window\.__data__\s+=\s+(\[.+?\]);/s);
    expect(match).not.toBeNull();
    if (match) {
      expect(JSON.parse(match[1])).toEqual(expected.data);
    }
  });
});
