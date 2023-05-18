import { Flex } from '@theme-ui/components';
import { FC, PropsWithChildren } from 'react';

export const Fullscreen: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Flex
      sx={{
        width: '100vw',
        height: '100vh',
      }}
    >
      {children}
    </Flex>
  );
};
