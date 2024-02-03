import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { scan } from '../src/scan.js';
import { report } from '../src/report.js';
import { RetypeConfig } from '../src/config.js';

import * as url from 'url';
import { compress } from '../src/compress.js';

global.__dirname = url.fileURLToPath(new URL('.', import.meta.url));

function writeSrc(path: string, src: string) {
    fs.writeFileSync(path, src);
}

describe('report', () => {
    const dir = fs.mkdtempSync('ts-retype-report');
    beforeEach(() => {
        writeSrc(path.join(dir, 'foo.ts'), 'export type A = { foo: string; }');
        writeSrc(path.join(dir, 'bar.ts'), 'export type b = { foo: string; }');
    });
    afterEach(() => {
        if (fs.existsSync(dir) && dir.includes('ts-retype-report')) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
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
            const [, json] = match;
            expect(JSON.parse(json)).toEqual(compress(expected.data));
        }
    });
});
