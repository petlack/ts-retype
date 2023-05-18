
import React, { useState, useCallback } from 'react';
import { Log, LogContext, LogFn } from './useLog.js';

export type LogProviderProps = {
  children: JSX.Element;
  quiet?: boolean;
}

export function LogProvider({
  children,
  quiet,
}: LogProviderProps) {
  const [logs, setLogs] = useState<Log[]>([]);
  const log = useCallback<LogFn>((msg) => {
    const base = { level: 'debug' } as Log;
    const seq = logs.length;
    const time = new Date().getTime();
    const text = typeof msg === 'string' ? msg : msg.msg;
    const msgProps = typeof msg === 'string' ? {} : msg;
    const msgLines = text?.split('\n').map((line, idx) => ({ ...base, time, seq: seq + idx, ...msgProps, msg: line })) || [{ msg: text }];
    // eslint-disable-next-line no-console
    !quiet && console.log(msgLines.map(({ msg }) => msg).join('\n'));
    setLogs(prev => [...prev, ...msgLines]);
  }, [quiet]);

  return (
    <LogContext.Provider value={{ logs, log }}>
      {children}
    </LogContext.Provider>
  );
}
