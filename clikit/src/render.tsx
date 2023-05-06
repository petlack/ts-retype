import React, { ReactElement } from 'react';
import { Instance, render as inkRender } from 'ink';
import { LogProvider } from './providers/log.js';
import { WriteStream } from './tty.js';
import { ExitProvider } from './providers/exit.js';
import { ConsoleProvider } from './providers/console.js';
import { KeymapProvider } from './providers/keymap.js';
import { ConfigProvider } from './providers/config.js';

export type RenderOptions<T> = {
  noUi?: boolean;
  noLog?: boolean;
  forceLog?: boolean;
  forceUi?: boolean;
  unmount?: boolean;
  flags?: Partial<T>,
}

export function render<T>(
  markup: ReactElement,
  { forceLog, forceUi, noLog, flags = {} }: RenderOptions<T> = {},
) {

  const nowhere = WriteStream();
  const hideUiProps = { stdout: nowhere, stderr: nowhere, patchConsole: false };
  const renderUiProps = {};

  const isTTY = process.stdout.isTTY;
  const hasUi = isTTY || forceUi;
  
  const quiet = noLog || isTTY && !forceLog;
  const inkRenderProps = hasUi ? renderUiProps : hideUiProps;

  const instanceMarkup = hasUi ? (
    <KeymapProvider bindings={[]}>
      <ExitProvider>
        <ConsoleProvider buffer={20}>
          {markup}
        </ConsoleProvider>
      </ExitProvider>
    </KeymapProvider>
  ) : markup;

  const instance = inkRender((
    <ConfigProvider config={flags}>
      <LogProvider quiet={quiet}>
        {instanceMarkup}
      </LogProvider>
    </ConfigProvider>
  ), inkRenderProps);
  
  return instance;
}

export type StoryProps<T> = {
  markup: JSX.Element;
  options?: RenderOptions<T>;
}
export async function story<T>(stories: StoryProps<T>[]) {
  let last: Instance | null = null;
  const isTTY = process.stdout.isTTY;

  for (const { markup, options, idx } of stories.map((story, idx) => ({ ...story, idx }))) {
    try {
      last = render(markup, options);
      
      if (idx === stories.length - 1) {
        await last.waitUntilExit();
      }
      if (idx < stories.length - 1 || isTTY) {
        last.unmount();
      }
    } catch (e: any) {
      console.log('error');
      console.error(e);
      process.exit(1);
    }
  }
  process.exit(0);
}