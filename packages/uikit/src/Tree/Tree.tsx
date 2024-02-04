import { TreeProps, RenderableTreeProps } from './types.js';

export function Tree<T>(
    { node, byId, Self, Root, Many, One, Node, Leaf }: TreeProps<T> & RenderableTreeProps<T>
) {
    const { nodes, parent } = byId[node.id];
    const isLeaf = !nodes.length;
    const isRoot = parent < 0;

    const nodesMarkup = nodes.map(id => (
        <Self key={id} node={byId[id]} byId={byId} />
    ));

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
