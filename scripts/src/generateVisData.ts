import { createCommand } from 'commander';
import { BaseCmdProps, execute } from './cmd.js';
import { isMain } from './isMain.js';

type CmdProps = BaseCmdProps;

const program = createCommand();

program.name('generateVisData').version('1.0.0').description('generate report json for vis');

async function generateVisData(config: Partial<CmdProps>) {
  console.log({ config });
}

if (isMain(import.meta)) {
  execute(program, generateVisData);
}
