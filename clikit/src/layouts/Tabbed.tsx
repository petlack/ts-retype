import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { BoxProps, Key, useFocus } from 'ink';
import { Col } from './Col.js';
import { Row } from './Row.js';
import { useKeymap } from '../hooks/useKeymap.js';
import { StyledProps, UnstyledProps, applyStyle } from './block.js';
import { TabItem } from '../components/TabItem.js';

export type TabbedProps = {
  labels: string[];
}

export const Tabbed: React.FC<{ children: ReactElement[] } & UnstyledProps & StyledProps & TabbedProps> = ({ children, labels, ...unstyledProps }) => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);
  const appliedStyles = useMemo(() => applyStyle(unstyledProps), []);
  const { isFocused } = useFocus();

  const handleInput = useCallback((_input: string, key: Key) => {
    if (!isFocused) {
      return;
    }
    if (key.leftArrow) {
      setSelectedTabIdx(prev => Math.max(0, prev - 1));
    } else if (key.rightArrow) {
      setSelectedTabIdx(prev => Math.min(prev + 1, children.length - 1));
    }
  }, [isFocused, setSelectedTabIdx, children.length]);

  useKeymap(handleInput);

  const selectedTabContent = children[selectedTabIdx] || <></>;

  const tabsMarkup = children.map((_, idx) => (
    <TabItem
      key={idx}
      selected={idx === selectedTabIdx}
    >{labels[idx]}</TabItem>
  ));

  const styles: BoxProps = {
    ...appliedStyles,
    borderStyle: 'single',
    borderColor: isFocused ? 'green' : unstyledProps.debug ? 'white' : 'black',
  };

  return (
    <Col {...styles}>
      <Row nice>{tabsMarkup}</Row>
      <Col grow>{selectedTabContent}</Col>
    </Col>
  );
};
