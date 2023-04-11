import { createCommand } from 'commander';
import { run } from './cmd.js';
import { isMain } from './isMain.js';

type CmdProps = { verbose: boolean };

const program = createCommand();

program.name('demo').description('demo program');

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
}

if (isMain(import.meta)) {
  run(main);
}
