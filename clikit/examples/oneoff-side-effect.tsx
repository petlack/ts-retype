/* eslint-disable no-console */
import React, { FC } from 'react';
import { Box, Text, elapse, vanish } from '@ts-retype/clikit';

const Counter: FC<{ state: number }> = ({ state }) => {
  return (
    <Box px={2} py={1} height={5}>
      <Text blue bg>Count: {state}</Text>
    </Box>
  );
};

async function run() {
  vanish(<Counter state={42} />);
  console.log('before');
  await elapse(<Counter state={64} />);
  console.log('after');
}

run();

// expect nothing to be printed and keeps waiting
