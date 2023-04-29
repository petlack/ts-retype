import { TypeDuplicate, Metadata } from '@ts-retype/retype/src/types';

declare global {
  interface Window {
    __data__: TypeDuplicate[];
    __meta__: Metadata;
  }
}

export async function setupData() {
  if (import.meta.env.DEV) {
    const json = await import('./data.json');
    const { data, meta } = json.default;
    console.log({ data });
    console.log({ meta });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.__data__ = <TypeDuplicate>data;
    window.__meta__ = <Metadata>meta;
  } else {
    window.__data__ = [];
    window.__meta__ = {} as Metadata;
  }
}
