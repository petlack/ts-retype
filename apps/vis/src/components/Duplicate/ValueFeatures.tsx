import { SearchAwareText } from '@ts-retype/uikit';

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
            <span>{title}</span>
            <div className="pre mono">
                {featuresMarkup}
            </div>
        </div>
    );
}
