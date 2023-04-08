import { TreeProps, RenderableTreeProps } from './types';

export function Tree<T>(
  { node, byId, Self, Root, Many, One, Node, Leaf }: TreeProps<T> & RenderableTreeProps<T>
) {
  const { children, parent } = byId[node.id];
  const isLeaf = !children.length;
  const isRoot = parent < 0;

  const nodeMarkup = isRoot ?
    <></> :
    isLeaf ?
      <Leaf {...node} /> :
      <Node {...node} />;

  const nodesMarkup = children.map(id => (
    <One node={node} key={id}>
      <Self node={byId[id]} byId={byId} />
    </One>
  ));

  const childrenMarkup = <Many node={node}>{nodesMarkup}</Many>;
  
  if (isRoot) {
    return <Root>{childrenMarkup}</Root>;
  }
  if (isLeaf) {
    return nodeMarkup;
  }
  return (
    <>
      {nodeMarkup}
      {childrenMarkup}
    </>
  );
}

