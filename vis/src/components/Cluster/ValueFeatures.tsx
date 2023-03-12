import { SearchableSpan } from '../SearchableSpan';

export type ValueFeaturesProps = {
  title: string;
  values: string[];
  query: string;
}

export function ValueFeatures({ title, query, values }: ValueFeaturesProps) {
  const featuresMarkup = values.map(value => {
    return (
      <span key={value}>
        <span className="property value"><SearchableSpan query={query} value={value} /></span>
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