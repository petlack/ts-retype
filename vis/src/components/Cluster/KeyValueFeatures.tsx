import { SearchableSpan } from '../SearchableSpan';

export type KeyValueFeaturesProps = {
  name: string;
  keyValues: { key: string, value: string }[];
  query: string;
}

export function KeyValueFeatures({ name, keyValues, query }: KeyValueFeaturesProps) {
  const propertiesMarkup = keyValues.map(({ key, value }) => {
    return (
      <span key={key}>
        <span className="property key">
          <SearchableSpan query={query} value={['string', 'number', 'symbol', 'boolean'].includes(key) ? `[key: ${key}]` : key} />
        </span>
        <span>: </span>
        <span className="property value"><SearchableSpan query={query} value={value} /></span>
        <br />
      </span>
    );
  });
  return (
    <div className="properties">
      <h3>{name} ({keyValues.length})</h3>
      <div className="pre mono">
        {propertiesMarkup}
      </div>
    </div>
  );
}