import { Flex, Text } from '@theme-ui/components';
import { Box } from '~/components/Box';

export function Logo({ name }: { name: string }) {
  return (
    <Flex>
      <Box
        tx={{
          colorScheme: 'primary',
          fill: 'solid',
          sizing: 'md',
          corners: 'dull',
        }}
        sx={{
          aspectRatio: 1,
          display: 'flex',
          minWidth: 'unset',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          lineHeight: 1,
          p: 1,
        }}>
        <Text sx={{ fontWeight: 'black' }}>TS</Text>
      </Box>
      <Box tx={{
        colorScheme: 'primary',
        fill: 'ghost',
        size: 'md',
      }} sx={{
        display: 'flex',
        alignSelf: 'flex-end',
        lineHeight: 1,
        p: 1,
      }}>
        <Text sx={{ fontWeight: 'bold' }}>{name}</Text>
      </Box>
    </Flex >
  );
}
