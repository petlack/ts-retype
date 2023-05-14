import React, { FC, PropsWithChildren } from 'react';
import { Col } from './Col.js';
import { useDimensions } from '../hooks/useDimensions.js';

export const Fullscreen: FC<PropsWithChildren> = ({ children }) => {
  const [width, height] = useDimensions();
  return (
    <Col width={width} height={height}>{children}</Col>
  );
};