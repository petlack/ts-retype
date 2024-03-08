import { Command, createCommand } from 'commander';
import { Logger } from '@ts-retype/utils';
import fs from 'fs';
import path from 'path';

const program = createCommand();
const log = new Logger();

export type CmdProps = {
  json: string | null;
  noHtml: boolean;
  rootDir: string;
};

const CMD_OPTIONS = [
    {
        short: 'j',
        long: 'json',
        args: '<file-path>',
        desc: 'file path to export JSON report to. if not set, does not export JSON.',
    },
    { short: 'n', long: 'noHtml', desc: 'if set, does not export HTML' },
];

export function main() {
    const { version, name, description } = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../package.json')).toString(),
    );

    buildProgram(
        program
            .name(name)
            .description(description)
            .version(version)
    );
    const cmdProps = parseCmdProps();
    log.info('cmdProps', cmdProps);
    log.ok('Done');
    log.error('Error');
    program.help();
}

function buildProgram(command: Command) {
    for (const { short, long, args, desc } of CMD_OPTIONS) {
        command.option(`-${short}, --${long} ${args || ''}`, desc);
    }
}

function parseCmdProps(): Partial<CmdProps> {
    program.parse();
    const options = program.opts();
    const args = program.processedArgs;
    return {
        ...options,
        rootDir: args[0],
    };
}
