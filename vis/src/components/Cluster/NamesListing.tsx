import { Freq } from '../../../../src/types';
import { SearchableSpan } from '../SearchableSpan';
import { sortNames } from './utils';

export type NamesListingProps = {
  names: Freq;
  query: string;
}

export function NamesListing({ query, names }: NamesListingProps) {
  const sortedNames = sortNames(names);

  const namesMarkup = sortedNames.slice(1).map(([name, freq]) => (
    <span key={name} className="name-freq mono">
      <SearchableSpan query={query} value={name} /> ({freq}x)
    </span>
  ));

  const alsoKnownMarkup = (
    namesMarkup.length > 0 ? (
      <>
        <span>Also known as</span>
        {namesMarkup}
      </>
    ) : <></>
  );
  return (
    <>
      <h2 className="mono">
        <SearchableSpan
          query={query}
          value={
            namesMarkup.length > 0 ?
              `${sortedNames[0][0]} (${sortedNames[0][1]}x)` :
              sortedNames[0][0]
          }
        />
      </h2>
      <div className="row">
        {alsoKnownMarkup}
      </div>
    </>
  );
}