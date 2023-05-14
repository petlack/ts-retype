import React, { FC, PropsWithChildren } from 'react';
import { Box } from 'ink';
import { StyledProps, UnstyledProps, applyStyle } from './block.js';

export const Col: FC<PropsWithChildren<UnstyledProps & StyledProps>> = ({children, ...unstyle}) => {
  const appliedStyle = applyStyle(unstyle);
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Box flexDirection='column' {...appliedStyle}>
      {children}
    </Box>
  );
};

