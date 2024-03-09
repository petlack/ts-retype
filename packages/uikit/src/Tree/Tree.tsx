import { TreeProps, RenderableTreeProps } from './types.js';

export function Tree<T>(
    { nodeId, byId, Self, Root, Many, One, Node, Leaf }:
    TreeProps<T> & RenderableTreeProps<T>
) {
    const treeNode = byId.nodeById(nodeId);
    const node = treeNode as T;
    const { nodes, parent } = treeNode;
    const isLeaf = nodes.size === 0;
    const isRoot = parent < 0;

    const nodesMarkup = [...nodes.keys()].map(id => (
        <Self
            key={id}
            nodeId={id}
            byId={byId}
        />
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
