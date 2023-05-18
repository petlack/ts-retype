import { Reducer, useMemo, useReducer } from 'react';

type Action = {
  type: string;
  payload?: never;
};

export type CreateActions<State, Actions> = (state: State) => {
  [P in keyof Actions]: (payload?: never) => State;
};

type BoundActions<Actions> = {
  [P in keyof Actions]: (...payload: never) => void;
};

export const useActions = <State, Actions>(
  createActions: CreateActions<State, Actions>,
  initialState: State,
): [State, BoundActions<Actions>] => {
  const reducer = useMemo<Reducer<State, Action>>(
    () => (reducerState: State, action: Action) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return createActions(reducerState)[action.type](...action.payload);
    },
    [createActions],
  );

  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState);

  const wrappedActions: BoundActions<Actions> = useMemo(() => {
    const actionTypes = Object.keys(createActions(initialState));

    return actionTypes.reduce((acc, type) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      acc[type] = (...payload) => dispatch({ type, payload });
      return acc;
    }, {} as BoundActions<Actions>);
  }, [createActions, initialState]);

  return [state, wrappedActions];
};
