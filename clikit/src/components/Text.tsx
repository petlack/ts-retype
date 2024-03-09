import React, { FC, PropsWithChildren } from 'react';
import { Text as InkText, TextProps as InkTextProps } from 'ink';
import { StyledProps, UnstyledProps, applyStyle } from '../layouts/block.js';

export type TextProps = UnstyledProps & StyledProps & Partial<InkTextProps>;

export const Text: FC<PropsWithChildren & TextProps> = ({ children, ...unstyledProps }) => {
  const appliedStyles = applyStyle(unstyledProps);
  return (
    <InkText {...appliedStyles}>{children}</InkText>
  );
};
