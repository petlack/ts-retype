import { TreeContext } from './TreeContext';
import { FlatTreeNode, TreeContextValue, TreeIndex } from './types';

export type TreeProviderProps<T> = {
  index: TreeIndex<T>;
  children: JSX.Element;
  onClick?: (node: FlatTreeNode<T>) => void;
}

export function TreeProvider<T>({ index, children, onClick }: TreeProviderProps<T>) {
  const value: TreeContextValue = {
    onClick(id) {
      onClick?.(index.byId[id]);
    },
  };

  return (
    <TreeContext.Provider value={value}>
      {children}
    </TreeContext.Provider>
  );
}