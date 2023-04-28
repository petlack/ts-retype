import { join } from 'path';
import { exec } from './exec';

export function createRunners({
  rootDir,
  muteStderr,
  muteStdout,
}: {
  rootDir: string;
  muteStderr: boolean;
  muteStdout: boolean;
}) {
  async function node(jsPath: string, cwd: string) {
    if (!rootDir) {
      return;
    }
    await exec('node', [jsPath], {
      cwd,
      muteStdout,
      muteStderr,
    });
  }

  async function npm(workspace: string | null, commands: string[]) {
    if (!rootDir) {
      return;
    }
    const cwd = workspace ? join(rootDir, workspace) : rootDir;
    await exec('npm', commands, { cwd, muteStdout, muteStderr });
  }

  async function npmrun(workspace: string | null, script: string) {
    await npm(workspace, ['run', script]);
  }

  return {
    node,
    npm,
    npmrun,
  };
}
