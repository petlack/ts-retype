import { SearchAwareText } from '../SearchAwareText';

export type ValueFeaturesProps = {
  title: string;
  values: string[];
}

export function ValueFeatures({ title, values }: ValueFeaturesProps) {
  const featuresMarkup = values.map(value => {
    return (
      <span key={value}>
        <span className="property value">
          <SearchAwareText>{value}</SearchAwareText>
        </span>
        <br />
      </span>
    );
  });
  return (
    <div className="properties">
      <h3>{title} ({values.length})</h3>
      <div className="pre mono">
        {featuresMarkup}
      </div>
    </div>
  );
}