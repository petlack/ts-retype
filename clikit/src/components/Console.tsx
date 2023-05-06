import React, { useEffect } from 'react';
import { Box, Text, useFocus } from 'ink';
import { Log, useLog } from '../hooks/useLog.js';
import { useConsole } from '../hooks/useConsole.js';

export const Console: React.FC = () => {
  const { logs } = useLog();
  const { isFocused } = useFocus();
  const { offset, setIsFocused, buffer, isFollow } = useConsole();
  useEffect(() => {
    setIsFocused(isFocused);
  }, [setIsFocused, isFocused]);
  const levelBgMap = new Map<Log['level'], string>([
    ['error', 'redBright'],
    ['info', 'whiteBright'],
    ['debug', '#818181'],
  ]);
  const linesMarkup = logs.slice(isFollow ? -1 * buffer : offset, Infinity)
    .slice(0, buffer)
    .map(({ msg, seq, time, level, app }, idx) => (
      <Text key={`${seq}-${idx}-${time}`} color={levelBgMap.get(level)}>{time} {level} [{app}] {msg}</Text>
    ));
  return (
    <Box flexGrow={1} flexDirection='column' minWidth={40} borderStyle={isFocused ? 'bold' : 'doubleSingle'} borderColor={isFocused ? 'white' : 'gray'}>
      {linesMarkup}
    </Box>
  );
};