import { Data } from './types';

declare global {
  interface Window {
    __data__: Data[];
  }
}

export async function setupData() {
  if (import.meta.env.DEV) {
    const json = await import('./data.json');
    const data = json.default;
    console.log({ data });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.__data__ = <Data>data;
  } else {
    window.__data__ = [];
  }
}
