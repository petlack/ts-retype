type TreeIndex<Data> = Record<number, TreeNode<Data>>;
type TraversalStrategy = 'depth-first' | 'breadth-first';

export type TreeNode<Data> = {
    id: number;
    data: Data;
    parent: number;
    level: number;
    nodes: Set<number>;
}

export type Separator<D> = {
    split: (part: D) => D[];
    join: (...parts: D[]) => D;
    equal: (left: D, right: D) => boolean;
    display: (part: D) => string;
};

export class Tree<Data> {
    #lastId: number;
    #rootId: number;
    #index: Record<number, TreeNode<Data>>;

    constructor(index: TreeIndex<Data>, rootId?: number) {
        this.#index = index;
        const root = rootId ?? (index ? +Object.keys(index)[0] : undefined);
        this.#rootId = root ?? 0;
        this.#lastId = index ? Math.max(...Object.keys(index).map(Number)) : -1;
    }

    /**
    * Merge nodes using slash
    * @example
    *   const tree = Tree.withRoot('a/b/c');
    *   tree.expand(Tree.Slash).collapse(Tree.Slash);
    */
    static Slash: Separator<string> = {
        split: (path) => path.split('/').filter(Boolean),
        join: (...parts) => parts.join('/'),
        equal: (left, right) => left === right,
        display: part => part,
    };

    /**
    * Merge nodes using dot
    * @example
    *   const tree = Tree.withRoot('a.b.c');
    *   tree.expand(Tree.Dot).collapse(Tree.Dot);
    */
    static Dot: Separator<string> = {
        split: (path) => path.split('.').filter(Boolean),
        join: (...parts) => parts.join('.'),
        equal: (left, right) => left === right,
        display: part => part,
    };

    /**
    * Returns a new empty tree
    */
    static empty<Data>(): Tree<Data> {
        return new Tree<Data>({});
    }

    /**
    * Returns a tree from an index
    */
    static fromIndex<Data>(index: TreeIndex<Data>): Tree<Data> {
        return new Tree<Data>(index);
    }

    /**
    * Returns a tree with a root node
    */
    static withRoot<Data>(rootData: Data): Tree<Data> {
        return Tree.empty<Data>().#setRoot(rootData);
    }

    #cloneIndex(): TreeIndex<Data> {
        return Object.entries(this.#index)
            .reduce((tree, [id, node]) => ({ ...tree, [id]: node }), {});
    }

    #nextId(): number {
        return this.#lastId + 1;
    }

    #root(): TreeNode<Data> {
        return this.#index[this.#rootId];
    }

    #setRoot(data: Data): Tree<Data> {
        this.#rootId = 0;
        this.#lastId = 0;
        this.#index[this.#rootId] = {
            id: this.#rootId,
            level: 0,
            data,
            parent: -1,
            nodes: new Set(),
        };
        return this;
    }

    /**
    * Mutates the tree by adding a new node with `data` as a child of the node with `parentId`
    * @throws Error if the parent node does not exist
    */
    addNode(data: Data, parentId: number): Tree<Data> {
        const nodeId = this.#nextId();
        const parent = this.nodeById(parentId);
        if (!parent) {
            throw new Error(`Parent node with id ${parentId} does not exist ${this.display()}`);
        }
        this.#index[nodeId] = {
            id: nodeId,
            level: parent.level + 1,
            data,
            parent: parentId,
            nodes: new Set(),
        };
        parent.nodes.add(nodeId);
        this.#lastId = nodeId;
        return this;
    }

    /**
    * Helper method to add a node to the root
    */
    addNodeToLast(data: Data): Tree<Data> {
        return this.addNode(data, this.#lastId);
    }

    /**
    * Returns a set of ids of the ancestors of the node with `nodeId`
    */
    ancestors(nodeId: number): Set<number> {
        const node = this.#index[nodeId];
        const ancestors = new Set<number>();
        let current = node;
        while (current.parent !== -1) {
            current = this.#index[current.parent];
            ancestors.add(current.id);
        }
        return ancestors;
    }

    /**
    * Mutates the tree by adding a subtree as a child of the node with `parentId`
    */
    attach(tree: Tree<Data>, parentId: number): Tree<Data> {
        const treeRoot = tree.#root();
        if (!treeRoot) return this;
        const nodes = treeRoot.nodes;
        this.addNode(treeRoot.data, parentId);
        if (nodes.size === 0) return this;
        const treeRootId = this.#lastId;
        for (const childId of nodes) {
            this.attach(tree.subtree(childId), treeRootId);
        }
        return this;
    }

    /**
    * Returns a clone of the tree
    */
    clone(): Tree<Data> {
        return Tree.fromIndex(this.#cloneIndex());
    }

    /**
    * Returns a clone of the tree with collapsed nodes
    * @param merge - function to merge the data of the root node and its only child
    */
    collapse(separator: Separator<Data>): Tree<Data> {
        const root = this.#root();
        if (!root) return Tree.empty();
        const tree = Tree.withRoot(root.data);
        if (root.nodes.size === 0) return tree;
        if (root.nodes.size === 1) {
            const childId = Array.from(root.nodes)[0];
            const subtree = this.subtree(childId).unnest().collapse(separator);
            const subtreeRoot = subtree.#root();
            subtreeRoot.data = separator.join(root.data, subtreeRoot.data);
            return subtree;
        }
        for (const childId of root.nodes.keys()) {
            const subtree = this.subtree(childId).collapse(separator);
            tree.attach(subtree, tree.#rootId);
        }
        return tree;
    }

    /**
    * Returns a debuggable representation of the tree
    */
    debug({ pretty } = { pretty: false }): string {
        const index = Object.entries(this.#index)
            .reduce(
                (acc, [id, node]) => ({ ...acc, [id]: { ...node, nodes: Array.from(node.nodes) } }),
                {}
            );
        const obj = { '#index': index, '#lastId': this.#lastId, '#rootId': this.#rootId };
        return pretty ?
            JSON.stringify(obj, null, 2) :
            JSON.stringify(obj);
    }

    /**
    * Returns a human-readable representation of the tree
    */
    display({ display: inDisplay }: Partial<Separator<Data>> = {}): string {
        const dsp = inDisplay ?? (part => typeof part === 'string' ? part : JSON.stringify(part));
        const lines: string[] = [];
        for (const node of this.traverse(this.#rootId, 'depth-first')) {
            const prefix = ' '.repeat(3 * node.level);
            const char = node.level === 0 ? '🌳' : '└─';
            const prefixedName = `${prefix}${char} ${dsp(node.data)}`;
            lines.push(`${prefixedName.padEnd(36, '.')} (${node.id})`);
        }
        return lines.join('\n');
    }

    /**
    * Returns a set of ids of the descendants of the node with `nodeId`
    */
    descendants(nodeId: number): Set<number> {
        const node = this.#index[nodeId];
        if (!node) return new Set();
        const descendants = new Set<number>();
        let current = node;
        while (current?.nodes.size > 0) {
            current = this.#index[Array.from(current.nodes)[0]];
            if (current?.id) descendants.add(current.id);
        }
        return descendants;
    }

    /**
    * Returns true if the tree is equal to `other`
    */
    equals(other: Tree<Data>): boolean {
        return this.debug() === other.debug();
    }

    /**
    * Returns a clone of the tree with expanded nodes
    * @param splitter - function to split the data of the root node into children
    */
    expand(separator: Separator<Data>): Tree<Data> {
        const root = this.#root();
        if (!root) return Tree.empty();
        const [head, ...tail] = separator.split(root.data);
        const tree = Tree.withRoot(head);
        if (tail.length > 0) {
            tree.attach(
                Tree.withRoot(separator.join(...tail)).expand(separator),
                tree.#rootId,
            );
        }
        const parentId = tree.#lastId;
        for (const childId of root.nodes) {
            tree.attach(this.subtree(childId).expand(separator), parentId);
        }
        return tree;
    }

    /**
     * @deprecated
     */
    findByPath(path: Data[]): number | undefined {
        if (path.length === 0) return undefined;
        const current = this.#root();
        if (!current) return undefined;
        const [head, ...tail] = path;
        if (current.data !== head) return undefined;

        for (const childId of current.nodes) {
            const foundInChild = this.subtree(childId).findByPath(tail);
            if (foundInChild) return foundInChild;
        }

        return current.id;
    }

    /**
    * Mutates the tree by inserting a new node with `data` at `path`
    */
    insertNodeAtPath(data: Data, path: Data[], separator: Separator<Data>): Tree<Data> {
        if (path.length === 0) return this;
        const [prefix, remaining] = this.longestCommonPrefix(path, separator);

        let lastExistingNode = prefix.at(-1) ?? this.#rootId;

        for (const part of remaining) {
            const nodeId = this.pushNode(part, lastExistingNode);
            lastExistingNode = nodeId;
        }
        this.addNode(data, lastExistingNode);

        return this;
    }

    /**
    * Returns true if the given `nodeId` is the root of the tree
    */
    isRoot(nodeId: number): boolean {
        return nodeId === this.#rootId;
    }

    /**
    * Returns the node with the longest common prefix with `path` and the remaining path
    */
    longestCommonPrefix(path: Data[], separator: Separator<Data>): [number[], Data[]] {
        if (path.length === 0) return [[], path];
        let idx = 0;
        const nodeId = this.#rootId;
        let prefix = [] as number[];
        let remainingPath = path;
        while (idx < path.length) {
            const node = this.nodeById(nodeId);
            if (!node || !separator.equal(node.data, path[idx])) break;
            prefix.push(nodeId);
            remainingPath = remainingPath.slice(1);
            for (const childId of node.nodes) {
                const [childPrefix, childRemainingPath] = this.subtree(childId)
                    .longestCommonPrefix(path.slice(idx + 1), separator);
                if (childPrefix.length) {
                    prefix = prefix.concat(childPrefix);
                    remainingPath = childRemainingPath;
                }
            }
            idx += 1;
        }
        return [prefix, remainingPath];
    }

    /**
    * Mutates the tree by mapping the node with `nodeId` to a new node
    */
    mapNode(nodeId: number, mapper: (node: TreeNode<Data>) => TreeNode<Data>): Tree<Data> {
        this.#index[nodeId] = mapper(this.#index[nodeId]);
        return this;
    }

    /**
    * Returns the number of nodes in the tree
    */
    nodesCount(): number {
        return Object.keys(this.#index).length;
    }

    /**
    * Returns the node with `id`
    */
    nodeById(id: number): TreeNode<Data> {
        return this.#index[id];
    }

    /**
    * Add a node to the tree and return its id
    * @returns the id of the new node
    */
    pushNode(data: Data, parentId: number): number {
        this.addNode(data, parentId);
        return this.#lastId;
    }

    /**
    * Add a node to the root and return its id
    * @returns the id of the new node
    */
    pushNodeToRoot(data: Data): number {
        if (!this.#root()) {
            this.#setRoot(data);
            return this.#rootId;
        }
        this.addNode(data, this.#rootId);
        return this.#lastId;
    }


    /**
    * Mutates the tree by removing the node with `nodeId` and all its descendants
    */
    removeNode(nodeId: number): Tree<Data> {
        const node = this.#index[nodeId];
        if (!node) return this;
        const parent = this.#index[node.parent];
        if (parent?.nodes) {
            parent.nodes.delete(node.id);
            for (const childId of node.nodes) {
                parent.nodes.add(childId);
            }
        }
        for (const childId of this.descendants(node.id)) {
            if (this.#index[nodeId].nodes.has(childId)) {
                this.#index[childId].parent = parent?.id ?? -1;
            }
            this.#index[childId].level -= 1;
        }
        delete this.#index[node.id];
        return this;
    }

    /**
    * Returns the root node
    */
    root(): TreeNode<Data> {
        return this.#index[this.#rootId];
    }

    /**
    * Returns a clone of a subtree with root at `nodeId`
    */
    subtree(nodeId: number): Tree<Data> {
        return Tree.fromIndex(
            [...this.clone().traverse(nodeId)]
                .reduce((index, node) => ({
                    ...index,
                    [node.id]: {
                        ...node,
                        parent: node.id === nodeId ? -1 : node.parent,
                    },
                }), {} as TreeIndex<Data>)
        );
    }

    /**
    * Traverses the tree with a depth-first or breadth-first strategy
    *   - depth-first - LIFO stack
    *   - breadth-first - FIFO queue
     */
    *traverse(initial?: number, strategy: TraversalStrategy = 'depth-first'): Generator<TreeNode<Data>> {
        const collection: Array<TreeNode<Data>> = [this.#index[initial ?? 0]];
        const popMethod = strategy === 'depth-first' ? 'pop' : 'shift';

        while (collection.length > 0) {
            const current = collection[popMethod]();
            if (!current) break;
            yield current;
            for (const childId of current.nodes) {
                collection.push(this.#index[childId]);
            }
        }
    }

    /**
    * Traverses the tree and applies an effect to each node
    */
    traverseEffect(
        effect: (node: TreeNode<Data>) => void,
        strategy: TraversalStrategy = 'depth-first',
    ): void {
        for (const node of this.traverse(0, strategy)) {
            effect(node);
        }
    }

    /**
    * Traverses the tree and returns an array of nodes mapped by `mapper`
    */
    traverseMap<H = TreeNode<Data>>(
        mapper?: (node: TreeNode<Data>) => H,
        strategy: TraversalStrategy = 'depth-first',
    ): H[] {
        const result: H[] = [];
        for (const node of this.traverse(0, strategy)) {
            result.push(mapper ? mapper(node) : node as unknown as H);
        }
        return result;
    }

    /**
    * Traverses the tree and reduces the nodes to a {@type Tree}
    */
    traverseReduce(
        reducer: (acc: Tree<Data>, node: TreeNode<Data>) => Tree<Data>,
        initial?: Tree<Data>,
        strategy: TraversalStrategy = 'depth-first',
    ): Tree<Data> {
        return [...this.traverse(0, strategy)]
            .reduce(
                (tree, node) => reducer(tree, node),
                initial ?? this as Tree<Data>,
            );
    }

    /**
    * Mutates the tree by decreasing the level of each node by 1
    */
    unnest(): Tree<Data> {
        const root = this.#root();
        if (!root) return this;
        if (root.level === 0) return this;
        for (const nodeId of Object.keys(this.#index)) {
            const node = this.#index[+nodeId];
            node.level = Math.max(0, node.level - 1);
        }
        return this;
    }
}
