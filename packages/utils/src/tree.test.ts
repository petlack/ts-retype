import { describe, expect, it } from 'vitest';
import { Separator, Tree } from './tree.js';

expect.extend({
    toTreeEqual<Data>(received: Tree<Data>, expected: Tree<Data>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { isNot } = this as { isNot: any };
        const pass = expected.equals(received);
        return {
            pass,
            message: () => `is${!pass && !isNot ? ' not' : ''} equal`,
            actual: received.debug(),
            expected: expected.debug(),
        };
    }
});

describe('Tree', () => {
    describe('constructor', () => {
        it('constructs empty tree', () => {
            const tree = Tree.empty();
            expect(tree.nodesCount()).toEqual(0);
        });
        it('constructs tree with root', () => {
            const tree = Tree.withRoot('root');
            expect(tree.nodesCount()).toEqual(1);
        });
    });

    describe('addNode', () => {
        it('adds node to a leaf', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0);
            expect(tree.nodesCount()).toEqual(2);
            expect(tree.nodeById(0)).toStrictEqual({
                id: 0,
                data: 'root',
                nodes: new Set([1]),
                level: 0,
                parent: -1,
            });
            expect(tree.nodeById(1)).toStrictEqual({
                id: 1,
                data: 'foo',
                nodes: new Set(),
                level: 1,
                parent: 0,
            });
        });
        it('adds multiple nodes to a node', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 0);
            expect(tree.nodesCount()).toEqual(3);
            expect(tree.nodeById(0)).toStrictEqual({
                id: 0,
                data: 'root',
                nodes: new Set([1, 2]),
                level: 0,
                parent: -1,
            });
            expect(tree.nodeById(1)).toStrictEqual({
                id: 1,
                data: 'foo',
                nodes: new Set(),
                level: 1,
                parent: 0,
            });
            expect(tree.nodeById(2)).toStrictEqual({
                id: 2,
                data: 'bar',
                nodes: new Set(),
                level: 1,
                parent: 0,
            });
        });
    });

    describe('ancestors', () => {
        it('returns empty array for the root', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0);
            expect(tree.ancestors(0)).toHaveLength(0);
        });
        it('returns ancestors for a node', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 1);
            expect(tree.ancestors(1)).toStrictEqual(new Set([0]));
        });
        it('returns ancestors for a leaf', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 1);
            expect(tree.ancestors(2)).toStrictEqual(new Set([1, 0]));
        });
    });

    describe('attach', () => {
        it('attaches an empty tree to a single tree', () => {
            expect(Tree.withRoot('foo').attach(Tree.empty(), 0))
                .toTreeEqual(Tree.withRoot('foo'));
        });
        it('attaches a single tree to a single tree', () => {
            expect(Tree.withRoot('foo').attach(Tree.withRoot('bar'), 0))
                .toTreeEqual(Tree.withRoot('foo').addNode('bar', 0));
        });
        it('updates levels of the attached tree', () => {
            const actual = Tree.withRoot('foo').addNode('bar', 0).attach(Tree.withRoot('baz').addNode('abc', 0).addNode('xyz', 0), 1);
            const expected = Tree.withRoot('foo').addNode('bar', 0).addNode('baz', 1).addNode('abc', 2).addNode('xyz', 2);
            expect(actual).toTreeEqual(expected);
        });
    });

    describe('collapse', () => {
        it('returns the same tree for a tree without link-only nodes', () => {
            const createTree = () => Tree.withRoot('root').addNode('foo', 0).addNode('bar', 0);
            expect(createTree().collapse(Tree.Slash))
                .toStrictEqual(createTree());
        });
        it('removes single link-only node', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 1).addNode('baz', 1);
            const actual = tree.collapse(Tree.Slash);
            const expected = Tree.withRoot('root/foo').addNode('bar', 0).addNode('baz', 0);
            expect(actual).toTreeEqual(expected);
        });

        it('removes multiple link-only node', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('xyz', 1).addNode('bar', 2).addNode('baz', 2);
            const actual = tree.collapse(Tree.Slash);
            const expected = Tree.withRoot('root/foo/xyz').addNode('bar', 0).addNode('baz', 0);
            expect(actual).toTreeEqual(expected);
        });
        it('collapses link-only tree', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 1).addNode('baz', 2);
            const expected = Tree.withRoot('root/foo/bar/baz');
            expect(tree.collapse(Tree.Slash)).toTreeEqual(expected);
        });
    });

    describe('descendants', () => {
        it('returns empty array for a leaf', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0);
            expect(tree.descendants(1)).toHaveLength(0);
        });
        it('returns descendants for a node', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 1);
            expect(tree.descendants(1)).toStrictEqual(new Set([2]));
        });
        it('returns descendants for the root', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 1);
            expect(tree.descendants(0)).toStrictEqual(new Set([1, 2]));
        });
    });

    describe('expand', () => {
        it('returns the same tree given a single atomic node', () => {
            expect(Tree.withRoot('root').expand(Tree.Slash))
                .toStrictEqual(Tree.withRoot('root'));
        });
        it('expands single node', () => {
            const tree = Tree.withRoot('root/foo/bar/baz');
            const expected = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 1).addNode('baz', 2);
            const actual = tree.expand(Tree.Slash);
            expect(actual).toTreeEqual(expected);
        });
        it('removes multiple link-only node', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('xyz', 1).addNode('bar', 2).addNode('baz', 2);
            const actual = tree.collapse(Tree.Slash);
            const expected = Tree.withRoot('root/foo/xyz').addNode('bar', 0).addNode('baz', 0);
            expect(actual).toTreeEqual(expected);
        });
        it('collapses link-only tree', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 1).addNode('baz', 2);
            const expected = Tree.withRoot('root/foo/bar/baz');
            expect(tree.collapse(Tree.Slash)).toTreeEqual(expected);
        });
    });

    describe('removeNode', () => {
        it('removes root from root only tree', () => {
            const tree = Tree.withRoot('root').removeNode(0);
            expect(tree).toStrictEqual(Tree.empty());
        });
        it('removes a leaf', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 1).removeNode(2);
            expect(tree.nodeById(0).nodes).toStrictEqual(new Set([1]));
            expect(tree.nodeById(0).parent).toEqual(-1);
            expect(tree.nodeById(0).level).toEqual(0);
            expect(tree.nodeById(1).nodes).toHaveLength(0);
            expect(tree.nodeById(1).parent).toEqual(0);
            expect(tree.nodeById(1).level).toEqual(1);
            expect(tree.nodeById(2)).toBeUndefined();
        });
        it('removes a node', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 1).removeNode(1);
            expect(tree.nodeById(0).nodes).toStrictEqual(new Set([2]));
            expect(tree.nodeById(0).parent).toEqual(-1);
            expect(tree.nodeById(0).level).toEqual(0);
            expect(tree.nodeById(1)).toBeUndefined();
            expect(tree.nodeById(2).nodes).toHaveLength(0);
            expect(tree.nodeById(2).parent).toEqual(0);
            expect(tree.nodeById(2).level).toEqual(1);
        });
        it('removes the root', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 1).removeNode(0);
            expect(tree.nodeById(0)).toBeUndefined();
            expect(tree.nodeById(1).nodes).toStrictEqual(new Set([2]));
            expect(tree.nodeById(1).parent).toEqual(-1);
            expect(tree.nodeById(1).level).toEqual(0);
            expect(tree.nodeById(2).nodes).toHaveLength(0);
            expect(tree.nodeById(2).parent).toEqual(1);
            expect(tree.nodeById(2).level).toEqual(1);
        });
    });

    describe('subtree', () => {
        it('returns empty tree for an empty tree', () => {
            const tree = Tree.empty();
            expect(tree.subtree(0)).toStrictEqual(Tree.empty());
        });
        it('returns root for a root-only tree', () => {
            const tree = Tree.withRoot('root');
            expect(tree.subtree(0)).toTreeEqual(tree);
        });
        it('returns leaf', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0);
            expect(tree.subtree(1))
                .toTreeEqual(Tree.fromIndex({
                    1: { id: 1, level: 1, data: 'foo', parent: -1, nodes: new Set() },
                }));
        });
        it('returns subtree', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 1).addNode('baz', 1);
            expect(tree.subtree(1))
                .toTreeEqual(Tree.fromIndex({
                    1: { id: 1, level: 1, data: 'foo', parent: -1, nodes: new Set([2, 3]) },
                    2: { id: 2, level: 2, data: 'bar', parent: 1, nodes: new Set() },
                    3: { id: 3, level: 2, data: 'baz', parent: 1, nodes: new Set() },
                }));
        });
    });

    describe('traverse', () => {
        it('returns empty array for an empty tree', () => {
            const tree = Tree.empty();
            expect([...tree.traverse()])
                .toHaveLength(0);
        });
        it('traverses nodes depth-first', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 0).addNode('baz', 2);
            expect([...tree.traverse(0, 'depth-first')].map(n => n.id))
                .toStrictEqual([0, 2, 3, 1]);
        });
        it('traverses nodes breadth-first', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 0).addNode('baz', 2);
            expect([...tree.traverse(0, 'breadth-first')].map(n => n.id))
                .toStrictEqual([0, 1, 2, 3]);
        });
    });


    describe('traverseEffect', () => {
        it('is called 0 times on empty tree', () => {
            const tree = Tree.empty();
            const nodes: number[] = [];
            tree.traverseEffect(node => nodes.push(node.id));
            expect(nodes).toHaveLength(0);
        });
        it('is called for every node in the tree', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 1);
            const nodes: number[] = [];
            tree.traverseEffect(node => nodes.push(node.id));
            expect(nodes)
                .toStrictEqual([0, 1, 2]);
        });
    });

    describe('traverseMap', () => {
        it('returns empty array for an empty tree', () => {
            const tree = Tree.empty();
            const nodes: number[] = [];
            tree.traverseEffect(node => nodes.push(node.id));
            expect(nodes).toHaveLength(0);
        });
        it('returns all nodes with a mapper', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 0).addNode('baz', 2);
            const nodes = tree.traverseMap(node => node.id, 'depth-first');
            expect(nodes)
                .toStrictEqual([0, 2, 3, 1]);
        });
        it('returns all nodes without a mapper', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 0).addNode('baz', 2);
            const nodes = tree.traverseMap(n => n, 'breadth-first').map(n => n.id);
            expect(nodes)
                .toStrictEqual([0, 1, 2, 3]);
        });
    });

    describe('traverseReduce', () => {
        it('returns empty tree for an empty tree', () => {
            expect(Tree.empty().traverseReduce(acc => acc))
                .toEqual(Tree.empty());
        });
        it('returns the same tree for identity reducer', () => {
            const createTree = () => Tree.withRoot('root').addNode('foo', 0).addNode('bar', 0);
            expect(createTree().traverseReduce(acc => acc))
                .toEqual(createTree());
        });
        it('returns reduced tree', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0).addNode('bar', 0).addNode('baz', 2);
            const reduced = tree.traverseReduce(
                (acc, node) => acc.mapNode(
                    node.id,
                    node => ({ ...node, data: node.data + '!' }),
                )
            );
            expect(reduced.nodeById(0).data).toEqual('root!');
            expect(reduced.nodeById(1).data).toEqual('foo!');
            expect(reduced.nodeById(2).data).toEqual('bar!');
            expect(reduced.nodeById(3).data).toEqual('baz!');
        });
    });

    describe('unnest', () => {
        it('returns empty tree for an empty tree', () => {
            expect(Tree.empty().unnest()).toEqual(Tree.empty());
        });
        it('decreases level of all nodes', () => {
            expect(Tree.fromIndex({
                1: { id: 1, level: 1, data: 'foo', parent: -1, nodes: new Set([2, 3]) },
                2: { id: 2, level: 2, data: 'bar', parent: 1, nodes: new Set() },
                3: { id: 3, level: 2, data: 'baz', parent: 1, nodes: new Set() },
            }).unnest())
                .toTreeEqual(Tree.fromIndex({
                    1: { id: 1, level: 0, data: 'foo', parent: -1, nodes: new Set([2, 3]) },
                    2: { id: 2, level: 1, data: 'bar', parent: 1, nodes: new Set() },
                    3: { id: 3, level: 1, data: 'baz', parent: 1, nodes: new Set() },
                }));
        });
        it('stops at zero', () => {
            expect(Tree.withRoot('root').addNode('foo', 0).addNode('bar', 0).unnest())
                .toTreeEqual(Tree.withRoot('root').addNode('foo', 0).addNode('bar', 0));
        });
    });

    describe('custom separator', () => {
        type File = {
            name: string;
            file?: string;
        }
        type Node = {
            name: string,
            type: 'file' | 'dir' | 'type',
            selected?: boolean,
            file?: File,
        };

        const FileSeparator: Separator<Node> = {
            join: (...parts) => {
                const init = parts.slice(0, -1);
                const last = parts.at(-1);
                if (!last) return parts[0];
                return {
                    name: Tree.Slash.join(...init.map(n => n.name).concat([last.name])),
                    type: last?.type,
                };
            },
            split: a => {
                const [head, ...tail] = Tree.Slash.split(a.name);
                if (tail.length === 0) {
                    return [{ name: head, type: a.type }];
                }
                return [
                    { name: head, type: 'dir' },
                    ...tail.map(name => ({ name, type: a.type })),
                ];
            }
        };

        it('should collapse single file', () => {
            const partiallyExpanded = Tree
                .withRoot<Node>({ name: '.', type: 'dir' })
                .addNode({
                    name: 'foo/bar/baz',
                    type: 'dir',
                }, 0)
                .addNode({
                    name: 'index.html',
                    type: 'file',
                }, 1);
            const collapsed = Tree
                .withRoot<Node>({
                    name: './foo/bar/baz/index.html',
                    type: 'file',
                });
            const expanded = Tree
                .withRoot<Node>({ name: '.', type: 'dir' })
                .addNode({ name: 'foo', type: 'dir' }, 0)
                .addNode({ name: 'bar', type: 'dir' }, 1)
                .addNode({ name: 'baz', type: 'dir' }, 2)
                .addNode({ name: 'index.html', type: 'file' }, 3);
            expect(partiallyExpanded.clone().collapse(FileSeparator).expand(FileSeparator))
                .toTreeEqual(expanded);
            expect(partiallyExpanded.clone().expand(FileSeparator).collapse(FileSeparator))
                .toTreeEqual(collapsed);
        });
    });
});
