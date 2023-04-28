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
import { getEnumValue, getEnumValues } from './lib/utils/enums.js';

type CmdProps = BaseCmdProps & {
  pipeline: string;
  step?: string;
  follow: boolean;
  quiet: boolean;
};

const ROOT = null;

enum Pipeline {
  all,
  publish,
  bump,
  test,
  docs,
}
enum Step {
  buildDocs,
  buildExample,
  buildTsRetype,
  buildUikit,
  buildVis,
  cleanDocs,
  cleanExample,
  cleanTsRetype,
  cleanUikit,
  cleanVis,
  echo,
  format,
  generateReadme,
  installDocs,
  installExample,
  installTsRetype,
  installUikit,
  installVis,
  prepareDist,
  runCreateCmdHelpSnippet,
  runExampleTsRetype,
  runExtractSnippets,
  smoke,
  syntaxHighlightSnippets,
  tests,
}

const pipelines = new Set<Pipeline>([
  Pipeline.all,
  Pipeline.publish,
  Pipeline.bump,
  Pipeline.test,
  Pipeline.docs,
]);

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

export function printPipelineStats<T>(steps: PipelineStepDef<T>[], plan: T[]) {
  const { missing } = getStats(steps, plan);
  const msg = [
    `not running ${colors.bold.yellow(missing.map((k) => getEnumValue(k, Step)).join(' '))}`,
    `running ${colors.bold.white(plan.map((k) => getEnumValue(k, Step)).join(' '))}`,
  ].join('\n');
  log(msg);
}

async function make(config: Partial<CmdProps>) {
  log(config);

  if (!config.pipeline && !config.step) {
    log(colors.white('nothing to run'));
    return;
  }

  const pipeline = config.pipeline && getEnumValue(config.pipeline, Pipeline);

  if (config.pipeline && !pipeline) {
    log(colors.red(`unknown pipeline ${config.pipeline}`));
    log('known pipelines', colors.yellow(getEnumValues(Pipeline).join(' ')));
    return;
  }

  const step = config.step && getEnumValue(config.step, Step);

  if (config.step && !step) {
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
    rootDir && (await node(join('dist/scripts/src', name), join(rootDir, 'scripts')));
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
    [Step.buildTsRetype, () => npmrun(ROOT, 'build')],
    [Step.buildUikit, () => npmrun('uikit', 'build')],
    [Step.buildVis, () => npmrun('vis', 'build')],
    [Step.cleanDocs, () => npmrun('docs', 'clean')],
    [Step.cleanExample, () => npmrun('example', 'clean')],
    [Step.cleanTsRetype, () => npmrun(ROOT, 'clean')],
    [Step.cleanUikit, () => npmrun('uikit', 'clean')],
    [Step.cleanVis, () => npmrun('vis', 'clean')],
    [Step.echo, () => bash('echo', 'ok')],
    [Step.format, () => npmrun(ROOT, 'format')],
    [Step.generateReadme, generateReadme],
    [Step.installDocs, () => npm('docs', ['install'])],
    [Step.installExample, () => npm('example', ['install'])],
    [Step.installTsRetype, () => npm(ROOT, ['install'])],
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

  const steps: PipelineStepDef<Step>[] = [
    { name: Step.cleanExample, deps: [] },
    { name: Step.cleanDocs, deps: [] },
    { name: Step.cleanTsRetype, deps: [] },
    { name: Step.cleanUikit, deps: [] },
    { name: Step.cleanVis, deps: [] },
    { name: Step.format, deps: [] },
    { name: Step.installDocs, deps: [Step.cleanDocs] },
    { name: Step.installTsRetype, deps: [Step.cleanTsRetype] },
    { name: Step.installUikit, deps: [Step.cleanUikit] },
    { name: Step.installVis, deps: [Step.cleanVis] },
    { name: Step.buildUikit, deps: [Step.installUikit] },
    { name: Step.buildVis, deps: [Step.installVis, Step.buildUikit] },
    { name: Step.buildTsRetype, deps: [Step.installTsRetype] },
    { name: Step.prepareDist, deps: [Step.buildVis, Step.buildTsRetype] },
    { name: Step.tests, deps: [Step.prepareDist] },
    { name: Step.installExample, deps: [Step.cleanExample, Step.prepareDist] },
    { name: Step.buildExample, deps: [Step.runExtractSnippets] },
    { name: Step.runCreateCmdHelpSnippet, deps: [Step.prepareDist] },
    { name: Step.runExampleTsRetype, deps: [Step.installExample] },
    { name: Step.runExtractSnippets, deps: [Step.runExampleTsRetype] },
    { name: Step.syntaxHighlightSnippets, deps: [Step.runExtractSnippets] },
    {
      name: Step.buildDocs,
      deps: [
        Step.installDocs,
        Step.runExampleTsRetype,
        Step.runExtractSnippets,
        Step.syntaxHighlightSnippets,
      ],
    },
    { name: Step.generateReadme, deps: [Step.runExtractSnippets, Step.runCreateCmdHelpSnippet] },
    { name: Step.smoke, deps: [Step.tests, Step.runExampleTsRetype, Step.runExtractSnippets] },
  ];

  const pipelinesDefinitions = new Map<Pipeline, Step[]>([
    [Pipeline.all, [Step.smoke, Step.generateReadme, Step.buildDocs]],
    [Pipeline.publish, [Step.tests, Step.prepareDist]],
    [Pipeline.test, [Step.smoke]],
    [Pipeline.docs, [Step.tests, Step.generateReadme, Step.buildDocs]],
  ]);

  const pipelineSteps = step ? [step] : (pipeline && pipelinesDefinitions.get(pipeline)) || [];

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
