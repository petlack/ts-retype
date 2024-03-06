import { describe, expect, it } from 'vitest';
import { Separator, Tree } from './tree.js';

type File = {
    name: string;
    type: 'interface' | 'alias' | 'enum',
    pos: [number, number],
    file: string;
}
type Node = {
    name: string;
    type: 'dir' | 'file' | 'type';
    info?: File;
}
const StringSeparator: Separator<string> = {
    join(...parts) {
        return Tree.Slash.join(...parts);
    },
    split(a) {
        return Tree.Slash.split(a);
    },
    equal(left, right) {
        return left === right;
    },
    display(a) {
        return a;
    }

};
const FileSeparator: Separator<Node> = {
    join(...parts) {
        const init = parts.slice(0, -1);
        const last = parts.at(-1);
        if (!last) return parts[0];
        return {
            name: Tree.Slash.join(...init.map(n => n.name).concat([last.name])),
            type: last?.type,
        };
    },
    split(a) {
        const [head, ...tail] = Tree.Slash.split(a.name);
        if (tail.length === 0) {
            return [{ name: head, type: a.type }];
        }
        return [
            { name: head, type: 'dir' },
            ...tail.map(name => ({ name, type: a.type })),
        ];
    },
    equal(left, right) {
        return left.name === right.name;
    },
    display(a) {
        let str = '';
        switch (a.type) {
        case 'dir':
            str = a.name + '/';
            break;
        case 'file':
        case 'type':
            str = a.name;
            break;
        }
        if (a.info) {
            str = `${str} 🟢`;
        }
        return str;
    },
};

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
        it('preserves unique ids', () => {
            const subtree = Tree.fromIndex({
                5: { id: 5, level: 0, data: 'foo', parent: -1, nodes: new Set([7, 9]) },
                7: { id: 7, level: 1, data: 'bar', parent: 5, nodes: new Set() },
                9: { id: 9, level: 1, data: 'baz', parent: 5, nodes: new Set() },
            });
            const tree = Tree.fromIndex({
                2: { id: 2, level: 0, data: 'goo', parent: -1, nodes: new Set([4, 9]) },
                4: { id: 4, level: 1, data: 'gar', parent: 2, nodes: new Set([7]) },
                7: { id: 7, level: 2, data: 'ooo', parent: 4, nodes: new Set() },
                9: { id: 9, level: 1, data: 'gaz', parent: 2, nodes: new Set() },
            });
            const actual = tree.clone().attach(subtree, 4);
            const expected = Tree.fromIndex({
                2: { id: 2, level: 0, data: 'goo', parent: -1, nodes: new Set([4, 9]) },
                4: { id: 4, level: 1, data: 'gar', parent: 2, nodes: new Set([7, 10]) },
                7: { id: 7, level: 2, data: 'ooo', parent: 4, nodes: new Set() },
                9: { id: 9, level: 1, data: 'gaz', parent: 2, nodes: new Set() },
                10: { id: 10, level: 2, data: 'foo', parent: 4, nodes: new Set([11, 12]) },
                11: { id: 11, level: 3, data: 'bar', parent: 10, nodes: new Set() },
                12: { id: 12, level: 3, data: 'baz', parent: 10, nodes: new Set() },
            });
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

    describe('findByPath', () => {
        it('returns undefined for an empty tree', () => {
            expect(Tree.empty<string>().findByPath(['foo'])).toBeUndefined();
        });
        it('returns undefined for a non-existing path', () => {
            const tree = Tree.withRoot('root').addNode('foo', 0);
            expect(tree.findByPath(['bar'])).toBeUndefined();
        });
        it('returns a node by node name', () => {
            const tree = Tree.withRoot('foo');
            expect(tree.findByPath(['foo'])).toEqual(0);
        });
        it('returns a leaf node by path', () => {
            const tree = Tree.withRoot('foo').addNode('bar', 0).addNode('baz', 0);
            expect(tree.findByPath(['foo'])).toEqual(0);
            expect(tree.findByPath(['foo', 'bar'])).toEqual(1);
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

    describe('insertNodeAtPath', () => {
        it('inserts a node at the root', () => {
            expect(Tree.withRoot('root').insertNodeAtPath('foo', ['root'], StringSeparator))
                .toTreeEqual(Tree.withRoot('root').addNode('foo', 0));
        });
        it('inserts multiple nodes at the root', () => {
            const actual = Tree.withRoot('root')
                .addNode('000', 0)
                .addNode('111', 1)
                .insertNodeAtPath('foo', ['root', '000', '111'], StringSeparator)
                .insertNodeAtPath('bar', ['root', '000', '111'], StringSeparator);
            const expected = Tree.withRoot('root')
                .addNode('000', 0)
                .addNode('111', 1)
                .addNode('foo', 2)
                .addNode('bar', 2);
            expect(actual).toTreeEqual(expected);
        });
        it('works with arbitrary objects', () => {
            const actual = Tree.withRoot<Node>({ name: 'root', type: 'dir' })
                .addNode({ name: '000', type: 'dir' }, 0)
                .addNode({ name: '111', type: 'dir' }, 1)
                .insertNodeAtPath(
                    { name: 'foo', type: 'dir' },
                    [
                        { name: 'root', type: 'dir' },
                        { name: '000', type: 'dir' },
                        { name: '111', type: 'dir' },
                    ],
                    FileSeparator,
                )
                .insertNodeAtPath(
                    { name: 'bar', type: 'dir' },
                    [
                        { name: 'root', type: 'dir' },
                        { name: '000', type: 'dir' },
                        { name: '111', type: 'dir' },
                    ],
                    FileSeparator,
                );
            const expected = Tree.withRoot({ name: 'root', type: 'dir' })
                .addNode({ name: '000', type: 'dir' }, 0)
                .addNode({ name: '111', type: 'dir' }, 1)
                .addNode({ name: 'foo', type: 'dir' }, 2)
                .addNode({ name: 'bar', type: 'dir' }, 2);
            expect(actual).toTreeEqual(expected);
        });
    });

    describe('longestCommonPrefix', () => {
        it('returns empty array on empty tree', () => {
            expect(Tree.empty<string>().longestCommonPrefix(['foo'], StringSeparator))
                .toStrictEqual([[], ['foo']]);
        });
        it('returns empty array on empty path', () => {
            expect(Tree.withRoot('root').longestCommonPrefix([], StringSeparator))
                .toStrictEqual([[], []]);
        });
        it('returns empty array on missing path', () => {
            expect(Tree.withRoot('root').longestCommonPrefix(['foo'], StringSeparator))
                .toStrictEqual([[], ['foo']]);
        });
        it('returns the root on the same path', () => {
            expect(Tree.withRoot('root').longestCommonPrefix(['root'], StringSeparator))
                .toStrictEqual([[0], []]);
        });
        it('returns the longest common prefix', () => {
            expect(
                Tree.withRoot('root')
                    .addNode('foo', 0)
                    .addNode('abc', 0)
                    .addNode('bar', 1)
                    .longestCommonPrefix(['root', 'foo', 'bar', 'baz'], StringSeparator)
            ).toStrictEqual([[0, 1, 3], ['baz']]);
        });
        it('returns the remaining path', () => {
            expect(
                Tree.withRoot('root')
                    .longestCommonPrefix(['root', 'foo', 'bar', 'baz'], StringSeparator)
            ).toStrictEqual([[0], ['foo', 'bar', 'baz']]);
        });
    });

    describe('foo', () => {
        it('works', () => {
            const rootNode: Node = { name: '.', type: 'dir' };
            const files: File[] = [
                { name: 'IUser', type: 'interface', pos: [14, 99], file: 'tests/example/src/auth.ts' },
                { name: 'IUser', type: 'interface', pos: [7, 92], file: 'apps/doc/src/generated/input/interface.ts' },
                { name: 'Foo', type: 'alias', pos: [7, 92], file: 'apps/doc/src/bar.ts' },
                { name: 'IUser', type: 'alias', pos: [5, 4], file: 'tests/example/src/api.ts' },
                { name: 'User', type: 'enum', pos: [19, 14], file: 'tests/example/src/api.ts' },
            ];
            function mapFileToNodes(file: File): Node[] {
                const parts = file.file.split('/');
                if (parts.length < 1) {
                    return [];
                }
                const init = parts.slice(0, -1);
                const last = parts.at(-1) || '';
                const nodes = [
                    ...init.map(part => ({ name: part, type: 'dir' })),
                    { name: last, type: 'file' },
                    { name: file.name, type: 'type', info: file },
                ] as Node[];
                return nodes;
            }
            const nodes = files.map(mapFileToNodes);
            let tree = Tree.withRoot(rootNode);
            for (const node of nodes) {
                const file = node.at(-1);
                if (!file) continue;
                const path = node.slice(0, -1);
                tree = tree.insertNodeAtPath(file, [rootNode, ...path], FileSeparator);
            }
            // console.log(tree.display(FileSeparator));
            // console.log();
            // console.log(tree.collapse(FileSeparator).display(FileSeparator));
        });
    });
});
