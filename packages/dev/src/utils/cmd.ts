import {
    execute as baseExecute,
    monitor,
} from '@ts-retype/utils';
import { Command } from 'commander';

export type BaseCmdProps = {
  verbose: boolean;
  args: string[];
};

export async function execute<T extends BaseCmdProps>(
    program: Command,
    fn: (config: Partial<T>) => void | Promise<void>,
) {
    const name = program.name();
    await baseExecute(monitor(
        async function cmd() {
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
