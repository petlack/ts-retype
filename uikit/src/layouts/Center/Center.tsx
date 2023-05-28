import { FC } from 'react';
import { Box } from '~/components/Box';
import { StyledContainer } from '~/components/types';

export const Center: FC<StyledContainer> = ({ children }) => {
  return (
    <Box sx={{
      margin: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}>{children}</Box>
  );
};
