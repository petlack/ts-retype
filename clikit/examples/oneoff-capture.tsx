/* eslint-disable no-console */
import React, { FC } from 'react';
import { Box, Text, snap } from '@ts-retype/clikit';

const Counter: FC<{ state: number }> = ({ state }) => {
  return (
    <Box px={2} py={1} height={5}>
      <Text blue bg>Count: {state}</Text>
    </Box>
  );
};

async function run() {
  console.log('before');
  const result = snap(<Counter state={0} />);
  console.log('after');
  console.log(result);
}

run();

// expect Count: 0 to be printed and exited
