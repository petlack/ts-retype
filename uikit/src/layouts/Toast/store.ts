import { always, append, evolve, prepend } from 'ramda';

export type ToastMessage = {
  msg: string;
  kind?: 'success' | 'error' | 'info';
};

export type ToastRecord = ToastMessage & {
  id: number;
  createdAt: number;
  lifetime: number;
};

export type ToastsState = {
  toasts: ToastRecord[];
};

const now = () => new Date().getTime();

const initialState: ToastsState = {
  toasts: [],
};

function createStore() {
  let state = initialState;
  let nextId = 0;
  const listeners = new Set<() => void>();
  let timeouts: NodeJS.Timeout[] = [];
  const setState = (setStateFn: (values: ToastsState) => ToastsState) => {
    state = setStateFn(state);
    listeners.forEach((l) => l());
  };

  function removeAfter(toast: ToastRecord) {
    const handle = setTimeout(() => {
      store.remove(toast.id);
      timeouts = timeouts.filter((tout) => tout !== handle);
    }, toast.lifetime);
    timeouts.push(handle);
    return handle;
  }

  function clearTimeouts() {
    timeouts.forEach((tout) => clearTimeout(tout));
  }

  return {
    getState: () => state,

    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        setState(always(initialState));
        listeners.delete(listener);
        clearTimeouts();
      };
    },

    add: (toast: ToastMessage) => {
      const record = { ...toast, lifetime: 5_000, createdAt: now(), id: nextId++ };
      setState(
        evolve({
          toasts: append(record),
        }),
      );
      removeAfter(record);
    },

    clear: () => {
      setState(always(initialState));
    },

    undo: () => {
      setState(evolve({ toasts: (toasts) => toasts.slice(1, Infinity) }));
    },

    prune: () => {
      const nowMs = now();
      setState(
        evolve({
          toasts: (toasts: ToastsState['toasts']) =>
            toasts.filter(({ createdAt, lifetime }) => nowMs - createdAt < lifetime),
        }),
      );
    },

    remove: (id: number) => {
      setState(
        evolve({
          toasts: (toasts: ToastsState['toasts']) => toasts.filter((toast) => toast.id !== id),
        }),
      );
    },
  };
}

export const store = createStore();
