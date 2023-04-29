import { createCommand } from 'commander';
import { BaseCmdProps, execute } from './cmd.js';
import { syntaxHighlighting } from './syntaxHighlighting.js';
import { extractSnippets } from './extractSnippets.js';
import { isMain } from './isMain.js';

type CmdProps = BaseCmdProps;

const program = createCommand();

program.name('generateDocs').version('1.0.0').description('generate docs');

async function generateDocs(config: Partial<CmdProps>) {
  await extractSnippets();
  await syntaxHighlighting({
    output: '../docs/src/generated',
    dir: '../docs/src/snippets',
  });
}

if (isMain(import.meta)) {
  execute(program, generateDocs);
}
