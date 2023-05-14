import React from 'react';
import { TreeContext } from './TreeContext.js';
import { FlatTreeNode, TreeContextValue, TreeIndex } from './types.js';

export type TreeProviderProps<T> = {
  index: TreeIndex<T>;
  children: JSX.Element;
  onClick?: (node: FlatTreeNode<T>) => void;
  selectedId: number;
}

export function TreeProvider<T>({ index, children, selectedId }: TreeProviderProps<T>) {
  const value: TreeContextValue = {
    onClick() {
      console.log('click', index);
    },
    selectedId,
  };

  return (
    <TreeContext.Provider value={value}>
      {children}
    </TreeContext.Provider>
  );
}