import React, { FC } from 'react';
import { Fullscreen, FullscreenPanes, Json, Latchable, Text, latch } from '@ts-retype/clikit';
import { always, append, assocPath, evolve, pipe } from 'ramda';
import { Box } from 'ink';

type Task = { id: string; state: string; }
type AppState = { byId: { [id: string]: Task }; ids: string[]; lastId?: string; }
const initialState: AppState = { byId: {}, ids: [] };

const StatefulApp: FC<Latchable<AppState>> = ({ useStore }) => {
  const byId = useStore(state => state.byId);
  const lastId = useStore(state => state.lastId);
  return (
    <Fullscreen>
      <FullscreenPanes>
        <Box flexDirection='column'>
          {Object.entries(byId).slice(-3).map(([idx, task]) => <Json key={idx} value={task} options={{ nice: true }} />)}
        </Box>
        <Box>
          <Text>Last task {lastId}</Text>
        </Box>
      </FullscreenPanes>
    </Fullscreen>
  );
};

const actionsDefinition = {
  addTask: (task: Task) => pipe(
    assocPath<Task, AppState>(['byId', task.id], task),
    evolve({ ids: append(task.id) }),
  ),
  changeTaskState: (task: Task, newState: string) => pipe(
    assocPath<string, AppState>(['byId', task.id, 'state'], newState),
    assocPath<string, AppState>(['lastId'], task.id),
  ),
  clear: () => always(initialState),
};

async function run() {
  async function process(task: Task) {
    log.changeTaskState(task, 'pending');
    await new Promise(resolve => setTimeout(resolve, 1000));
    log.changeTaskState(task, 'done');
  }

  const log = latch(
    StatefulApp,
    actionsDefinition,
    initialState,
  );

  const tasks: Task[] = [...Array(10).keys()].map(idx => ({
    id: `input/file_${idx.toString().padStart(3, '0')}.jsonl`,
    state: 'created',
  }));
  for (const task of tasks) {
    await process(task);
  }
  log.finish();
}

run();
