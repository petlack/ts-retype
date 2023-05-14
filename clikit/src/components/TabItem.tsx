import React, { FC, PropsWithChildren } from 'react';
import { Text } from './Text.js';
import { StyledProps, UnstyledProps } from '../layouts/block.js';

export type TabItemProps = {
  selected?: boolean;
}

export const TabItem: FC<PropsWithChildren & UnstyledProps & StyledProps & TabItemProps> = ({ children, selected }) => {
  const textProps: UnstyledProps = {
    bg: true,
    black: !selected,
    green: selected,
  };
  return (
    <Text {...textProps}> {children} </Text>
  );
};
