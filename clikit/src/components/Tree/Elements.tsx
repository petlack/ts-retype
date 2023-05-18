import React from 'react';
import { Col } from '../../layouts/Col.js';
import { Text } from 'ink';
import { Renderable } from './types.js';

export const Ul: React.FC<Renderable> = ({ children, ...rest }) => (
  <Col {...rest}>{children}</Col>
);

export const Li: React.FC<Renderable> = ({ children, ...rest }) => (
  <Text {...rest}>{children}</Text>
);

export const Pass: React.FC<Renderable> = ({ children }) => <>{children}</>;
