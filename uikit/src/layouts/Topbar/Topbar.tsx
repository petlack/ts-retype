import { FC } from 'react';
import { Flex, Box } from '@theme-ui/components';
import { StyledComponent } from '~/components/types';

export type TopbarProps = {
  children: [JSX.Element, JSX.Element];
}

export const Topbar: FC<TopbarProps & StyledComponent> = ({ children, sx }) => {
  return (
    <Flex sx={{
      display: 'flex',
      flexDirection: 'column',
      ...sx,
    }}>
      <Box sx={{
        height: 3,
        bg: 'primary',
      }}></Box>
      <Box sx={{
        borderBottom: '1px solid',
        borderColor: 'surface0',
      }}>{children[0]}</Box>
      <Flex sx={{
        flex: 1,
      }}>{children[1]}</Flex>
    </Flex>
  );
};
