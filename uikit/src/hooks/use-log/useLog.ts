import { createContext, useCallback, useContext } from 'react';

export type Log = {
  seq?: number;
  level?: 'debug' | 'info' | 'warn' | 'error';
  time?: number;
  app?: string;
  msg?: string;
};

export type LogFn = (msg: Log | string) => void;

export type LogContextValue = {
  logs: Log[];
  log: LogFn;
};

export const LogContext = createContext<LogContextValue>({
  logs: [],
  log: () => {
    /* */
  },
});

export type UseLogOptions = {
  mute: boolean;
};

function filterFalsy(obj: any): any {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => (typeof v === 'string' && v) || v),
  );
}

export function useLog(app?: string, level?: Log['level']) {
  const { log, logs } = useContext(LogContext);
  const tailored = useCallback<LogFn>(
    (msg) => {
      if (typeof msg === 'string') {
        log({ ...filterFalsy({ app, level }), msg });
      } else {
        log({ ...filterFalsy({ app, level }), ...msg });
      }
    },
    [log],
  );
  return { log: tailored, logs };
}
