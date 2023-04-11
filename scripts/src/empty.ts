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

async function demo(config: Partial<CmdProps>) {
  console.log(config);
}

async function main() {
  const config = parseCmdProps();
  if (config.verbose) {
    console.log(config);
  }

  try {
    await demo(config);
  } catch (e: any) {
    console.log(e.message);
    program.outputHelp();
    process.exit(1);
  }

  console.log('done');
}

if (isMain(import.meta)) {
  run(main);
}
