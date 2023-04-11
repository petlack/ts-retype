import { promisify } from 'util';
import { exec } from 'child_process';

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
