import React, { FC } from 'react';
import { Text } from 'ink';
import { Latchable, latch } from '@ts-retype/clikit';
import { Col } from '@ts-retype/clikit';

type Todo = { id: number; text: string };
type State = Todo[];

const List: FC<Latchable<State>> = ({ useStore }) => {
  const state = useStore(state => state);
  return (
    <Col>
      {state.slice(-3).map((item, idx) => <Text key={idx}>{item.text}</Text>)}
    </Col>
  );
};

const initialState: State = [];
const actionsDefinition = {
  add: (todo: Todo) => (state: State) => [...state, todo],
  reset: () => () => initialState,
};

async function run() {
  const actions = latch<State, typeof actionsDefinition>(List, actionsDefinition, initialState);

  for (const i of [...Array(20).keys()]) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    actions.add({ id: i, text: 'Todo #' + i });
  }

  actions.finish();
}

run();
