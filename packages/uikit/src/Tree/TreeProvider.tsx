import { Tree } from '@ts-retype/utils/tree.js';
import { TreeContext } from './TreeContext.js';
import { TreeContextValue } from './types.js';

export type TreeProviderProps<T> = {
    index: Tree<T>;
    children: JSX.Element;
    onClick?: (node: T) => void;
    selectedId?: number;
}

export function TreeProvider<T>({ index, children, onClick, selectedId }: TreeProviderProps<T>) {
    const value: TreeContextValue = {
        onClick(id) {
            onClick?.(index.nodeById(id).data);
        },
        selectedId,
    };

    return (
        <TreeContext.Provider value={value}>
            {children}
        </TreeContext.Provider>
    );
}
