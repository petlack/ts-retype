import { forwardRef } from 'react';
import { Box, BoxOwnProps } from '~/components/Box';
import { useTermix, termix } from '~/termix';
import type { Mix } from '~/termix/tx';

export type TagOwnProps = BoxOwnProps;
export type TagProps = Mix<'div'>;

export const Tag = forwardRef<HTMLDivElement, TagProps>(({
  sx,
  tx,
  ...boxProps
}, ref) => {
  const { theme } = useTermix();
  const styles = termix(theme, tx, 'tag');
  const mergedSx = {
    ...styles,
    ...sx,
  };
  return (
    <Box ref={ref} tx={tx} sx={mergedSx} {...boxProps} />
  );
});

