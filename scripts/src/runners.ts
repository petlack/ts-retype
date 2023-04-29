import { join } from 'path';
import { exec } from './exec.js';

export function createRunners({
  rootDir,
  muteStderr,
  muteStdout,
}: {
  rootDir: string;
  muteStderr: boolean;
  muteStdout: boolean;
}) {
  async function node(jsPath: string, cwd: string): Promise<void> {
    if (!rootDir) {
      return;
    }
    await exec('node', [jsPath], {
      cwd,
      muteStdout,
      muteStderr,
    });
  }

  async function npm(workspace: string | null, commands: string[]): Promise<void> {
    if (!rootDir) {
      return;
    }
    const cwd = workspace ? join(rootDir, workspace) : rootDir;
    await exec('npm', commands, { cwd, muteStdout, muteStderr });
  }

  async function npmrun(workspace: string | null, script: string): Promise<void> {
    await npm(workspace, ['run', script]);
  }

  async function bash(...commands: string[]): Promise<void> {
    if (!rootDir) {
      return;
    }
    const cwd = rootDir;
    await exec(commands[0], commands.slice(1), { cwd, muteStderr, muteStdout });
  }

  return {
    bash,
    node,
    npm,
    npmrun,
  };
}
