import { useState, useRef, useCallback, useEffect } from 'react';
import { useTiming } from './useTiming.js';
import { useLog } from './useLog.js';
import { ExecResult } from '@ts-retype/scripts/dist/exec.js';

export type StepResult<T> = ExecResult & {
  status: 'done' | 'fail';
  error?: unknown;
  step: T;
};

export type TaskUpdate<TaskId> = {
  step: TaskId;
  progress: number;
  res: StepResult<TaskId>;
};
export type TaskResult<TaskId> = {
  step: TaskId;
  status: 'queued' | 'pending' | 'done' | 'fail';
};
export type Callback<TaskId> = (payload: TaskUpdate<TaskId>) => void;
export type Resolvable<Value> = Value | Promise<Value>;

export const asyncify = <T>(fn: () => T) =>
  new Promise<T>((resolve) => {
    setImmediate(() => resolve(fn()));
  });

function toPromise<T>(value: T | Promise<T>): Promise<T> {
  if (value instanceof Promise) {
    return value;
  }
  return asyncify(() => value);
}

export function useTask<TaskInput, TaskId, TaskOutput>(
  items: TaskInput[],
  task: (
    items: TaskInput[],
    callback?: Callback<TaskId>,
    log?: (msg: any) => void,
  ) => Resolvable<void>,
) {
  const [value, setValue] = useState<TaskOutput | undefined>();
  const [state, setState] = useState<TaskResult<TaskId>['status']>('queued');
  const [error, setError] = useState<unknown>();
  const { tick, timing } = useTiming();
  const { log } = useLog('task');

  useEffect(() => log('created'), []);
  useEffect(() => log('items changed'), [items]);

  const promise = useRef<Promise<void>>();

  const callback = useCallback<Callback<TaskId>>(
    ({ progress }) => {
      tick(progress);
    },
    [tick],
  );

  const onResolve = useCallback(() => {
    setState('done');
  }, [setState]);

  const onError = useCallback(
    (err: unknown) => {
      setState('fail');
      setError(err);
    },
    [setState, setError],
  );

  useEffect(() => {
    log('resetting');
    if (promise.current) {
      promise.current = undefined;
    }
    get();
  }, [items]);

  const get = useCallback((): TaskOutput | undefined => {
    if (!promise.current) {
      promise.current = toPromise(task(items, callback, log));
      promise.current.then(onResolve).catch(onError);
      setState('pending');
      return undefined;
    }

    switch (state) {
      case 'pending':
        return undefined;
      case 'done':
        return value;
      case 'fail':
      case 'queued':
        return undefined;
    }
  }, [items, promise, state, setState, onResolve, onError]);

  return { get, error, value, state, timing };
}
