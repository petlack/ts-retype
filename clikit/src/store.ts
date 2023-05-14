type Transform<S> = (s: S) => S;

export interface IStore<T> {
  subscribe(callback: () => void): () => void;
  getSnapshot(): T;
}

export function createStore<T>(initialState: T) {
  let state = initialState;
  let listeners: (() => void)[] = [];

  const store: IStore<T> = {
    subscribe(listener: () => void) {
      listeners = [...listeners, listener];
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    getSnapshot() {
      return state;
    },
  };

  function mutate(mapper: Transform<T>) {
    state = mapper(state);
    for (const listener of listeners) {
      listener();
    }
  }

  return { store, mutate };
}
