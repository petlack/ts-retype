import { TreeProps, RenderableTreeProps } from './types';

export function Tree<T>(
  { node, byId, Self, Root, Many, One, Node }: TreeProps<T> & RenderableTreeProps<T>
) {
  const { nodes, parent } = byId[node.id];
  const isLeaf = !nodes.length;
  const isRoot = parent < 0;

  const nodesMarkup = nodes.map(id => (
    <One node={node} key={id}>
      <Self node={byId[id]} byId={byId} />
    </One>
  ));

  const childrenMarkup = <Many node={node}>{nodesMarkup}</Many>;
  
  if (isRoot) {
    return <Root>{childrenMarkup}</Root>;
  }
  if (isLeaf) {
    return <Node node={node}></Node>;
  }
  return (
    <Node node={node}>{childrenMarkup}</Node>
  );
}

