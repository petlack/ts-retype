import { readFile, writeFile } from 'fs/promises';
import { join, parse, resolve } from 'path';
import { createCommand } from 'commander';
import { highlight } from '@ts-retype/search/highlight';
import { ensureDirectoryExists, listFiles } from '@ts-retype/utils';

type CmdProps = { dir?: string; list?: string; output?: string };

const program = createCommand();

program
    .name('syntaxHighlighting')
    .description('generate Snippet from TS file')
    .option('-d, --dir <path>', 'generate Snippet for each file in a directory')
    .option('-l, --list <path>', 'generate Snippet for each file in a list of files in given path')
    .option('-o, --output <path>', 'file to save generated Snippets');

async function loadSnippets(snippets: string[]) {
    return await Promise.all(
        snippets
            .map((fileName) => parse(resolve(fileName)))
            .map(({ dir, name, ext }) => ({ dir, name, ext: ext.slice(1) }))
            .map(async ({ dir, name, ext }) => ({
                name,
                lang: ext,
                code: highlight((await readFile(join(dir, `${name}.${ext}`))).toString(), ext),
            })),
    );
}

export async function syntaxHighlighting(config: Partial<CmdProps>) {
    if (!config.output) {
        console.log('Missing output');
        throw new Error('Missing output');
    }

    const files = config.dir ? await listFiles(config.dir) : [];

    const targetDir = config.output;
    await ensureDirectoryExists(targetDir);

    const snippets = await loadSnippets(files);
    const exports = snippets.map(
        (snippet) => `export const Snippet_${snippet.name} = ${JSON.stringify(snippet)} as Snippet;`,
    );
    const imports = [
        'import type { Snippet } from \'@ts-retype/search/types\';',
    ];
    await writeFile(
        join(targetDir, 'snippets.ts'),
        [
            ...imports,
            ...exports,
        ].join('\n\n'),
    );
}
