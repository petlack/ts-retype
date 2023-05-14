import React from 'react';
import { Col } from '../Col.js';
import { Text } from 'ink/build';
import { Renderable } from './types.js';

export const Ul: React.FC<Renderable> = ({ children, ...rest }) => (
  <Col {...rest}>{children}</Col>
);

export const Li: React.FC<Renderable> = ({ children, ...rest }) => (
  <Text {...rest}>{children}</Text>
);

export const Pass: React.FC<Renderable> = ({ children }) => <>{children}</>;
