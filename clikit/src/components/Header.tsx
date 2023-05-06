import React from 'react';
import { readFileSync } from 'fs';
import { Text, Box } from 'ink';
import BigText from 'ink-big-text';

const { version, name, repository, homepage } = JSON.parse(readFileSync('./package.json').toString());

function Links() {
  return (
    <Box flexDirection='column'>
      <Box flexDirection='row'>
        <Text>📖 Docs    </Text>
        <Text>{homepage.replace('https://', '')}</Text>
      </Box>
      <Box flexDirection='row'>
        <Text>📝 Github  </Text>
        <Text>{repository.url.replace('git+', '').replace('https://', '')}</Text>
      </Box>
    </Box>
  );
}

export function Header() {
  return (
    <Box flexDirection='column' gap={1} alignItems='flex-start'>
      <BigText text={name.split('/').at(-1)} font="tiny" space={false} />
      <Box flexDirection='row' justifyContent="center" gap={2} paddingLeft={2}>
        <Text>v{version}</Text>
      </Box>
      <Links />
    </Box>
  );
}