import { Flex, Text } from '@theme-ui/components';
import { Box } from 'components/Box';

export function Logo({ name }: { name: string }) {
  return (
    <Flex>
      <Box colorScheme='primary' fill='solid' sx={{
        aspectRatio: 1,
        fontSize: 'sm',
        width: '32px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        lineHeight: 1,
        p: 1,
      }}>
        <Text sx={{ fontWeight: 'black' }}>TS</Text>
      </Box>
      <Box colorScheme='primary' fill='ghost' sx={{
        display: 'flex',
        alignSelf: 'flex-end',
        lineHeight: 1,
        p: 1,
      }}>
        <Text sx={{ fontWeight: 'bold' }}>{name}</Text>
      </Box>
    </Flex>
  );
}
