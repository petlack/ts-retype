import { HTMLAttributes, ReactNode } from 'react';
import { Tree } from '@ts-retype/utils/tree.js';

export type LikeHTML = HTMLAttributes<HTMLElement>;
export type Renderable = { children: ReactNode | ReactNode[] } & LikeHTML;

export type RenderableTreeProps<T> = {
    Self: React.FC<TreeProps<T>>;
    Many: Cardinality<T>;
    One: Cardinality<T>;
    Node: TreeNode<T>;
    Leaf: TreeNode<T>;
    Root: React.FC<Renderable>;
};

export type TreeProps<T> = {
    nodeId: number;
    node?: T;
    byId: Tree<T>;
};

export type TreeNode<T> = React.FC<Partial<Renderable> & { node: T }>;
export type Cardinality<T> = React.FC<Renderable & { node: T }>;

export type TreeContextValue = {
    onClick: (id: number) => void;
    selectedId?: number;
};
