import {
    execute as baseExecute,
    monitor,
} from '@ts-retype/utils/std.js';
import { Command } from 'commander';
import { mergeDeepLeft } from 'ramda';

export type CmdOptions = {
    interactive?: boolean;
    noconfirm?: boolean;
    verbose?: boolean;
    args: string[];
};

export async function execute<T extends CmdOptions>(
    program: Command,
    fn: (config: T) => void | Promise<void>,
    options?: {
        name?: string;
        noConfirm?: boolean;
        interactive?: boolean;
        verbose?: boolean;
    },
) {
    const opts = mergeDeepLeft({
        name: program.name(),
        noConfirm: false,
        interactive: false,
        verbose: true,
    }, options ?? {});
    await baseExecute(monitor(
        async function cmd() {
            if (opts.noConfirm) program.option('-y, --noconfirm', 'Skip all confirmations');
            if (opts.interactive) program.option('-i, --interactive', 'Ask for script arguments');
            if (opts.verbose) program.option('-x, --verbose', 'Output more information');
            const config = parseCmdProps<T>(program);
            await fn(config);
        }, opts.name));
}

function parseCmdProps<T extends CmdOptions>(program: Command): T {
    program.parse();
    const options = program.opts();
    const args = program.args;
    return { ...options, args } as T;
}
