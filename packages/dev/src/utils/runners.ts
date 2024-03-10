import { ExecResult, spawn } from '@ts-retype/utils/std.js';
import { join } from 'path';

export type Runners = {
  npmrun: (workspace: string | null, script: string) => Promise<ExecResult>;
  npm: (workspace: string | null, commands: string[]) => Promise<ExecResult>;
  bash: (...commands: string[]) => Promise<ExecResult>;
  node: (jsPath: string, cwd: string) => Promise<ExecResult>;
  // script: (name: string) => Promise<ExecResult>;
};

export function createRunners({
    rootDir,
    muteStderr,
    muteStdout,
}: {
  rootDir: string;
  muteStderr: boolean;
  muteStdout: boolean;
}): Runners {
    async function bash(...commands: string[]): Promise<ExecResult> {
        if (!rootDir) {
            return { stderr: 'rootDir not found', stdout: '' };
        }
        if (commands.length === 0) {
            return { stderr: '', stdout: '' };
        }
        const cwd = rootDir;
        return await spawn(commands.at(0) || 'echo', commands.slice(1), {
            cwd,
            muteStdout,
            muteStderr,
        });
    }

    async function node(jsPath: string, cwd: string): Promise<ExecResult> {
        if (!rootDir) {
            return { stderr: 'rootDir not found', stdout: '' };
        }
        return await spawn('node', [jsPath], { cwd, muteStdout, muteStderr });
    }

    async function npm(workspace: string | null, commands: string[]): Promise<ExecResult> {
        if (!rootDir) {
            return { stderr: 'rootDir not found', stdout: '' };
        }
        const cwd = workspace ? join(rootDir, workspace) : rootDir;
        return await spawn('npm', commands, { cwd, muteStdout, muteStderr });
    }

    async function npmrun(workspace: string | null, script: string): Promise<ExecResult> {
        return await npm(workspace, ['run', script]);
    }

    // async function script(name: string): Promise<ExecResult> {
    //     if (!rootDir) {
    //         return { stderr: 'rootDir not found', stdout: '' };
    //     }
    //     return await node(join('dist/', `${name}.js`), join(rootDir, 'scripts'));
    // }

    return {
        bash,
        node,
        npm,
        npmrun,
        // script,
    };
}
