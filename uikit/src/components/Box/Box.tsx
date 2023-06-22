import { forwardRef } from 'react';
import { Box as UiBox, BoxOwnProps as UiBoxOwnProps } from 'theme-ui';
import { termix } from '~/termix/termix';
import { useTermix } from '~/termix/useTermix';
import type { Mix } from '~/termix/tx';

export type BoxOwnProps = UiBoxOwnProps;
export type BoxProps = Mix<'div'>;

export const Box = forwardRef<unknown, BoxProps>(({
  element,
  sx,
  tx,
  ...boxProps
}, ref) => {
  const { theme } = useTermix();
  const styles = termix(theme, tx, element);
  const mergedSx = {
    ...styles,
    ...sx,
  };
  return (
    <UiBox ref={ref} sx={mergedSx} {...boxProps} />
  );
});


