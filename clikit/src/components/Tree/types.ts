import { HTMLAttributes, ReactNode } from 'react';

export type FlatTreeNode<T> = {
  id: number;
  data: T;
  prefix: string;
  parent: number;
  level: number;
  nodes: number[];
};

export type PrefixByPathIndex<T> = {
  [prefix: string]: FlatTreeNode<T>;
};
export type PrefixByIdIndex<T> = {
  [id: number]: FlatTreeNode<T>;
};

export type TreeIndex<T> = {
  byPath: PrefixByPathIndex<T>;
  byId: PrefixByIdIndex<T>;
};

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
  node: FlatTreeNode<T>;
  byId: TreeIndex<T>['byId'];
};

export type TreeNode<T> = React.FC<Partial<Renderable> & { node: FlatTreeNode<T> }>;
export type Cardinality<T> = React.FC<Renderable & { node: FlatTreeNode<T> }>;

export type TreeContextValue = {
  onClick: (id: number) => void;
  selectedId: number;
};
