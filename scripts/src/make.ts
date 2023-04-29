import colors from 'colors';
import { createCommand } from 'commander';
import { join } from 'path';
import { createRunners } from './runners.js';
import { execute, BaseCmdProps } from './cmd.js';
import { generateReadme } from './generateReadme.js';
import { getRootDir } from './paths.js';
import { isMain } from './isMain.js';
import { prepareDist } from './prepareDist.js';
import { runPipeline, PipelineStepDef, sortSteps, getStats, setFnName } from './pipeline.js';
import { syntaxHighlighting } from './syntaxHighlighting.js';
import { enumToString, toEnumValue, getEnumValues } from './lib/utils/enums.js';
import { pipelines, Step, Pipeline, ROOT, pipelinesDefinitions, steps } from './config.js';

type CmdProps = BaseCmdProps & {
  pipeline: string;
  step?: string;
  follow: boolean;
  quiet: boolean;
};

const program = createCommand();

program
  .name('make')
  .description('build it all')
  .version('1.0.0')
  .option(
    '-p, --pipeline <pipeline>',
    `pipeline to run - one of ${Object.keys(pipelines).join(' ')}`,
  )
  .option('-s, --step <step>', `single step to run - one of ${getEnumValues(Step).join(' ')}`)
  .option('-f, --follow', 'print stdout')
  .option('-q, --quiet', 'mute stderr');

const log = console.log.bind(console, '[make]');

export function printPipelineStats<T extends string | number | symbol>(
  steps: PipelineStepDef<T>[],
  plan: T[],
) {
  const { missing } = getStats(steps, plan);
  log(
    `not running (${colors.bold.white(missing.length.toString())}) ${colors.bold.yellow(
      missing.map((step) => enumToString(Step, step)).join(' '),
    )}`,
  );
  log(
    `running (${colors.bold.white(plan.length.toString())}) ${colors.bold.white(
      plan.map((step) => enumToString(Step, step)).join(' '),
    )}`,
  );
}

async function make(config: Partial<CmdProps>) {
  log(config);

  if (!config.pipeline && !config.step) {
    log(colors.white('nothing to run'));
    return;
  }

  const pipeline = config.pipeline && toEnumValue(Pipeline, config.pipeline);

  if ((config.pipeline && pipeline == null) || typeof pipeline === 'string') {
    log(colors.red(`unknown pipeline ${config.pipeline}`));
    log('known pipelines', colors.yellow(getEnumValues(Pipeline).join(' ')));
    return;
  }

  const step = config.step && toEnumValue(Step, config.step);

  if ((config.step && step == null) || typeof step === 'string') {
    log(colors.red(`unknown step ${config.step}`));
    log('known steps', colors.yellow(getEnumValues(Step).join(' ')));
    return;
  }

  const muteStdout = config.follow ? false : true;
  const muteStderr = config.quiet ? true : false;

  const rootDir = await getRootDir();

  if (!rootDir) {
    log(colors.red('could not find root dir'));
    return;
  }

  const { bash, node, npm, npmrun } = createRunners({ rootDir, muteStderr, muteStdout });

  log('running from');
  log(rootDir);

  async function script(name: string) {
    rootDir && (await node(join('dist/', name), join(rootDir, 'scripts')));
  }

  const syntaxHighlightSnippets = () =>
    syntaxHighlighting({
      output: join(rootDir, 'docs/src/generated'),
      dir: join(rootDir, 'docs/src/snippets'),
    });

  // const clean = parallel([cleanTsRetype, cleanVis, cleanDocs, cleanExample], { name: 'cleanAll' });
  // const install = parallel([installTsRetype, installVis, installDocs], { name: 'install' });

  const defs = new Map<Step, () => Promise<void>>([
    [Step.buildDocs, () => npmrun('docs', 'build')],
    [Step.buildExample, () => npmrun('example', 'build')],
    [Step.buildTsRetype, () => npmrun('retype', 'build')],
    [Step.buildUikit, () => npmrun('uikit', 'build')],
    [Step.buildVis, () => npmrun('vis', 'build')],
    [Step.cleanDocs, () => npmrun('docs', 'clean')],
    [Step.cleanExample, () => npmrun('example', 'clean')],
    [Step.cleanTsRetype, () => npmrun('retype', 'clean')],
    [Step.cleanUikit, () => npmrun('uikit', 'clean')],
    [Step.cleanVis, () => npmrun('vis', 'clean')],
    [Step.echo, () => bash('echo', 'ok')],
    [Step.format, () => npmrun(ROOT, 'format')],
    [Step.generateReadme, generateReadme],
    [Step.install, () => npm(ROOT, ['install'])],
    [Step.installDocs, () => npm('docs', ['install'])],
    [Step.installExample, () => npm('example', ['install'])],
    [Step.installTsRetype, () => npm('retype', ['install'])],
    [Step.installUikit, () => npm('uikit', ['install'])],
    [Step.installVis, () => npm('vis', ['install'])],
    [Step.prepareDist, prepareDist],
    [Step.runCreateCmdHelpSnippet, () => script('createCmdHelpSnippet')],
    [Step.runExampleTsRetype, () => npmrun('example', 'report')],
    [Step.runExtractSnippets, () => script('extractSnippets')],
    [Step.smoke, () => npmrun('example', 'smoke')],
    [Step.syntaxHighlightSnippets, syntaxHighlightSnippets],
    [Step.tests, () => npmrun(ROOT, 'test:fast')],
  ]);

  const pipelineSteps =
    step != null ? [step] : (pipeline != null && pipelinesDefinitions.get(pipeline)) || [];

  const sortedSteps = sortSteps(steps, pipelineSteps);
  printPipelineStats(steps, sortedSteps);

  const pipelineFns = sortedSteps.map((step) => {
    const fn = defs.get(step) || (() => Promise.resolve());
    const name = Step[step].toString();
    setFnName(fn, name ? name : '<empty>');
    return fn;
  });

  await runPipeline(pipelineFns);
}

if (isMain(import.meta)) {
  execute(program, make);
}
