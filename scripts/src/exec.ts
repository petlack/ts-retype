import { spawn as nodeSpawn, execSync } from 'child_process';

export type ExecOptions = {
  muteStdout?: boolean;
  muteStderr?: boolean;
  cwd?: string;
};

export type ExecResult = {
  stdout: string;
  stderr: string;
};

export const EmptyExecResult = () => Promise.resolve({ stderr: '', stdout: '' } as ExecResult);

export async function exec(
  command: string,
  args: string[] = [],
  options: ExecOptions = {},
): Promise<ExecResult> {
  try {
    const buffer = execSync([command, ...args].join(' '), { stdio: 'pipe', ...options }) || '';
    const stdout = buffer.toString();
    const stderr = '';

    return { stdout, stderr };
  } catch (e: any) {
    throw e.error?.toString();
  }
}

export async function spawn(
  command: string,
  args: string[] = [],
  options: ExecOptions = {},
): Promise<ExecResult> {
  const { muteStdout = false, muteStderr = false, cwd = process.cwd() } = options;

  const child = nodeSpawn(command, args, { cwd, shell: true, stdio: 'pipe' });

  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (data) => {
    if (!muteStdout) {
      process.stdout.write(data);
    }
    stdout += data.toString();
  });

  child.stderr.on('data', (data) => {
    if (!muteStderr) {
      process.stderr.write(data);
    }
    stderr += data.toString();
  });

  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Command '${command}' failed with exit code ${code}\n${stderr}`));
      }
    });
  });
}
