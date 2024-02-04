import { readFileSync, writeFileSync, existsSync, rmSync, mkdtempSync } from 'fs';
import * as url from 'url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { scan, report } from '@ts-retype/search';
import { RetypeConfig } from '@ts-retype/search';
import { compress } from '@ts-retype/search';
import path from 'path';

global.__dirname = url.fileURLToPath(new URL('.', import.meta.url));

function writeSrc(path: string, src: string) {
    writeFileSync(path, src);
}

describe('report', () => {
    const dir = mkdtempSync('ts-retype-report');
    beforeEach(() => {
        writeSrc(path.join(dir, 'foo.ts'), 'export type A = { foo: string; }');
        writeSrc(path.join(dir, 'bar.ts'), 'export type b = { foo: string; }');
    });
    afterEach(() => {
        if (existsSync(dir) && dir.includes('ts-retype-report')) {
            rmSync(dir, { recursive: true, force: true });
        }
    });
    it('generates HTML report', () => {
        const config = RetypeConfig.fromCmdProps({
            rootDir: dir,
            output: dir,
            json: path.join(dir, 'report.json'),
        });
        const expected = scan(config);
        const templateFile = path.join(__dirname, '../../../apps/vis/dist/index.html');
        const html = report(config, readFileSync(templateFile).toString());
        const match = html.match(/window\.__data__\s+=\s+(\[.+?\]);/s);
        expect(match).not.toBeNull();
        if (match) {
            const [, json] = match;
            expect(JSON.parse(json)).toEqual(compress(expected.data));
        }
    });
});
