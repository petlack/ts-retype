import React, { ReactElement } from 'react';
import { render as inkRender } from 'ink';
import { WriteStream } from './tty.js';
import { ExitProvider } from './providers/exit.js';
import { KeymapProvider } from './providers/keymap.js';

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
  { forceUi }: RenderOptions<T> = {},
) {

  const nowhere = WriteStream();
  const hideUiProps = { stdout: nowhere, stderr: nowhere, patchConsole: false };
  const renderUiProps = {};

  const isTTY = process.stdout.isTTY;
  const hasUi = isTTY || forceUi;

  const inkRenderProps = hasUi ? renderUiProps : hideUiProps;

  const instanceMarkup = hasUi ? (
    <KeymapProvider bindings={[]}>
      <ExitProvider>
        {markup}
      </ExitProvider>
    </KeymapProvider>
  ) : markup;

  const instance = inkRender(instanceMarkup, inkRenderProps);

  return instance;
}
