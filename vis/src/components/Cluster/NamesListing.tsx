import { TypeDuplicate } from '../../../../src/types';
import { SearchableSpan } from '../SearchableSpan';

import './NamesListing.scss';

export type NamesListingProps = {
  names: TypeDuplicate['names'];
  query: string;
}

function sortNames(names: TypeDuplicate['names']) {
  return names.sort((a, b) => {
    if (a.count < b.count) {
      return 1;
    } else if (a.count > b.count) {
      return -1;
    } else {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    }
  });
}

export function NamesListing({ query, names }: NamesListingProps) {
  const sortedNames = sortNames(names);

  const namesMarkup = sortedNames.slice(1).map(({ name, count }) => (
    <span key={name} className="name-freq mono">
      <SearchableSpan query={query} value={name} /> ({count}x)
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
              `${sortedNames[0].name} (${sortedNames[0].count}x)` :
              sortedNames[0].name
          }
        />
      </h2>
      <div className="row">
        {alsoKnownMarkup}
      </div>
    </>
  );
}