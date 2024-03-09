import React from 'react';
import { TreeProps, RenderableTreeProps } from './types.js';

export function Tree<T>(
  { node, byId, Self, Root, Many, One, Node, Leaf }: TreeProps<T> & RenderableTreeProps<T>
) {
  const current = byId[node.id];
  if (!current) {
    return <Leaf node={node}></Leaf>;
  }
  const { nodes, parent } = current;
  const isLeaf = !nodes.length;
  const isRoot = parent < 0;

  const nodesMarkup = nodes.map(id => {
    const node = byId[id];
    return node && <Self key={id} node={node} byId={byId} />;
  });

  const childrenMarkup = <Many node={node}>{nodesMarkup}</Many>;
  
  if (isRoot) {
    return <Root>{childrenMarkup}</Root>;
  }
  if (isLeaf) {
    return <One node={node}><Leaf node={node} /></One>;
  }
  return (
    <One node={node}><Node node={node}>{childrenMarkup}</Node></One>
  );
}

