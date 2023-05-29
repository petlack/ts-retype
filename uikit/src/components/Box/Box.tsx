import { ComponentPropsWithRef, forwardRef } from 'react';
import { Box as UiBox, BoxOwnProps as UiBoxOwnProps } from 'theme-ui';
import { TermixProps, TermixPropsNames } from '~/termix/types';
import { Assign } from '~/components/types';
import { omit } from 'ramda';
import { useTermix } from '~/termix/useTermix';
import { useTermixStyle } from '~/termix/termix';

export type BoxOwnProps = TermixProps & Omit<UiBoxOwnProps, 'size'>
export type BoxProps = Omit<
  Assign<ComponentPropsWithRef<'div'>, BoxOwnProps>,
  'ref'
>

export const Box = forwardRef<unknown, BoxProps>(({
  children,
  as,
  sx,
  ...boxProps
}, ref) => {
  const { theme } = useTermix();
  const styles = useTermixStyle(theme, boxProps);
  const mergedSx = {
    ...styles,
    ...sx,
  };
  return (
    <UiBox ref={ref} as={as} sx={mergedSx} {...omit(TermixPropsNames, boxProps)}>
      {children}
    </UiBox>
  );
});

