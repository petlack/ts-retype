import { TreeContext } from './TreeContext';
import { FlatTreeNode, TreeContextValue, TreeIndex } from './types';

export type TreeProviderProps<T> = {
  index: TreeIndex<T>;
  children: JSX.Element;
  onClick?: (node: FlatTreeNode<T>) => void;
  selectedId: number;
}

export function TreeProvider<T>({ index, children, onClick, selectedId }: TreeProviderProps<T>) {
  const value: TreeContextValue = {
    onClick(id) {
      onClick?.(index.byId[id]);
    },
    selectedId,
  };

  return (
    <TreeContext.Provider value={value}>
      {children}
    </TreeContext.Provider>
  );
}