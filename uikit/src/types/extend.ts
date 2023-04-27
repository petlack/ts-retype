import { Standard } from './standard';
import { Theme } from './theme';

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

function mergePartial<T>(base: T, partial: RecursivePartial<T>): T {
  return Object.keys(partial).reduce(
    (merged, key) => {
      if (typeof partial[key as keyof T] === 'object' && typeof base[key as keyof T] === 'object') {
        merged[key as keyof T] = mergePartial(
          base[key as keyof T],
          partial[key as keyof T] as RecursivePartial<T[keyof T]>,
        );
      } else {
        merged[key as keyof T] = partial[key as keyof T] as T[keyof T];
      }
      return merged;
    },
    { ...base },
  );
}

export function extendStandard(partial: RecursivePartial<Theme>): Theme {
  return mergePartial(Standard, partial);
}

export function extendTheme(partial: RecursivePartial<Theme>, full: Theme): Theme {
  return mergePartial(full, partial);
}
