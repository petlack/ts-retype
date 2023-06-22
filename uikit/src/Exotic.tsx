import { forwardRef } from 'react';
import { Box as UiBox } from 'theme-ui';
import { useTermix, termix } from './termix';
import type { Mix } from './termix/tx';

export type ExoticProps = Mix<'div'>;

export const Exotic = forwardRef<unknown, ExoticProps>(({
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

