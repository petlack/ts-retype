import { Flex } from '@theme-ui/components';
import { StyledContainer } from 'components/types';
import { FC } from 'react';

export const Wrap: FC<StyledContainer> = ({ children, sx }) => {
  return (
    <Flex sx={{ flexFlow: 'row wrap', alignItems: 'center', gap: 4, ...sx }}>
      {children}
    </Flex>
  );
};
