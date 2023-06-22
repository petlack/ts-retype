import { forwardRef } from 'react';
import { Box, BoxOwnProps } from '~/components/Box';
import { useTermix, termix } from '~/termix';
import type { Mix } from '~/termix/tx';

export type CardOwnProps = BoxOwnProps;
export type CardProps = Mix<'div'>;

export const Card = forwardRef<unknown, CardProps>(({
  sx,
  tx,
  ...boxProps
}, ref) => {
  const { theme } = useTermix();
  const styles = termix(theme, tx, 'card');
  const mergedSx = {
    ...styles,
    ...sx,
  };
  return (
    <Box ref={ref} tx={tx} sx={mergedSx} {...boxProps} />
  );
});


