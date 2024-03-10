import {
    execute as baseExecute,
    monitor,
} from '@ts-retype/utils/std.js';
import { Command } from 'commander';

export type BaseCmdProps = {
    interactive?: boolean;
    noconfirm?: boolean;
    verbose?: boolean;
    args: string[];
};

export async function execute<T extends BaseCmdProps>(
    program: Command,
    fn: (config: Partial<T>) => void | Promise<void>,
) {
    const name = program.name();
    await baseExecute(monitor(
        async function cmd() {
            program
                .option('-v, --verbose', 'Output more information')
                .option('-y, --noconfirm', 'Skip all confirmations')
                .option('-i, --interactive', 'Ask for script arguments');
            const config = parseCmdProps<T>(program);
            await fn(config);
        }, name));
}

function parseCmdProps<T extends BaseCmdProps>(program: Command): Partial<T> {
    program.parse();
    const options = program.opts();
    const args = program.args;
    return { ...options, args } as Partial<T>;
}
