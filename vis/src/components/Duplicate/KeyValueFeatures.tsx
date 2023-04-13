import { SearchAwareText } from '../SearchAwareText';

import './KeyValueFeatures.scss';

export type KeyValueFeaturesProps = {
  name: string;
  keyValues: { name: string, type: string }[];
}

export function KeyValueFeatures({ name, keyValues }: KeyValueFeaturesProps) {
  const propertiesMarkup = keyValues.map(({ name, type }) => {
    return (
      <span key={name}>
        <span className="property key">
          <SearchAwareText>
            {['string', 'number', 'symbol', 'boolean'].includes(name) ? `[key: ${name}]` : name}
          </SearchAwareText>
        </span>
        <span>: </span>
        <span className="property value">
          <SearchAwareText>{type}</SearchAwareText>
        </span>
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