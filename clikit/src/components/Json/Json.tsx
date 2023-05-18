import React, { PropsWithChildren, useCallback, useState } from 'react';
import { Box, BoxProps, Text, useFocus } from 'ink';
import { Col, Row } from '../../layouts/index.js';
import { TreeProvider, Cardinality, TreeProps, Tree, TreeNode, indexWith } from '@ts-retype/uikit';
import { useKeymap } from '../../hooks/useKeymap.js';

type Node = {
  key: string;
  type: 'dir' | 'type';
  selected?: boolean;
  value?: any;
  kind?: 'object' | 'array' | 'atom' | 'root';
};

const createIndex = indexWith(
  (item: { key: string, kind: Node['kind'], value: any }) => {
    const parts = item.key.split('.');
    if (parts.length < 1) {
      return [];
    }
    const init = parts.slice(0, -1);
    const last = parts.at(-1) || '';
    const kind = (part: string) => isNaN(parseInt(part)) ? 'object' : 'array';

    return [
      ...init.map(part => ({ key: part, type: 'dir', kind: kind(part) })),
      { key: last, type: 'type', value: item.value, kind: 'atom' },
    ] as Node[];
  },
  (part: Node) => part.key,
  { key: 'anonymous', type: 'dir', kind: 'root' },
);

export const Ul: React.FC<PropsWithChildren<BoxProps>> = ({ children, ...rest }) => (
  <Col {...rest}>{children}</Col>
);

export const Li: React.FC<PropsWithChildren<BoxProps>> = ({ children, ...rest }) => (
  <Row {...rest}>{children}</Row>
);

const One: Cardinality<Node> = ({ children }) => {
  return <Row>{children}</Row>;
};

export const Pass: React.FC<PropsWithChildren<BoxProps>> = ({ children }) => <>{children}</>;

const Leaf: TreeNode<Node> = ({ node }) => {
  return <FileNode node={node}><></></FileNode>;
};

export const FileNode: TreeNode<Node> = ({ node, children }) => {
  const keyColor = '#a0a080';
  const value = node.data.value;
  const isUrl = (x?: string) => x?.startsWith('https://');
  const valueColor = isNaN(parseInt(value)) ? isUrl(value) ? '#808080' : 'white' : '#a0e0a0';
  return (
    // <Box flexDirection='column' borderStyle='single' borderColor='gray'>
    <Box flexDirection='column' paddingLeft={2}>
      <Row nice>
        <Text color={keyColor}>{node.data.key}:</Text>
        <Text color={valueColor} bold>{node.data.value}</Text>
      </Row>
      {children}
    </Box>
  );
};

export function FileTree(props: TreeProps<Node>) {
  return (
    <Tree
      {...props}
      Self={FileTree}
      Many={Ul}
      One={One}
      Node={FileNode}
      Root={Pass}
      Leaf={Leaf}
    />
  );
}

type FlattenedEntry = ['object' | 'array', string, any];

function flatMap(json: any): FlattenedEntry[] {
  const result: FlattenedEntry[] = [];

  function processValue(key: string, value: any, isArray: boolean) {
    const entryType: 'object' | 'array' = isArray ? 'array' : 'object';

    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          processValue(`${key}.${index}`, item, true);
        });
      } else {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          processValue(`${key}.${nestedKey}`, nestedValue, false);
        });
      }
    } else {
      result.push([entryType, key, value]);
    }
  }

  Object.entries(json).forEach(([key, value]) => {
    processValue(key, value, false);
  });

  return result;
}

function List<T>({ items }: { items: T[] }) {
  return (
    <Col>
      {items.map((item, idx) => <Text key={idx}>{JSON.stringify(item)}</Text>)}
    </Col>
  );
}

export type JsonOptions = {
  raw?: boolean;
  pretty?: boolean;
  nice?: boolean;
  flat?: boolean;
  debug?: boolean;
}

export type JsonFormat = keyof JsonOptions

function decideFormat(options?: JsonOptions): JsonFormat {
  if (options?.raw) return 'raw';
  if (options?.flat) return 'flat';
  if (options?.nice) return 'nice';
  if (options?.pretty) return 'pretty';
  if (options?.debug) return 'debug';
  return 'raw';
}

export function Json({ value, options }: { value: unknown, options?: JsonOptions }) {
  const tuples = flatMap(value).map(([kind, key, value]) => ({ key, kind, value }));
  const index = createIndex(tuples);

  const [format, setFormat] = useState(decideFormat(options));

  const { isFocused } = useFocus();

  const handleInput = useCallback((input: string) => {
    if (!isFocused) {
      return;
    }
    const newFormat = ({
      r: 'raw',
      p: 'pretty',
      n: 'nice',
      f: 'flat',
      d: 'debug',
    } as { [key: string]: keyof JsonOptions })[input];
    if (newFormat) {
      setFormat(newFormat);
    }
  }, [isFocused, setFormat]);

  useKeymap(handleInput);

  const selectedId = 0;
  const node = index.byId[0];

  if (!node) {
    return <Text color='gray'>empty json</Text>;
  }

  switch (format) {
    case 'flat':
      return <List items={tuples} />;
    case 'nice':
      return (
        <TreeProvider index={index} selectedId={selectedId}>
          <FileTree node={node} byId={index.byId} />
        </TreeProvider>
      );
    case 'pretty':
      return (
        <Text>{JSON.stringify(value, null, 2)}</Text>
      );
    case 'raw':
      return <Text>{JSON.stringify(value)}</Text>;
    case 'debug':
      return <Text>{JSON.stringify(index)}</Text>;
  }
}
