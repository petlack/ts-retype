import React, { FC } from 'react';
import { create } from 'zustand';
import { render } from './render.js';

type Updater<S> = (...args: any[]) => (state: S) => S
type VoidActions<T extends Record<string, Updater<any>>> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => void;
};

export function seize(
  Component: FC,
  options: LatchOptions = { discreet: false },
): () => void {
  const markup = <Component />;
  const finish = () => {
    instance.unmount();
    //await instance.waitUntilExit();
  };
  if (options.discreet) { /**/ }
  const instance = render(markup);
  return finish;
}

type LatchOptions = {
  discreet?: boolean;
}

type ManageActions<State> = {
  finish: () => void;
  getState: () => State;
}

export type UseStore<State> = <T>(selector: (s: State) => T) => T

export type Latchable<State> = { useStore: UseStore<State> };

export function latch<State, ActionsType extends Record<string, Updater<State>>>(
  Component: FC<Latchable<State>>,
  actionsDefinition: ActionsType,
  initialState: State,
  options: LatchOptions = { discreet: false },
): VoidActions<ActionsType> & ManageActions<State> {
  const voidActions: VoidActions<ActionsType> = {} as any;
  const actionNames = Object.keys(actionsDefinition);

  // const { store, mutate } = createStore(initialState);

  const useStore = create<State>((set) => {
    for (const actionName of actionNames) {
      const actionFn = (actionsDefinition as any)[actionName];
      (voidActions as any)[actionName] = (...args: any[]) => {
        const updater = actionFn(...args);
        set(updater);
      };
    }
    return {
      ...initialState,
      ...voidActions,
      // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
      // removeAllBears: () => set({ bears: 0 }),
    };
  });

  function Abridged() {
    // const state = useSyncExternalStore<State>(store.subscribe, store.getSnapshot);
    // console.error('rerender');
    // return <Component state={state} />;
    return <Component useStore={useStore} />;
  }

  const finish = seize(Abridged, options);
  const actions = {
    ...voidActions,
    finish,
    // getState: store.getSnapshot,
    getState: () => useStore.getState(),
  };
  return actions;
}
