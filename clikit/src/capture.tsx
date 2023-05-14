/* eslint-disable no-console */

import React from 'react';
import { render } from './render.js';

export function captureCallbackSync(callback: () => void, { muteOriginal }: { muteOriginal?: boolean } = {}): string {
  const originalConsoleLog = console.log;
  const originalStdoutWrite = process.stdout.write;

  let output = '';

  console.log = function (...args: any[]) {
    output += args.join(' ') + '\n';
    if (!muteOriginal) {
      originalConsoleLog.apply(console, args);
    }
  };

  process.stdout.write = function (chunk: any, encoding?: any, callback?: any): boolean {
    output += chunk.toString();
    return muteOriginal ? true : originalStdoutWrite.call(process.stdout, chunk, encoding, callback);
  };

  try {
    callback();
  } catch (err: any) {
    console.log('Function failed while capturing the output');
    console.log(err);
  } finally {
    console.log = originalConsoleLog;
    process.stdout.write = originalStdoutWrite;
  }

  return output;
}

export async function captureCallbackAsync(callback: () => void | Promise<void>, { muteOriginal }: { muteOriginal?: boolean } = {}): Promise<string> {
  const originalConsoleLog = console.log;
  const originalStdoutWrite = process.stdout.write;

  let output = '';

  console.log = function (...args: any[]) {
    output += args.join(' ') + '\n';
    if (!muteOriginal) {
      originalConsoleLog.apply(console, args);
    }
  };

  process.stdout.write = function (chunk: any, encoding?: any, callback?: any): boolean {
    output += chunk.toString();
    return muteOriginal ? true : originalStdoutWrite.call(process.stdout, chunk, encoding, callback);
  };

  try {
    await callback();
  } catch (err: any) {
    console.log('Function failed while capturing the output');
    console.log(err);
  } finally {
    console.log = originalConsoleLog;
    process.stdout.write = originalStdoutWrite;
  }

  return output;
}

export type CaptureOptions = {
  unmute?: boolean;
}

export async function capture<T extends Record<string, unknown>>(
  Element: React.FC<T>,
  props: T,
  { unmute }: CaptureOptions = {},
): Promise<string> {
  const markup = <Element {...props} />;
  const output = await captureCallbackAsync(async () => {
    const instance = render(markup);
    instance.rerender(markup);
    // instance.unmount();
    // await instance.waitUntilExit();
  }, { muteOriginal: !unmute });
  // await instance.waitUntilExit();
  return output;
}

