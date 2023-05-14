import { latch, Latchable, Stack, Text } from '@ts-retype/clikit';
import { append, evolve } from 'ramda';
import React from 'react';
import { FC } from 'react';

interface Logger {
  debug(log: { msg: string }): void;
  info(log: { msg: string }): void;
}

async function taskFoo(logger: Logger) {
  for (const i of [...Array(20).keys()]) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    logger.debug({ msg: `foo step ${i}` });
    if (i % 5 === 3) {
      logger.info({ msg: `foo ${i} failed` });
    }
  }
}

async function taskBar(logger: Logger) {
  for (const j of [...Array(100).keys()]) {
    const i = j + 99;
    await new Promise((resolve) => setTimeout(resolve, 100));
    logger.debug({ msg: `bar step ${i}` });
    if (i % 5 === 4) {
      logger.info({ msg: `bar ${i} failed` });
    }
  }
}

type Log = { msg: string; }
type State = { consoles: string[]; logsByConsole: { [key: string]: Log[] } };
const initialState: State = { consoles: ['debug', 'info'], logsByConsole: { debug: [], info: [] } };

const actions = {
  debug: (log: Log) => evolve({ logsByConsole: { debug: append(log) } }),
  info: (log: Log) => evolve({ logsByConsole: { info: append(log) } }),
};

const Console: FC<{ module: string, state: Log[] }> = ({ module, state }) => {
  return (
    <Stack vertical>
      <Text red>{module}</Text>
      {state.slice(-10).map((log, idx) => <Text key={idx}>{log.msg}</Text>)}
    </Stack>
  );
};

export const ConsoleLayout: FC<Latchable<State>> = ({ useStore }) => {
  const consoles = useStore(state => state.consoles);
  const logsByConsole = useStore(state => state.logsByConsole);
  return (
    <Stack horizontal gap={2}>
      {consoles.map(module => <Console key={module} module={module} state={logsByConsole[module] || []} />)}
    </Stack>
  );
};

async function run() {
  const logger = latch(ConsoleLayout, actions, initialState);
  await Promise.all([taskFoo(logger), taskBar(logger)]);
  logger.finish();
}


run();
