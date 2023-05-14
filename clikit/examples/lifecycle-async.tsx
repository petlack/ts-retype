import React, { FC, useEffect, useState } from 'react';
import { Box, Text, elapse } from '@ts-retype/clikit';
import { useApp } from 'ink';

const Counter: FC = () => {
  const [result, setResult] = useState('no result');
  const { exit } = useApp();
  useEffect(() => {
    setTimeout(() => {
      setResult('done');
      exit();
    }, 2000);
  }, [setResult]);
  return (
    <Box px={2} py={1} height={5} debug>
      <Text color='cyan'>Result:</Text>
      <Text bold>{result}</Text>
    </Box>
  );
};

async function run() {
  await elapse(<Counter />);
}

run();

// expect Result: no result to be printed, after 2 seconds changed to Result: ok and exit
