import fs from 'fs';
import path from 'path';
import { Command, createCommand } from 'commander';
import { Bar, foo } from '@ts-retype/search';

const program = createCommand();

const { version, name, description } = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package.json')).toString(),
);

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

buildProgram(
    program
        .name(name)
        .description(description)
        .version(version)
);

function main() {
    console.log('maii');
    foo();
    const cmdProps = parseCmdProps();
    console.log('cmdProps', cmdProps);
    const bar: Bar = {
        bar: 'bar',
    };
    foo();
    console.log('byyyy', bar);
}

if (require.main === module) {
    main();
}
