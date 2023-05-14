import { Latchable, Stack, Text, latch } from '@ts-retype/clikit';
import { append, evolve, takeLast } from 'ramda';
import React, { FC } from 'react';

type ConsoleState = {
  logs: string[];
  keep: number;
  window: number;
}

const initialState: ConsoleState = {
  window: 5,
  keep: 10,
  logs: [],
};

const Console: FC<Latchable<ConsoleState>> = ({ useStore }) => {
  const logs = useStore(state => state.logs);
  const window = useStore(state => state.window);
  const lines = takeLast(window, logs);
  return (
    <Stack>
      {lines.map((log, idx) => <Text key={idx}>{log}</Text>)}
    </Stack>
  );
};

const actions = {
  debug: (msg: string) => evolve({ logs: append(msg) }),
};

const log = latch(Console, actions, initialState);

async function run() {
  for (const i of [...Array(20).keys()]) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    log.debug(`step ${i}`);
  }
  log.finish();
}

run();
