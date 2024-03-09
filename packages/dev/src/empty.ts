import { createCommand } from 'commander';
import { execute } from './utils/cmd.js';
import { isMain } from './utils/is-main.js';

type CmdProps = { verbose: boolean };

const program = createCommand();

program.name('demo').description('demo program');

async function demo(config: Partial<CmdProps>) {
    // eslint-disable-next-line no-console
    console.log(config);
}

if (isMain()) {
    execute(program, demo);
}
