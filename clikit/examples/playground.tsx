import { useApp } from 'ink';
import { Box, Text, burn, snap, vanish } from '@ts-retype/clikit';
import React, { FC, useEffect, useState } from 'react';
import { range } from 'ramda';

const Static: FC = () => {
  return (
    <Box px={2} py={1} height={5}>
      <Text blue bg>Static text</Text>
    </Box>
  );
};

const Counter: FC<{ state: number }> = ({ state }) => {
  return (
    <Box px={2} py={0} height={2}>
      <Text blue bg>Count: {state}</Text>
    </Box>
  );
};

const AsyncCounter: FC<{ state: number }> = ({ state }) => {
  const [result, setResult] = useState('no result');
  const { exit } = useApp();
  useEffect(() => {
    setTimeout(() => {
      setResult('done ' + state);
      exit();
    }, 2000);
  }, [state, setResult]);
  return (
    <Box px={2} py={0} height={3} debug>
      <Text color='cyan'>Result:</Text>
      <Text bold>{result}</Text>
    </Box>
  );
};

async function run() {
  for (const state of range(0, 5)) {
    const output = snap(<Counter state={state} />);
    console.log(output);
  }
  for (const state of range(0, 5)) {
    try {
      const output = await burn(<AsyncCounter state={state} />, { discreet: true });
      console.log(output);
    } catch (e) {
      console.error(e);
    }
  }
  vanish(<Static />);
}

run();

vanish(<Static />);