import { spawn } from 'child_process';

export type ExecOptions = {
  muteStdout?: boolean;
  muteStderr?: boolean;
  cwd?: string;
};

export async function exec(command: string, args: string[] = [], options: ExecOptions = {}) {
  const { muteStdout = false, muteStderr = false, cwd = process.cwd() } = options;

  const child = spawn(command, args, { cwd, shell: true });

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
