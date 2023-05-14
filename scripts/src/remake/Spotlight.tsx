import { Box, Key, Text } from 'ink';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Search } from './Search.js';
import { Pipeline, Step, steps, pipelines } from '../config.js';
import { toEnumValue, enumToString } from '../utils/enums.js';
import { useConfig, useKeymap, useSearch } from '@ts-retype/clikit';

export type SpotlightProps = {
  bg?: string;
  bgSelected?: string;
  width: number;
}

type SearchData = { id: string, label: string, type: 'step' | 'pipeline' };

export const Spotlight: FC<SpotlightProps> = ({ width, bg = '#132128', bgSelected = '#458bab' }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [selectedResultIdx, setSelectedResultIdx] = useState(-1);
  const { setConfig } = useConfig();
  const { results, setQuery, reindex } = useSearch<SearchData>(phrase);

  const setSelectedResult = useCallback((result: SearchData) => {
    const pipeline = toEnumValue(Pipeline, result.label);
    const step = toEnumValue(Step, result.label);
    setConfig(prev => ({
      ...prev,
      step,
      pipeline,
    }));
  }, [setConfig]);

  const handleInput = useCallback((input: string, key: Key) => {
    if (input === ':') {
      setIsSearchVisible(true);
      return;
    }
    if (!isSearchVisible) {
      return;
    }
    if (key.return) {
      if (selectedResultIdx >= 0) {
        const selectedResult = results[selectedResultIdx];
        selectedResult && setSelectedResult(selectedResult);
      }
      setIsSearchVisible(false);
    } else if (key.backspace || key.delete) {
      if (phrase.length === 0) {
        setIsSearchVisible(false);
      } else {
        setPhrase(prev => prev.slice(0, -1));
      }
    } else if (key.downArrow) {
      setSelectedResultIdx(prev => Math.min(prev + 1, results.length));
    } else if (key.upArrow) {
      setSelectedResultIdx(prev => Math.max(prev - 1, -1));
    }
    else if (key.leftArrow || key.rightArrow) {
      setSelectedResultIdx(-1);
    } else {
      setPhrase(prev => prev + input);
    }
  }, [isSearchVisible, results, setIsSearchVisible, setPhrase, setSelectedResult, setSelectedResultIdx]);

  useEffect(() => {
    reindex([
      ...steps.map(s => ({ id: `s-${s.name}`, label: enumToString(Step, s.name) || '<unk>', type: 'step' }) as SearchData),
      ...[...pipelines.values()].map(p => ({ id: `p-${p}`, label: enumToString(Pipeline, p) || '<unk>', type: 'pipeline' }) as SearchData),
    ]);
  }, []);

  useEffect(() => setQuery(phrase), [phrase]);

  useKeymap(handleInput);

  return (
    <>
      <Box position='absolute' width={40} marginX={(width - 40) / 2} marginY={0}>
        <Search phrase={phrase} isSearchVisible={isSearchVisible} />
      </Box>
      {isSearchVisible && (
        <Box position='absolute' width={60} marginX={(width - 60) / 2} marginY={3} flexDirection='column'>
          <Text backgroundColor={bg}>{''.padEnd(60, ' ')}</Text>
          <Text backgroundColor={bg}>{'  Use arrows to move, BACKSPACE to close'.padEnd(60, ' ')}</Text>
          <Text backgroundColor={bg}>{'  or start typing to filter'.padEnd(60, ' ')}</Text>
          <Text backgroundColor={bg}>{''.padEnd(60, ' ')}</Text>
          {
            results.map(({ id, label, type }, idx) => {
              const labelText = ` [${type.at(0)}] ${label || '<unk>'}  `.padEnd(60, ' ');
              return (
                <Text key={id} backgroundColor={selectedResultIdx === idx ? bgSelected : bg}>{labelText}</Text>
              );
            })
          }
          <Text backgroundColor={bg}>{''.padEnd(60, ' ')}</Text>
        </Box>
      )}
    </>
  );
};
