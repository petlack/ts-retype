import { createCommand } from 'commander';
import { execute } from './cmd.js';
import { isMain } from './isMain.js';

type CmdProps = { verbose: boolean };

const program = createCommand();

program.name('demo').description('demo program');

async function demo(config: Partial<CmdProps>) {
  console.log(config);
}

if (isMain(import.meta)) {
  execute(program, demo);
}
