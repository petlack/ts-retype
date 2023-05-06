import { Box, Key, Text } from 'ink';
import React, { FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Search } from './Search.js';
import { Pipeline, Step, steps, pipelines } from '../../../scripts/src/config.js';
import { toEnumValue, enumToString } from '../../../scripts/src/utils/enums.js';
import { useSearch } from '../hooks/useSearch.js';
import { useKeymap } from '../hooks/useKeymap.js';
import { useLog } from '../hooks/useLog.js';
import { useConfig } from '../hooks/useConfig.js';

export type SpotlightProps = {
  width: number;
}

function resolveAction<T>(prev: T, action: SetStateAction<T>): T {
  if (typeof action === 'function') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return action(prev) as T;
  }
  return action as T;
}

type SearchData = { id: string, label: string, type: 'step' | 'pipeline' };

export const Spotlight: FC<SpotlightProps> = ({ width }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [selectedResultIdx, setSelectedResultIdx] = useState(-1);
  const { addBinding, removeBinding } = useKeymap();
  const { log } = useLog('spotlight');
  const { setConfig } = useConfig();
  const { results, setQuery, reindex } = useSearch<SearchData>(phrase);

  const setSelectedResult = useCallback((result: SearchData) => {
    log?.({ msg: `selected ${result.type} ${result.label}` });
    const pipeline = toEnumValue(Pipeline, result.label);
    const step = toEnumValue(Step, result.label);
    setConfig(prev => ({
      ...prev,
      step,
      pipeline,
    }));
  }, [log, setConfig]);
  
  const handleInput = useCallback((input: string, key: Key) => {
    if (input ===  ':') {
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
  }, [isSearchVisible, phrase, results, selectedResultIdx, setIsSearchVisible, setPhrase, setSelectedResult, setSelectedResultIdx]);

  useEffect(() => {
    reindex([
      ...steps.map(s => ({ id: `s-${s.name}`, label: enumToString(Step, s.name) || '<unk>', type: 'step' }) as SearchData),
      ...[...pipelines.values()].map(p => ({ id: `p-${p}`, label: enumToString(Pipeline, p) || '<unk>', type: 'pipeline' }) as SearchData),
    ]);
  }, []);

  useEffect(() => setQuery(phrase), [phrase]);

  useEffect(() => {
    const handle = addBinding(handleInput);
    return () => {
      removeBinding(handle);
    };
  }, [addBinding, removeBinding, handleInput]);

  return (
    <>
      <Box position='absolute' width={40} marginX={(width - 40) / 2} marginY={0}>
        <Search phrase={phrase} isSearchVisible={isSearchVisible} />
      </Box>
      {isSearchVisible && (
        <Box position='absolute' width={60} marginX={(width - 60) / 2} marginY={3} flexDirection='column'>
          <Text backgroundColor={'#313131'}>{''.padEnd(60, ' ')}</Text>
          <Text backgroundColor={'#313131'}>{'  Use arrows to move, BACKSPACE to close'.padEnd(60, ' ')}</Text>
          <Text backgroundColor={'#313131'}>{'  or start typing to filter'.padEnd(60, ' ')}</Text>
          <Text backgroundColor={'#313131'}>{''.padEnd(60, ' ')}</Text>
          {
            results.map(({ id, label, type }, idx) => {
              const labelText = ` [${type.at(0)}] ${label || '<unk>'}  `.padEnd(60, ' ');
              return (
                <Text key={id} backgroundColor={selectedResultIdx === idx ? '#626262' : '#313131'}>{labelText}</Text>
              );
            })
          }
          <Text backgroundColor={'#313131'}>{''.padEnd(60, ' ')}</Text>
        </Box>
      )}
    </>
  );
};