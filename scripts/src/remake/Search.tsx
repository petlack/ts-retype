import React from 'react';
import { Box, Text, useFocus } from 'ink';

export type SearchProps = {
  phrase: string;
  isSearchVisible: boolean;
}

export function Search({ phrase, isSearchVisible }: SearchProps) {
  const { isFocused } = useFocus();
  const isVisible = isSearchVisible || isFocused;
  const borderColor = isVisible ? '#808080' : '#313131';
  const borderStyle = 'single';
  const bg = isVisible ? '#212121' : '#080808';
  const fg = '#fff';
  return (
    <Box paddingLeft={1} paddingRight={1} alignItems='center' borderColor={borderColor} borderStyle={borderStyle}>
      <Text backgroundColor={bg} color={fg}>{phrase.padEnd(30, ' ')}</Text>
    </Box>
  );
}