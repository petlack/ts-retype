import React, { FC } from 'react';
import BigText from 'ink-big-text';

export const Heading: FC<{ children: string }> = ({ children }) => {
  return (
    <BigText text={children} font="tiny" space={false} />
  );
};