import { setTimeout } from 'timers/promises';
import React, { FC } from 'react';
import { Console, Fullscreen, Latchable, latch } from '@ts-retype/clikit';
import { generateSentence } from './utils.js';
import { append, evolve, range } from 'ramda';

// const special = '!@#$%^&*()';
// const numbers = '0123456789';

type Log = {
  msg: string;
}

const FullscreenConsole: FC<Latchable<State>> = ({ useStore }) => {
  const logs = useStore(state => state.logs);
  return (
    <Fullscreen>
      <Console logs={logs} buffer={30} />
    </Fullscreen>
  );
};

type State = { logs: Log[] };
const actionsDefinition = {
  log: (log: Log) => evolve({ logs: append(log) }),
};
const initialState: State = { logs: [] };

async function run() {
  // const logs = generateText().split('\n').map(msg => ({ msg }));
  // await elapse(<FullscreenConsole logs={logs} />);
  const actions = latch(FullscreenConsole, actionsDefinition, initialState);
  for (const _i of range(0, 1_000)) {
    await setTimeout(500);
    actions.log({ msg: generateSentence() });
  }
}

run();
