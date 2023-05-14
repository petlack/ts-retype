import { ReactElement } from 'react';

import { captureCallbackAsync, captureCallbackSync } from './capture.js';
import { render } from './render.js';

export type SnapOptions = {
  discreet?: boolean;
};

export function snap(markup: ReactElement, { discreet }: SnapOptions = {}): string {
  const output = captureCallbackSync(
    () => {
      vanish(markup);
    },
    { muteOriginal: discreet },
  );
  return output;
}

export async function burn(markup: ReactElement, { discreet }: SnapOptions = {}): Promise<string> {
  const output = await captureCallbackAsync(
    async () => {
      await elapse(markup);
    },
    { muteOriginal: discreet },
  );
  return output;
}

export function vanish(markup: ReactElement): void {
  const instance = render(markup);
  instance.unmount();
}

export async function elapse(markup: ReactElement): Promise<void> {
  const instance = render(markup);
  await instance.waitUntilExit();
}
