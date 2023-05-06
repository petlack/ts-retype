import { Text, Box, BoxProps, useFocus, useApp } from 'ink';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import stripAnsi from 'strip-ansi';
import { Pipeline, Step, steps } from '../../scripts/src/config.js';
import { useDimensions } from './hooks/useDimensions.js';
import { enumToString, toEnumValue } from '../../scripts/src/utils/enums.js';
import { resolveSteps } from '../../scripts/src/pipeline.js';
import { Callback, StepResult, TaskResult, useTask } from './hooks/useTask.js';
import { useTimer } from './hooks/useTimer.js';
import { Console } from './components/Console.js';
import { ProgressBar } from './components/ProgressBar.js';
import { LogFn, useLog } from './hooks/useLog.js';
import { difference } from 'ramda';
import { Header } from './components/Header.js';
import { Spotlight } from './components/Spotlight.js';
import { useConfig } from './hooks/useConfig.js';

async function executeStep<T>(step: () => StepResult<T> | Promise<StepResult<T>>) {
  let status: 'done' | 'fail' = 'done';
  let error = null;
  let stdout = '';
  let stderr = '';
  try {
    const res = await step();
    stdout = res.stdout;
    stderr = res.stderr;
  } catch (err: unknown) {
    error = err;
    status = 'fail';
  }
  return { status, error, stdout, stderr };
}

// export async function runPipeline<T>(
//   steps: (() => Promise<ExecResult>)[],
//   callback: (step: any, res: StepResult<T>) => void,
// ): Promise<void> {
//   for (const step of steps) {
//     const res = await executeStep(step);
//     callback(step, { ...res, step });
//     if (res.error) {
//       break;
//     }
//   }
// }

// function resolveSteps({ log }: Partial<Pick<LogContextValue, 'log'>> = {}) {
//   const sortedSteps: TestStep[] = [TestStep.foo, TestStep.bar];
//   const defs = new Map<TestStep, () => ExecResult | Promise<ExecResult>>([
//     [TestStep.bar, () => Promise.resolve({ stdout: 'bar is finished', stderr: '' })],
//     [TestStep.foo, () => Promise.resolve({ stdout: 'foo as well', stderr: '' })],
//   ]);
//   log?.('resolveSteps');
//   return { steps: sortedSteps, defs };
// }

export type Config = {
  step?: string;
  pipeline?: string;
};

export type SidebarItem = Pick<TaskResult<Step>, 'status' | 'step'>

function logIntro(log: LogFn) {
  [
    '',
    '... logs will appear here ...',
    '',
    'press : to select/search step/pipeline',
    'press f to toggle between following the logs',
    'press TAB to navigate between panes',
    'press ESC to exit',
    '',
  ].forEach(msg => log({ msg }));
}

function handleError(err: unknown): { message: string, lines: string[] } {
  let message = '';
  let lines: string[] = [];
  if (err instanceof Error) {
    message = err.message;
    lines = [err.stack || ''];
  } else if (typeof err === 'object') {
    const obj = err as object;
    if ('message' in obj) {
      message = obj.message as string;
    }
    lines = [JSON.stringify(err)];
  } else if (typeof err === 'string') {
    message = err;
  } else {
    message = 'Unknown error';
  }
  return { message, lines };
}

const Sidebar: React.FC<{ items: SidebarItem[], selected: Step[] } & Pick<BoxProps, 'width' | 'height'>> = ({ items, width, selected }) => {
  const { isFocused } = useFocus();
  const missing = difference(steps.map(({ name }) => name), selected);
  const markup = items.map(({ step, status }) => {
    const isMissing = missing.includes(step);
    const symbol = isMissing ? '•' : status === 'done' ? '●' : status === 'fail' ? '⊗' : status === 'pending' ? '●' : '○';
    const symbolFg = status === 'done' ? 'green' : status === 'fail' ? 'redBright': status === 'pending' ? 'magenta' : 'gray';
    const symbolText = <Text>{symbol}</Text>; 
    const textColor = isMissing ? 'gray' : status === 'fail' ? 'redBright' : 'white';
    return (
      <Text key={step} color={textColor}><Text color={symbolFg}>{symbolText}</Text> {enumToString(Step, step)} </Text>
    );
  });
  return (
    <Box flexDirection='column' width={width} borderStyle={isFocused ? 'bold' : 'doubleSingle'} borderColor={isFocused ? 'white' : 'gray'}>
      {markup}
    </Box>
  );
};

export type MakeFlags = { step?: string, pipeline?: string } & Record<string, unknown>
export type MakeProps = { step?: Step, pipeline?: Pipeline, finishAfter?: boolean }

export const toMakeProps: (flags: MakeFlags) => MakeProps =
  (flags) => ({
    step: toEnumValue(Step, flags.step),
    pipeline: toEnumValue(Pipeline, flags.pipeline),
    finishAfter: !process.stdout.isTTY,
  });

export const Make: React.FC = () => {
  try {
    const { config } = useConfig<Config>();
    const { finishAfter, step, pipeline } = toMakeProps(config as MakeFlags);
    const { exit } = useApp();
    const { log } = useLog('make');
    
    const [fullWidth, fullHeight] = useDimensions();
    const padding = 2;
    const width = fullWidth - 2*padding;
    const height = fullHeight - 2*padding;

    const { steps: sortedSteps, defs } = useMemo(() => resolveSteps({ rootDir: '..', step, pipeline }), [step, pipeline]);
    const missing = difference(steps.map(({ name }) => name), sortedSteps);

    const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([
      ...sortedSteps.map(step => ({ step, status: 'queued' }) as SidebarItem),
      ...missing.map(step => ({ step, status: 'queued' }) as SidebarItem),
    ]);

    const updateItem = useCallback((prev: SidebarItem[], updated: Pick<SidebarItem, 'step'> & Partial<SidebarItem>) => {
      const stepIdx = prev.findIndex(item => updated.step === item.step);
      const prevStep = prev[stepIdx];
      if (stepIdx < 0 || !prevStep) {
        return prev;
      }
      return [...prev.slice(0, stepIdx), { ...prevStep, ...updated }, ...prev.slice(stepIdx + 1, Infinity)];
    }, []);

    const runStepTask = useCallback(async (sortedSteps: Step[], callback?: Callback<Step>) => {
      let idx = 0;
      for (const step of sortedSteps) {
        const fn = defs.get(step);
        const stepName = enumToString(Step, step);
        log({ level: 'info', msg: `execute ${stepName}` });
        setSidebarItems(prev => updateItem(prev, { step, status: 'pending' }));
        const res: StepResult<Step> = {
          ...(
            fn ?
              await executeStep(fn) :
              { error: 'not found', status: 'fail', stderr: 'not found', stdout: '' }
          ),
          step,
        };
        idx += 1;
        callback?.({ progress: idx / steps.length, step, res });
        setSidebarItems(prev => updateItem(prev, { step, status: res.status }));
        if (res.stdout) {
          log({ level: 'debug', msg: res.stdout, app: stepName });
        }
        if (res.stderr) {
          log({ level: 'error', msg: res.stderr, app: stepName });
        }
      }
    }, []);

    useEffect(() => log(`steps changed ${step} ${pipeline}`), [step, pipeline]);
    
    const { get, error, state, timing, value } = useTask<Step, Step, StepResult<Step>>(sortedSteps, runStepTask);

    const { stop } = useTimer(get, { interval: 100 });
    useEffect(() => {
      if (state === 'done' || state === 'fail') {
        stop();
        if (finishAfter) {
          exit();
        }
      }
    }, [stop, state]);

    useEffect(() => {
      logIntro(log);
    }, []);

    const statusMarkup = pipeline == null && step == null ? (
      <Text>No pipeline or step selected. Press <Text bold>:</Text> to search or <Text bold>ESC</Text> to exit</Text>
    ) : pipeline != null ? (
      <>
        <Text>pipeline</Text>
        <Text bold>{enumToString(Pipeline, pipeline)}</Text>
        <Text>is</Text>
        <Text bold>{state}</Text>
      </>
    ) : (
      <>
        <Text>step</Text>
        <Text bold>{enumToString(Step, step)}</Text>
        <Text>is</Text>
        <Text bold>{state}</Text>
      </>
    );

    return (
      <Box flexDirection='column' height={height} paddingLeft={padding} paddingRight={padding} gap={1}>
        <Header />
        <Box gap={1} flexDirection='row' flexWrap='wrap'>
          {statusMarkup}
        </Box>
        <Box flexDirection='row' gap={padding} width={width}>
          <Sidebar items={sidebarItems} selected={sortedSteps} width={30} />
          <Box flexDirection='column' flexGrow={1}>
            <Box flexGrow={1} overflow='visible'>
              <Console />
            </Box>
            <ProgressBar {...timing} />
          </Box>
        </Box>
        <Spotlight width={width} />
      </Box>
    );
  }
  catch (e: unknown) {
    const { message, lines } = handleError(e);
    return (
      <Box borderStyle='double' borderColor='redBright' padding={2} gap={1} flexDirection='column'>
        <Text backgroundColor='redBright' color='black'> {message} </Text>
        {lines.map((line, idx) => (
          <Text key={idx}>{line}</Text>
        ))}
      </Box>
    );
  }
};