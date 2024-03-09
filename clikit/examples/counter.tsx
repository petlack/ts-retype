import React, { FC } from 'react';
import { Fullscreen, Latchable, Stack, Text, latch } from '@ts-retype/clikit';

async function run() {
  for (const i of [...Array(10).keys()]) {
    actions.increase(i);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

let calls = 0;
const Counter: FC<Latchable<number>> = ({ useStore }) => {
  const state = useStore(s => s);
  calls += 1;
  return (
    <Fullscreen>
      <Stack vertical px={2} py={1}>
        <Text blue bg>Count: {state}</Text>
        <Text>Function calls: {calls}</Text>
      </Stack>
    </Fullscreen>
  );
};

const initialState = 0;
const actionsDefinition = {
  increase: (by = 1) => (state: number) => state + by,
  decrease: (by = 1) => (state: number) => state - by,
  reset: () => () => 0,
};

const actions = latch<number, typeof actionsDefinition>(Counter, actionsDefinition, initialState);

run().then(() => {
  actions.finish();
  console.log('Total calls', calls);
});
