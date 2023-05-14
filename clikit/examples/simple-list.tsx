/* eslint-disable no-console */
import { Text } from 'ink';
import { Stack, snap } from '@ts-retype/clikit';
import React from 'react';

function List<T>({ items }: { items: T[] }) {
  return (
    <Stack>
      {items.map((item, idx) => <Text key={idx}>{item?.toString()}</Text>)}
    </Stack>
  );
}

async function run() {
  let output = '';
  output = snap(<List items={['Hello', 'World']} />);
  console.log(output);
}

run();
