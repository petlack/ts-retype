import colors from 'colors';
import { createCommand } from 'commander';
import { execute, BaseCmdProps } from './cmd.js';
import { getRootDir } from './paths.js';
import { isMain } from './isMain.js';
import { runPipeline, getStats, setFnName, resolveSteps } from './pipeline.js';
import { enumToString, toEnumValue, getEnumValues } from './utils/enums.js';
import { pipelines, Step, Pipeline, steps, PipelineStepDef } from './config.js';
import { EmptyExecResult } from './exec.js';

export const program = createCommand();

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

export type MakeProps = BaseCmdProps & {
  pipeline: string;
  step?: string;
  follow: boolean;
  quiet: boolean;
};

// eslint-disable-next-line no-console
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

export async function makeConfig(
  config: Partial<MakeProps>,
): Promise<{ step?: Step; pipeline?: Pipeline; rootDir: string } | undefined> {
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

  const rootDir = await getRootDir();
  if (!rootDir) {
    log(colors.red('could not find root dir'));
    return;
  }

  return { rootDir, step, pipeline };
}

export async function make(props: Partial<MakeProps>) {
  log(props);

  const config = await makeConfig(props);
  if (!config) {
    // eslint-disable-next-line no-console
    console.error('could not resolve a config');
    return;
  }
  const { rootDir, step, pipeline } = config;

  const { defs, steps: sortedSteps } = resolveSteps({ rootDir, step, pipeline });
  printPipelineStats(steps, sortedSteps);

  const pipelineFns = sortedSteps.map((step) => {
    const fn = defs.get(step) || EmptyExecResult;
    const name = Step[step].toString();
    setFnName(fn, name ? name : '<empty>');
    return fn;
  });

  await runPipeline(pipelineFns);
}

if (isMain(import.meta)) {
  execute(program, make);
}
