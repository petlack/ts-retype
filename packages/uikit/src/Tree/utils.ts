import { FlatTreeNode, TreeIndex } from './types.js';

export function createRootIndex<T>(rootData: T): TreeIndex<T> {
    const rootNode: FlatTreeNode<T> = {
        id: 0,
        level: 0,
        prefix: '',
        data: rootData,
        parent: -1,
        nodes: [],
    };
    const rootIndex: TreeIndex<T> = {
        byPath: { '': rootNode },
        byId: { 0: rootNode },
    };
    return rootIndex;
}

function nextIndex<T>({ byId }: TreeIndex<T>) {
    return Math.max(...Object.values(byId).map(({ id }) => id)) + 1;
}

export const indexWith = <T, U>(
    transform: (t: T) => U[],
    prefixer: (part: U) => string,
    rootData: U,
) => {
    const reducer = (index: TreeIndex<U>, parts: U[]): TreeIndex<U> => {
        const { byPath, byId } = index;
        let id = nextIndex(index);
        let prefix = '';
        for (const part of parts) {
            const partPrefix = prefixer(part);
            const newPrefix = `${prefix}/${partPrefix}`;
            if (!byPath[newPrefix]) {
                const newId = id++;
                const newNode = {
                    id: newId,
                    data: part,
                    prefix: partPrefix,
                    level: byPath[prefix].level + 1,
                    nodes: [],
                    parent: byPath[prefix].id,
                } as FlatTreeNode<U>;
                byPath[prefix].nodes.push(newId);
                byPath[newPrefix] = newNode;
                byId[newId] = newNode;
            }
            prefix = newPrefix;
        }
        return { byPath, byId };
    };
    return (data: T[]) => data.map(transform).reduce(reducer, createRootIndex(rootData));
};
