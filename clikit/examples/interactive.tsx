import React, { FC, useCallback, useState } from 'react';
import { Box, Text, elapse, useKeymap } from '@ts-retype/clikit';
import { Key } from 'ink';

const Interactive: FC = () => {
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const handleKey = useCallback((_input: string, key: Key) => {
    if (key.downArrow) { setPosition(([x, y]) => [x, y + 1]); }
    if (key.upArrow) { setPosition(([x, y]) => [x, y - 1]); }
    if (key.leftArrow) { setPosition(([x, y]) => [x - 1, y]); }
    if (key.rightArrow) { setPosition(([x, y]) => [x + 1, y]); }
  }, [setPosition]);
  useKeymap(handleKey);
  return (
    <Box px={position[0]} py={position[1]} height={5}>
      <Text black bg>{position[0]} {position[1]}</Text>
    </Box>
  );
};

async function run() {
  console.log('before');
  elapse(<Interactive />);
  console.log('after');
}

run();

// expect blue dot to be shown and moved when arrow keys are pressed. exits on esc key, or ctrl+c
