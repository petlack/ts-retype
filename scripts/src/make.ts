import colors from 'colors';
import { createCommand } from 'commander';
import { join } from 'path';
import { BaseCmdProps, execute } from './cmd.js';
import { exec } from './exec.js';
import { generateReadme } from './generateReadme.js';
import { isMain } from './isMain.js';
import { getRootDir } from './paths.js';
import { pipeline, PipelineStepDef, printPipelineStats, sortSteps } from './pipeline.js';
import { prepareDist } from './prepareDist.js';
import { syntaxHighlighting } from './syntaxHighlighting.js';

type CmdProps = BaseCmdProps & {
  pipeline: string;
  follow: boolean;
  quiet: boolean;
};

const pipelines = { all: true, publish: true, bump: true, test: true, docs: true };

const program = createCommand();

program
  .name('make')
  .description('build it all')
  .version('1.0.0')
  .option(
    '-p, --pipeline <pipeline>',
    `pipeline to run - one of ${Object.keys(pipelines).join(' ')}`,
  )
  .option('-f, --follow', 'print stdout')
  .option('-q, --quiet', 'mute stderr');

const log = console.log.bind(console, '[make]');

async function make(config: Partial<CmdProps>) {
  log(config);

  const muteStdout = config.follow ? false : true;
  const muteStderr = config.quiet ? true : false;

  const rootDir = await getRootDir();

  if (!rootDir) {
    log(colors.red('could not find root dir'));
    return;
  }

  if (!config.pipeline) {
    log(colors.red('missing pipeline'));
    log('known pipelines', colors.yellow(Object.keys(pipelines).join(' ')));
    return;
  }

  log('running from');
  log(rootDir);

  async function script(name: string) {
    if (!rootDir) {
      return;
    }
    await exec('node', [join('dist/scripts/src', name)], {
      cwd: join(rootDir, 'scripts'),
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

  const syntaxHighlightSnippets = () =>
    syntaxHighlighting({
      output: join(rootDir, 'docs/src/generated'),
      dir: join(rootDir, 'docs/src/snippets'),
    });

  // const clean = parallel([cleanTsRetype, cleanVis, cleanDocs, cleanExample], { name: 'cleanAll' });
  // const install = parallel([installTsRetype, installVis, installDocs], { name: 'install' });
  const buildDocs = () => npmrun('docs', 'build');
  const buildExample = () => npmrun('example', 'build');
  const buildTsRetype = () => npmrun(null, 'build');
  const buildVis = () => npmrun('vis', 'build');
  const cleanDocs = () => npmrun('docs', 'clean');
  const cleanExample = () => npmrun('example', 'clean');
  const cleanTsRetype = () => npmrun(null, 'clean');
  const cleanVis = () => npmrun('vis', 'clean');
  const format = () => npmrun(null, 'format');
  const installDocs = () => npm('docs', ['install']);
  const installExample = () => npm('example', ['install']);
  const installTsRetype = () => npm(null, ['install']);
  const installVis = () => npm('vis', ['install']);
  const runCreateCmdHelpSnippet = () => script('createCmdHelpSnippet');
  const runExampleTsRetype = () => npmrun('example', 'report');
  const runExtractSnippets = () => script('extractSnippets');
  const smoke = () => npmrun('example', 'smoke');
  const tests = () => npmrun(null, 'test:fast');

  const defs = {
    buildDocs,
    buildExample,
    buildTsRetype,
    buildVis,
    cleanDocs,
    cleanExample,
    cleanTsRetype,
    cleanVis,
    format,
    generateReadme,
    installDocs,
    installExample,
    installTsRetype,
    installVis,
    prepareDist,
    runCreateCmdHelpSnippet,
    runExampleTsRetype,
    runExtractSnippets,
    smoke,
    syntaxHighlightSnippets,
    tests,
  };

  const steps: PipelineStepDef<typeof defs>[] = [
    { name: 'cleanExample', deps: [] },
    { name: 'cleanDocs', deps: [] },
    { name: 'cleanTsRetype', deps: [] },
    { name: 'cleanVis', deps: [] },
    { name: 'format', deps: [] },
    { name: 'installDocs', deps: ['cleanDocs'] },
    { name: 'installTsRetype', deps: ['cleanTsRetype'] },
    { name: 'installVis', deps: ['cleanVis'] },
    { name: 'buildVis', deps: ['installVis'] },
    { name: 'buildTsRetype', deps: ['installTsRetype'] },
    { name: 'prepareDist', deps: ['buildVis', 'buildTsRetype'] },
    { name: 'tests', deps: ['prepareDist'] },
    { name: 'installExample', deps: ['cleanExample', 'prepareDist'] },
    { name: 'buildExample', deps: ['runExtractSnippets'] },
    { name: 'runCreateCmdHelpSnippet', deps: ['prepareDist'] },
    { name: 'runExampleTsRetype', deps: ['installExample'] },
    { name: 'runExtractSnippets', deps: ['runExampleTsRetype', 'runCreateCmdHelpSnippet'] },
    { name: 'syntaxHighlightSnippets', deps: ['runExtractSnippets'] },
    {
      name: 'buildDocs',
      deps: ['installDocs', 'runExampleTsRetype', 'runExtractSnippets', 'syntaxHighlightSnippets'],
    },
    { name: 'generateReadme', deps: ['runExtractSnippets'] },
    { name: 'smoke', deps: ['tests', 'runExampleTsRetype', 'runExtractSnippets'] },
  ];

  type Pipeline = keyof typeof pipelines;
  type Step = keyof typeof defs;
  const pipelinesDefinitions = new Map<Pipeline, Step[]>([
    ['all', ['smoke', 'generateReadme', 'buildDocs']],
    ['publish', ['tests', 'prepareDist']],
    ['test', ['smoke']],
    ['docs', ['tests', 'generateReadme', 'buildDocs']],
  ]);
  const pipelineSteps = pipelinesDefinitions.get(config.pipeline as Pipeline);
  if (!pipelineSteps) {
    log(colors.red(`unknown pipeline ${config.pipeline}`));
    log('known pipelines', colors.yellow(Object.keys(pipelines).join(' ')));
    return;
  }

  const sortedSteps = sortSteps(steps, pipelineSteps);
  printPipelineStats(steps, sortedSteps);
  await pipeline(sortedSteps.map((step) => defs[step]));
}

if (isMain(import.meta)) {
  execute(program, make);
}
