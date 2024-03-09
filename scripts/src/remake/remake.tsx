import { Key, useFocus, useApp } from 'ink';
import React, { useCallback } from 'react';
// import stripAnsi from 'strip-ansi';
import { Pipeline, Step, steps } from '../config.js';
import { enumToString, toEnumValue } from '../utils/enums.js';
import { executeStep, handleError, resolveSteps, setFnName } from '../pipeline.js';
import { always, append, assocPath, concat, equals, evolve, indexBy, mergeLeft, pipe, pluck, prop, reduceBy, reject } from 'ramda';

import {
  Box,
  Console,
  Fullscreen,
  Heading,
  Progress,
  ProgressBar,
  Text,
  UseStore,
  latch,
  tick,
  useConfig,
  useDimensions,
  useKeymap,
} from '@ts-retype/clikit';
import { EmptyExecResult } from '../exec.js';
import { MakeProps, program, makeConfig } from '../make.js';
import { execute } from '../cmd.js';
import { isMain } from '../isMain.js';
import { Spotlight } from './Spotlight.js';

type Task = {
  step: Step;
  state: 'idle' | 'queued' | 'pending' | 'done' | 'fail';
};

type Log = {
  seq?: number;
  level?: 'debug' | 'info' | 'warn' | 'error';
  time?: number;
  app?: string;
  msg?: string;
};

type LogFn = (msg: Log | string) => void;

type State = {
  tasks: {
    byId: { [key in Step]?: Task };
    byState: { [key in Task['state']]?: Step[] };
    ids: Step[];
    selectedIds: Step[];
    currentStepId?: Step;
  };
  state: Task['state'];
  startedAt: number;
  logs: Log[];
  progress: Progress;
}

const Sidebar: React.FC<{ tasks: State['tasks'] } & { width?: number | string }> = ({ tasks, width }) => {
  const { isFocused } = useFocus();
  const markup = tasks.ids.map(step => {
    const { state } = tasks.byId[step] || {};
    const symbol = state === 'idle' ? '•' : state === 'done' ? '●' : state === 'fail' ? '⊗' : state === 'pending' ? '●' : '○';
    const symbolFg = state === 'done' ? 'green' : state === 'fail' ? 'redBright' : state === 'pending' ? 'magenta' : 'gray';
    const symbolText = <Text>{symbol}</Text>;
    const textColor = state === 'idle' ? 'gray' : state === 'fail' ? 'redBright' : 'white';
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

export const Make: React.FC<{ useStore: UseStore<State> }> = ({ useStore }) => {
  try {
    const { exit } = useApp();
    const { config } = useConfig<MakeProps>();
    const { step, pipeline } = config;

    const progress = useStore(state => state.progress);
    const tasks = useStore(state => state.tasks);
    const logs = useStore(state => state.logs);

    const [fullWidth, fullHeight] = useDimensions();
    const padding = 2;
    const width = fullWidth - 2 * padding;
    const height = fullHeight - 2 * padding;

    const handleInput = useCallback((input: string, key: Key) => {
      if (key.escape || input === 'q') {
        exit();
      }
    }, [exit]);
    useKeymap(handleInput);

    const statusMarkup = pipeline == null && step == null ? (
      <Text>No pipeline or step selected. Press <Text bold>:</Text> to search or <Text bold>ESC</Text> to exit</Text>
    ) : pipeline != null ? (
      <>
        <Text>pipeline</Text>
        <Text bold>{enumToString(Pipeline, pipeline)}</Text>
        <Text>is</Text>
        <Text bold>{'running'}</Text>
      </>
    ) : (
      <>
        <Text>step</Text>
        <Text bold>{enumToString(Step, step)}</Text>
        <Text>is</Text>
        <Text bold>{'running'}</Text>
      </>
    );

    return (
      <Fullscreen>
        <Box flexDirection='column' height={height} paddingLeft={padding} paddingRight={padding} paddingTop={1} gap={1}>
          <Heading>pipeline</Heading>
          <Box gap={1} flexDirection='row' flexWrap='wrap'>
            {statusMarkup}
          </Box>
          <Box flexDirection='row' gap={padding} width={width}>
            <Sidebar tasks={tasks} width={30} />
            <Box flexDirection='column' flexGrow={1}>
              <Box flexGrow={1} overflow='visible'>
                <Console logs={logs} buffer={height} />
              </Box>
              <ProgressBar {...progress} />
            </Box>
          </Box>
          <Spotlight width={width} />
        </Box>
      </Fullscreen>
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

const initialState: State = {
  startedAt: new Date().getTime(),
  state: 'idle',
  tasks: {
    byId: {},
    byState: {
      idle: [],
      done: [],
      fail: [],
      queued: [],
      pending: [],
    },
    ids: [],
    selectedIds: [],
  },
  logs: [],
  progress: {
    startedAt: new Date().getTime(),
    lastTickAt: new Date().getTime(),
    lastProgress: 0,
    progress: 0,
    ticks: 0,
    duration: 0,
    speed: 0,
  },
};

const actionsDefinition = {
  reset: () => always(initialState),
  updateTask: (task: Task) => pipe(
    assocPath<Task, State>(['tasks', 'byId', task.step], task),
  ),
  updateTaskState: (taskId: Task['step'], state: Task['state']) => pipe(
    (prev: State) => evolve({
      tasks: {
        byId: assocPath([taskId, 'state'], state),
        byState: evolve({
          [state]: append(taskId),
          [prev.tasks.byId[taskId]?.state || 'idle']: reject(equals(taskId))
        }),
      },
    }, prev),
    (prev: State) => evolve({
      progress: prevTim => tick(prevTim, (prev.tasks.byState.done?.length || 0) / prev.tasks.ids.length),
    }, prev),
  ),
  addTasks: (tasks: Task[]) => evolve({
    tasks: {
      byId: mergeLeft(indexBy(prop('step'), tasks)),
      byState: mergeLeft(reduceBy((acc, { step }) => [...acc, step], [] as Step[], task => task.state, tasks)),
      ids: concat(pluck('step', tasks)),
    }
  }),
  log: (msg: Log | string) => (state: State) => {
    if (!msg) return state;
    const log = typeof msg === 'string' ? { msg } : msg;
    return evolve({
      logs: append(log),
    }, state);
  },
  logMany: (msgs: Log[]) => evolve({ logs: prev => [...prev, ...msgs] }),
};

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

async function make(props: Partial<MakeProps>) {
  const actions = latch<State, typeof actionsDefinition>(Make, actionsDefinition, initialState, { discreet: true });
  // eslint-disable-next-line no-console
  console.log = actions.log;
  actions.addTasks(steps.map(step => ({ step: step.name, state: 'idle' })));

  const config = await makeConfig(props);
  if (!config) {
    // eslint-disable-next-line no-console
    console.error('could not resolve a config');
    return;
  }
  const { rootDir, step, pipeline } = config;

  const { defs, steps: sortedSteps } = resolveSteps({ rootDir, step, pipeline });
  sortedSteps.forEach(step => actions.updateTaskState(step, 'queued'));

  logIntro(actions.log);

  const pipelineFns = sortedSteps.map((step) => {
    const fn = defs.get(step) || EmptyExecResult;
    const name = Step[step].toString();
    setFnName(fn, name);
    return fn;
  });

  for (const fn of pipelineFns) {
    actions.log({ msg: 'starting step', app: fn.name, level: 'debug' });
    const step = toEnumValue(Step, fn.name);
    if (!step) continue;
    actions.updateTaskState(step, 'pending');
    const { status, error, stdout, stderr } = await executeStep(fn);
    actions.log({ level: 'info', app: 'make', msg: `step ${fn.name} finished with status ${status}` });
    actions.logMany(stdout.split('\n').map(msg => ({ msg, app: fn.name, level: 'debug' })));
    if (error || stderr) {
      actions.log({ level: 'error', app: 'make', msg: `step ${fn.name} produced error output ${error}` });
      actions.logMany(stderr.split('\n').map(msg => ({ msg, app: fn.name, level: 'error' })));
    }
    actions.updateTaskState(step, status);
  }

  actions.finish();
}

if (isMain(import.meta)) {
  execute(program, make);
}
