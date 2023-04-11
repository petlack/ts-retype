import { promisify } from 'util';
import { exec } from 'child_process';
import { Command } from 'commander';

async function executeFunction(fn: () => void | Promise<void>): Promise<void> {
  if (fn instanceof Function) {
    const result = fn();
    if (result instanceof Promise) {
      await result;
    }
  }
}

export function run(fn: () => Promise<void> | void) {
  executeFunction(fn)
    .then(() => {
      process.exit(0);
    })
    .catch((err: unknown) => {
      console.log(err);
      process.exit(1);
    });
}

const promisifiedExec = promisify(exec);

export async function executeCommand(command: string): Promise<string> {
  try {
    const { stdout, stderr } = await promisifiedExec(command);
    const output = `${stdout}${stderr}`;
    return output;
  } catch (error) {
    console.error(`Error executing command "${command}": ${error.message}`);
    throw error;
  }
}

export type BaseCmdProps = {
  verbose: boolean;
};

function parseCmdProps<T extends BaseCmdProps>(program: Command): Partial<T> {
  program.parse();
  const options = program.opts();
  return options as Partial<T>;
}

export async function execute<T extends BaseCmdProps>(
  program: Command,
  fn: (config: Partial<T>) => void | Promise<void>,
) {
  async function runner() {
    const config = parseCmdProps<T>(program);
    if (config.verbose) {
      console.log(config);
    }

    try {
      await fn(config);
    } catch (e: unknown) {
      if (typeof e === 'object' && 'message' in e) {
        console.log(e.message);
      } else {
        console.log(e);
      }
      throw e;
    }

    console.log('done');
  }
  run(runner);
}
