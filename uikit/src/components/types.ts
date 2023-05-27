import { PropsWithChildren } from 'react';
import { ThemeUIStyleObject } from 'theme-ui';

export type Style = ThemeUIStyleObject;
export type StyledComponent<T = Record<string, unknown>> = T & {
  variant?: string;
  sx?: Style;
  _css?: Style;
};
export type StyledContainer<T = Record<string, unknown>> = PropsWithChildren<StyledComponent<T>>;
