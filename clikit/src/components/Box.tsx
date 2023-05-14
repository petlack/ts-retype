import React, { FC, PropsWithChildren } from 'react';
import { Box as InkBox } from 'ink';
import { StyledProps, UnstyledProps, BoxProps, applyStyle } from '../layouts/block.js';

export const Box: FC<PropsWithChildren & UnstyledProps & StyledProps & Partial<BoxProps>> = ({ children, ...unstyledProps }) => {
  const appliedStyles = applyStyle(unstyledProps);
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <InkBox {...appliedStyles}>{children}</InkBox>
  );
};