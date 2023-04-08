import { FlatTreeNode, TreeIndex } from './types';

export function createRootIndex<T>(rootData: T): TreeIndex<T> {
  const rootNode: FlatTreeNode<T> = { id: 0, prefix: '', data: rootData, parent: -1, children: [] };
  const rootIndex: TreeIndex<T> = {
    byPath: { '': rootNode },
    byId: { 0: rootNode },
  };
  return rootIndex;
}

function nextIndex<T>({ byId }: TreeIndex<T>) {
  return Math.max(...Object.values(byId).map(({ id }) => id)) + 1;
}

export const indexWith = <T>(toParts: (data: T) => string[], rootData: T) => {
  const reducer = (index: TreeIndex<T>, data: T): TreeIndex<T> => {
    const { byPath, byId } = index;
    const parts = toParts(data);
    let id = nextIndex(index);
    let prefix = '';
    for (const part of parts) {
      const newPrefix = `${prefix}/${part}`;
      if (!byPath[newPrefix]) {
        const newId = id++;
        const newNode = {
          id: newId,
          data,
          prefix: part,
          children: [],
          parent: byPath[prefix].id,
        } as FlatTreeNode<T>;
        byPath[prefix].children.push(newId);
        byPath[newPrefix] = newNode;
        byId[newId] = newNode;
      }
      prefix = newPrefix;
    }
    return { byPath, byId };
  };
  return (data: T[]) => data.reduce(reducer, createRootIndex(rootData));
};
