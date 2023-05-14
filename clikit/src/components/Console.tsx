import React, { useCallback, useState } from 'react';
import { Box, Key, Text, useFocus } from 'ink';
import { useKeymap } from '../hooks/useKeymap.js';
import { clamp } from 'ramda';

export type Log = {
  seq?: number;
  level?: 'debug' | 'info' | 'warn' | 'error';
  time?: number;
  app?: string;
  msg?: string;
};

function toString(msg: any): string {
  if (typeof msg === 'string') return msg;
  return msg && msg.toString && msg.toString() || '';
}

export type ConsoleProps = {
  logs: Log[];
  buffer?: number;
  isFollow?: boolean;
  offset?: number;
}

export const Console: React.FC<ConsoleProps> = ({ logs, buffer = 10 }) => {
  const levelBgMap = new Map<Log['level'], string>([
    ['error', 'redBright'],
    ['info', 'whiteBright'],
    ['debug', '#818181'],
  ]);

  const { isFocused } = useFocus();
  const [offset, setOffset] = useState(0);
  const [isFollow, setIsFollow] = useState(true);

  const clip = (val: number) => clamp(0, Math.max(0, logs.length - buffer), val);

  const handler = useCallback((input: string, key: Key) => {
    if (!isFocused) return;
    const cancelsFollow = isFollow && (key.downArrow || key.upArrow || key.pageDown || key.pageUp);
    if (cancelsFollow) {
      setIsFollow(false);
      setOffset(logs.length - buffer);
    }
    if (input === 'f') {
      setIsFollow(true);
      setOffset(-1 * buffer);
    }
    if (key.downArrow) setOffset(prev => clip(prev + 1));
    if (key.upArrow) setOffset(prev => clip(prev - 1));
    if (key.pageDown) setOffset(prev => clip(prev + buffer));
    if (key.pageUp) setOffset(prev => clip(prev - buffer));
  }, [isFocused, isFollow]);

  useKeymap(handler);

  const linesMarkup = logs.slice(offset, Infinity)
    .slice(0, buffer)
    .map(({ msg, seq, time, level, app }, idx) => (
      <Text key={`${seq}-${idx}-${time}`} color={levelBgMap.get(level)}>{time} {level} [{app}] {toString(msg)}</Text>
    ));
  return (
    <Box
      flexGrow={1}
      flexDirection='column'
      minWidth={40}
      borderStyle={isFocused ? 'bold' : 'doubleSingle'}
      borderColor={isFocused ? 'white' : 'gray'}
    >
      {linesMarkup}
    </Box>
  );
};
