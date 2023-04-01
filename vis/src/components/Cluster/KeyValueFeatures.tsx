import { SearchableSpan } from '../SearchableSpan';

import './KeyValueFeatures.scss';

export type KeyValueFeaturesProps = {
  name: string;
  keyValues: { name: string, type: string }[];
  query: string;
}

export function KeyValueFeatures({ name, keyValues, query }: KeyValueFeaturesProps) {
  const propertiesMarkup = keyValues.map(({ name, type }) => {
    return (
      <span key={name}>
        <span className="property key">
          <SearchableSpan
            query={query}
            value={['string', 'number', 'symbol', 'boolean'].includes(name) ? `[key: ${name}]` : name}
          />
        </span>
        <span>: </span>
        <span className="property value"><SearchableSpan query={query} value={type} /></span>
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