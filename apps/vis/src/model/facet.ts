import { assocPath, path, pluck, zip } from 'ramda';

export type FacetStats = { [facetName: string]: number | FacetStats };
export type Facet<R, V> = {
    name: string;
    values: V[];
    matches: (record: R, value: V) => boolean;
};

export function combineFacets<R, U extends string | number>(facets: Facet<R, U>[], values: U[]) {
    return (d: R) =>
        zip(facets, values)
            .reduce(
                (res, [facet, value]) => res && facet.matches(d, value),
                true,
            );
}

export function facetStats<T, U>(data: T[], facets: Facet<T, U>[]): FacetStats {
    const combs = combinations(pluck('values', facets));
    let res: FacetStats = {};
    for (const facetValues of combs) {
        res = assocPath(
            facetValues as (string | number)[],
            data.filter(
                combineFacets(
                    facets as unknown as Facet<T, string | number>[],
                    facetValues as (number | string)[]
                )
            ).length,
            res,
        );
    }
    return res;
}

export function getFacetStat(obj: FacetStats, ...rest: (string | number)[]): number {
    return <number>path(rest, obj) || 0;
}

function combinations<T>(values: T[][]): T[][] {
    if (values.length === 0) return [];
    const [first, ...rest] = values;
    const combinationsRest = combinations(rest);
    if (combinationsRest.length === 0) {
        return first.map(item => [item]);
    }
    return first.flatMap(
        (item) => combinationsRest.map(
            (combination) => [item, ...combination]
        )
    );
}
