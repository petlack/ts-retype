import MiniSearch from 'minisearch';
import { TypeCluster } from '../types';

export function fulltext(cluster: TypeCluster): string {
  return [
    `${cluster.name}`,
    `${Object.keys(cluster.names).join(' ')}`,
    `${cluster.files.map(({ file }) => file).join(' ')}`,
    `${(cluster.properties || [])
      .map(({ key, value, type }) => `${type} ${key}: ${value}`)
      .join(' ')}`,
    `${(cluster.parameters || [])
      .map(({ key, value, type }) => `${type} ${key}: ${value}`)
      .join(' ')}`,
    `${(cluster.members || []).join(' ')}`,
    `${(cluster.types || []).join(' ')}`,
  ].join(' ');
}

export function Search() {
  const miniSearch = new MiniSearch({
    fields: ['name', 'fulltext'],
    storeFields: [
      'name',
      'type',
      'names',
      'files',
      'properties',
      'parameters',
      'returnType',
      'group',
      'fulltext',
    ],
  });

  return {
    refresh(allData: TypeCluster[]) {
      miniSearch.removeAll();
      miniSearch.addAll(allData);
    },
    search(query: string) {
      return miniSearch.search(query, { fuzzy: true, prefix: true }) as unknown as TypeCluster[];
    },
  };
}
