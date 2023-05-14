import { Latchable, Row, Stack, Text, TextProps, latch } from '@ts-retype/clikit';
import { append, evolve } from 'ramda';
import React, { FC } from 'react';

type Log = { msg: string; level: string; }

export const PrettyJsonMsg: FC<{ children: Log }> = ({ children: log }) => {
  const levelStyle: TextProps = {
    color: {
      info: '#f0f0f0',
      debug: '#808080',
      fatal: '#FF0000',
      alert: '#FF8000',
      metric: 'magenta',
      notice: 'green',
      trace: 'blue',
      warn: 'yellow',
      error: 'red',
    }[log.level],
  };
  const levelMarkup = `[${log.level}]`.padEnd(8, ' ');
  const msgStyle = levelStyle;
  const keyStyle = { color: 'blue' };

  const key = 'key' in log && log.key as string;
  return (
    <Row nice>
      {key ? <Text {...keyStyle}>[{key}]</Text> : <></>}
      <Text {...levelStyle}>{levelMarkup}</Text>
      <Text {...msgStyle}>{log.msg}</Text>
    </Row>
  );
};

const Console: FC<Latchable<State>> = ({ useStore }) => {
  const logs = useStore(state => state.logs);
  return (
    <Stack vertical>
      {logs.slice(-10).map((log, idx) => <PrettyJsonMsg key={idx}>{log}</PrettyJsonMsg>)}
    </Stack>
  );
};

type State = { logs: Log[] };

async function run() {
  const actions = {
    debug: (log: Omit<Log, 'level'>) => evolve({ logs: append({ ...log, level: 'debug' }) }),
    info: (log: Omit<Log, 'level'>) => evolve({ logs: append({ ...log, level: 'info' }) }),
    warn: (log: Omit<Log, 'level'>) => evolve({ logs: append({ ...log, level: 'warn' }) }),
    fatal: (log: Omit<Log, 'level'>) => evolve({ logs: append({ ...log, level: 'fatal' }) }),
    notice: (log: Omit<Log, 'level'>) => evolve({ logs: append({ ...log, level: 'notice' }) }),
    error: (log: Omit<Log, 'level'>) => evolve({ logs: append({ ...log, level: 'error' }) }),
    trace: (log: Omit<Log, 'level'>) => evolve({ logs: append({ ...log, level: 'trace' }) }),
  };
  const initialState: State = { logs: [] };
  const logger = latch(Console, actions, initialState);

  for (const i of [...Array(20).keys()]) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    logger.debug({ msg: `step ${i}` });
    if (i % 2 === 0) {
      logger.info({ msg: `info on ${i}` });
    }
    if (i % 3 === 0) {
      logger.warn({ msg: `warning about ${i}` });
    }
    if (i % 5 === 3) {
      logger.error({ msg: `${i} failed` });
    }
    if (i % 7 === 2) {
      logger.trace({ msg: `trace ${i}` });
    }
    if (i % 13 === 1) {
      logger.fatal({ msg: `panic at ${i}` });
    }
    if (i % 7 === 5) {
      logger.notice({ msg: `notice ${i}` });
    }
  }
  logger.finish();
}

run();
