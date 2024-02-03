type EnumValueType = string | number | symbol;
type EnumType = { [key in EnumValueType]: EnumValueType };
type ValueOf<T> = T[keyof T];
type EnumItems<T> = Array<ValueOf<T>>;

export function getEnumItems<T>(item: EnumType & T): EnumItems<T> {
    return Object.values(item)
        .filter((_e, index, array) => index < array.length / 2)
        .map((e) => item[e as keyof T]) as EnumItems<T>;
}

export type Cluster = Set<number>;
export type Clusters<T> = Map<T, Cluster[]>;

export interface IClusters<T> {
  findCluster(left: number, right: number, value: T): Cluster | undefined;
  addTuple(left: number, right: number, value: T): IClusters<T>;
  fromTuples(tuples: [number, number, T][]): IClusters<T>;
  flatMap<Mapped>(mapper: (value: T, idxs: Set<number>) => Mapped): Mapped[];
}

export const Clusters: <T>() => IClusters<T> = <T>() => {
    const clusters = new Map<T, Cluster[]>();
    const self: IClusters<T> = {
        findCluster(left, right, val) {
            const cluster = clusters.get(val)?.find((nums) => nums.has(left) || nums.has(right));
            return cluster;
        },
        addTuple(left, right, val) {
            const cluster = this.findCluster(left, right, val);
            if (cluster) {
                cluster.add(left).add(right);
            } else {
                if (!clusters.get(val)) {
                    clusters.set(val, []);
                }
                clusters.get(val)?.push(new Set<number>([left, right]));
            }
            return self;
        },
        fromTuples(tuples) {
            for (const [left, right, value] of tuples) {
                this.addTuple(left, right, value);
            }
            return self;
        },
        flatMap(mapper) {
            const flat = [...clusters.entries()]
                .map(([group, clusters]) => clusters.map((idxs) => ({ group, idxs })))
                .reduce((res, item) => [...res, ...item], [])
                .map(({ group, idxs }) => mapper(group, idxs));
            return flat;
        },
    };
    return self;
};

export enum Similarity {
  Different = 0,
  HasSimilarProperties = 1,
  HasSubsetOfProperties = 2,
  HasIdenticalProperties = 3,
  Identical = 4,
}

export type SimilarityMatrix = Similarity[][];

export type SparseMatrix<T> = Map<number, Map<number, T>>;
export interface ISparseMatrix<T> {
  set(left: number, right: number, value: T): ISparseMatrix<T>;
  get(left: number, right: number): T;
  keys(): number[];
  fromDense(matrix: T[][]): ISparseMatrix<T>;
  toDense(): T[][];
  toTuples(): [number, number, T][];
  toString(): string;
}

export type SparseMatrixProps<T> = {
  nil: T;
};

export const SparseMatrix: <T>(props: SparseMatrixProps<T>) => ISparseMatrix<T> = <T>({
    nil,
}: SparseMatrixProps<T>) => {
    const sparse = new Map<number, Map<number, T>>();
    const keys = new Set<number>();

    const self: ISparseMatrix<T> = {
        set(left, right, value) {
            const [small, large] = left < right ? [left, right] : [right, left];
            if (!sparse.has(small)) {
                sparse.set(small, new Map<number, T>());
            }
            keys.add(small);
            keys.add(large);
            sparse.get(small)?.set(large, value);

            return this;
        },

        get(left, right) {
            const [small, large] = left < right ? [left, right] : [right, left];
            return sparse.get(small)?.get(large) || nil;
        },

        keys() {
            return [...keys.values()];
        },

        fromDense(matrix) {
            const idxs = [...matrix.keys()];
            for (const i of idxs) {
                for (const j of idxs) {
                    if (i > j) {
                        continue;
                    }
                    const value = matrix[i][j];
                    if (value !== nil) {
                        this.set(i, j, value);
                    }
                }
            }
            return this;
        },

        toDense() {
            const idxs = this.keys();
            const maxIdx = idxs.reduce((max, i) => (i > max ? i : max));
            const numIdxs = maxIdx + 1;
            const matrix = [...Array(numIdxs)].map(() => Array<T>(numIdxs).fill(nil));
            const allIdxs = [...Array(numIdxs).keys()];
            for (const i of allIdxs) {
                for (const j of allIdxs) {
                    matrix[i][j] = this.get(i, j);
                }
            }
            return matrix;
        },

        toTuples() {
            const tuples: [number, number, T][] = [];
            const idxs = this.keys();
            for (const i of idxs) {
                for (const j of idxs) {
                    if (i >= j) {
                        continue;
                    }
                    const value = this.get(i, j);
                    if (value === Similarity.Different) {
                        continue;
                    }
                    tuples.push([i, j, value]);
                }
            }
            return tuples;
        },

        toString() {
            return [
                'sparse',
                JSON.stringify([...sparse.entries()].map(([k, v]) => [k, ...v.entries()])),
                'keys',
                JSON.stringify([...keys.values()]),
            ].join('\n');
        },
    };
    return self;
};
