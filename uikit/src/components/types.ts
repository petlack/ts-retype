import { PropsWithChildren } from 'react';
import { ThemeUIStyleObject } from 'theme-ui';

export type Assign<T, U> = {
  [P in keyof (T & U)]: P extends keyof T ? T[P] : P extends keyof U ? U[P] : never;
};

export type ForwardRef<T, P> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
>;
export type Style = ThemeUIStyleObject;
export type StyledComponent<T = Record<string, unknown>> = T & {
  variant?: string;
  as?: React.ElementType;
  type?: string;
  sx?: Style;
  _css?: Style;
};
export type StyledContainer<T = Record<string, unknown>> = PropsWithChildren<StyledComponent<T>>;
