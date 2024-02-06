import { ArrayElement } from '@ts-retype/search/types';
import { CANDIDATE_TYPES, FulltextData, SIMILARITIES } from '../types';
import { Facet, FacetStats, combineFacets, facetStats } from './facet';

const facets: Facet<
    FulltextData,
    ArrayElement<typeof SIMILARITIES> | ArrayElement<typeof CANDIDATE_TYPES>
>[] = [
    {
        name: 'similarity',
        values: CANDIDATE_TYPES,
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

export type FilterProps = {
    selectedSimilarity: string;
    selectedType: string;
    minFiles?: number;
    minProperties?: number;
}

export class Filter implements IFilter {
    constructor(
        readonly selectedSimilarity: string,
        readonly selectedType: string,
        readonly minFiles?: number,
        readonly minProperties?: number,
    ) {}

    static empty(): Filter {
        return new Filter('all', 'all', 1, 1);
    }

    #apply(data: FulltextData): boolean {
        return (
            (!this.minFiles || data.files.length >= this.minFiles) &&
            (!this.minProperties || (data.properties?.length ?? 0) >= this.minProperties)
        );
    }

    update(filter: Partial<FilterProps>): Filter {
        return new Filter(
            filter.selectedSimilarity ?? this.selectedSimilarity,
            filter.selectedType ?? this.selectedType,
            filter.minFiles ?? this.minFiles,
            filter.minProperties ?? this.minProperties,
        );
    }

    filter(data: FulltextData[]): FulltextData[] {
        if (this.isEmpty()) return data;
        return data
            .filter(combineFacets(
                facets,
                [
                    this.selectedSimilarity as ArrayElement<typeof SIMILARITIES>,
                    this.selectedType as ArrayElement<typeof CANDIDATE_TYPES>
                ]
            ))
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

    setSimilarity(similarity: string): Filter {
        return new Filter(similarity, this.selectedType, this.minFiles, this.minProperties);
    }

    setType(type: string): Filter {
        return new Filter(this.selectedSimilarity, type, this.minFiles, this.minProperties);
    }

}
