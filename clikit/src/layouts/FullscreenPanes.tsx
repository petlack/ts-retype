import React from 'react';
import { Stack } from './Stack.js';
import { Layout } from './Layout.js';
import { Box } from 'ink';

export const FullscreenPanes: Layout = ({ children }) => {
  return (
    <Stack horizontal>
      {children.map((node, idx) => <Box width={`${(100/children.length).toFixed(1)}%`} key={idx}>{node}</Box>)}
    </Stack>
  );
};