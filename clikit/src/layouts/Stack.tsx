import React, { FC, PropsWithChildren } from 'react';
import { Box } from '../components/Box.js';
import { StyledProps, UnstyledProps, BoxProps, applyStyle } from '../layouts/block.js';

export type StackProps = {
  direction?: 'row' | 'column';
  horizontal?: boolean;
  vertical?: boolean;
}

export const Stack: FC<PropsWithChildren & UnstyledProps & StyledProps & Partial<BoxProps> & StackProps> = ({
  children,
  direction,
  horizontal,
  vertical,
  ...unstyledProps
}) => {
  const appliedStyles = applyStyle(unstyledProps);
  const flexDirection: StackProps['direction'] = direction || (horizontal ? 'row' : vertical ? 'column' : 'column');
  return (
    <Box {...appliedStyles} flexDirection={flexDirection}>{children}</Box>
  );
};
