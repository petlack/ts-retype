import { CANDIDATE_TYPES, FulltextData, SIMILARITIES } from '../types';
import { Facet, FacetStats, combineFacets, facetStats } from './facet';

const facets: Facet<FulltextData>[] = [
    {
        name: 'similarity',
        values: SIMILARITIES,
        matches: (rec, v) => v === 'all' || rec.group === v && rec.group !== 'different',
    },
    {
        name: 'type',
        values: CANDIDATE_TYPES,
        matches: (rec, v) => v === 'all' || !!rec.files.find(({ type }) => type === v),
    },
];

export interface IFilter {
    filter(data: FulltextData[]): FulltextData[];
    setMinFiles(minFiles: number): IFilter;
    setMinProperties(minProperties: number): IFilter;
}

export class Filter implements IFilter {
    constructor(
        readonly selectedSimilarity: string,
        readonly selectedType: string,
        readonly minFiles?: number,
        readonly minProperties?: number,
    ) {}

    static empty(): Filter {
        return new Filter('renamed', 'all', 1, 1);
    }

    #apply(data: FulltextData): boolean {
        return (
            (!this.minFiles || data.files.length >= this.minFiles) &&
            (!this.minProperties || (data.properties?.length ?? 0) >= this.minProperties)
        );
    }

    filter(data: FulltextData[]): FulltextData[] {
        if (this.isEmpty()) return data;
        return data
            .filter(combineFacets(facets, [this.selectedSimilarity, this.selectedType]))
            .filter(this.#apply.bind(this));
    }

    stats(data: FulltextData[]): FacetStats {
        return facetStats(data, facets);
    }

    isEmpty(): boolean {
        return !this.minFiles && !this.minProperties;
    }

    setMinFiles(minFiles: number): Filter {
        return new Filter(this.selectedSimilarity, this.selectedType, minFiles, this.minProperties);
    }

    setMinProperties(minProperties: number): Filter {
        return new Filter(this.selectedSimilarity, this.selectedType, this.minFiles, minProperties);
    }
}
