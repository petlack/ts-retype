import { forwardRef } from 'react';
import { Box, BoxOwnProps } from '~/components/Box';
import { useTermix } from '~/termix/useTermix';
import { termix } from '~/termix/termix';
import type { Mix } from '~/termix/tx';

export type StackOwnProps = BoxOwnProps & {
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
}
export type StackProps = Mix<'div', StackOwnProps>;

export const Stack = forwardRef<HTMLDivElement, StackProps>(({
  sx,
  tx,
  direction,
  align,
  ...boxProps
}, ref) => {
  const flexDirection: 'row' | 'column' = direction === 'row' ? 'row' : 'column';
  const alignItems = align && {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: undefined,
  }[align];
  const { theme } = useTermix();
  const styles = termix(theme, tx);
  const mergedSx = {
    display: 'flex',
    flexDirection,
    alignItems,
    ...styles,
    ...sx,
  };
  return (
    <Box ref={ref} tx={tx} sx={mergedSx} {...boxProps} />
  );
});

