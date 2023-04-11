import { createCommand } from 'commander';
import { run } from './cmd.js';
import { syntaxHighlighting } from './syntaxHighlighting.js';
import { extractSnippets } from './extractSnippets.js';
import { isMain } from './isMain.js';

type CmdProps = { verbose: boolean };

const program = createCommand();

program.name('generateDocs').version('1.0.0').description('generate docs');

function parseCmdProps(): Partial<CmdProps> {
  program.parse();
  const options = program.opts();
  return options;
}

async function main() {
  const config = parseCmdProps();
  if (config.verbose) {
    console.log(config);
  }
  extractSnippets({});
  syntaxHighlighting({
    output: '../docs/src/generated',
    dir: '../docs/src/snippets',
  });
}

if (isMain(import.meta)) {
  run(main);
}
