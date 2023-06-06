import { ComponentPropsWithRef, forwardRef } from 'react';
import { Box as UiBox, BoxOwnProps as UiBoxOwnProps } from 'theme-ui';
import { useTermix, termix } from './termix';
import { Assign } from './components/types';
import { TermixProps } from './termix/tx';

export type ExoticOwnProps = TermixProps & Omit<UiBoxOwnProps, 'size'>;
export type ExoticProps = Omit<
  Assign<ComponentPropsWithRef<'div'>, ExoticOwnProps>,
  'ref'
>

export const Exotic = forwardRef<unknown, ExoticProps>(({
  children,
  as,
  element,
  // flex,
  sx,
  tx,
  ...boxProps
}, ref) => {
  const { theme } = useTermix();
  const styles = termix(theme, tx, element);
  const mergedSx = {
    // ...(flex ? { display: 'flex' } : {}),
    ...styles,
    ...sx,
  };
  return (
    <UiBox ref={ref} as={as} sx={mergedSx} {...boxProps}>
      {children}
    </UiBox>
  );
});

