import { TypeDuplicate } from '../../../../src/types';
import { SearchAwareText } from '../SearchAwareText';

import './NamesListing.scss';

export type NamesListingProps = {
  names: TypeDuplicate['names'];
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

export function DuplicateName({ names }: NamesListingProps) {
  const sortedNames = sortNames(names);
  return (
    <h2 className="mono">
      <SearchAwareText>{
        sortedNames.length > 1 ?
          `${sortedNames[0].name} (${sortedNames[0].count}x)` :
          sortedNames[0].name
      }
      </SearchAwareText>
    </h2>
  );
}

export function NamesListing({ names }: NamesListingProps) {
  const sortedNames = sortNames(names);

  const namesMarkup = sortedNames.slice(1).map(({ name, count }) => (
    <span key={name} className="name-freq mono">
      <SearchAwareText>{name}</SearchAwareText> ({count}x)
    </span>
  ));

  const alsoKnownMarkup = (
    namesMarkup.length > 0 ? (
      <div className="names-container">
        <span>Also known as</span>
        {namesMarkup}
      </div>
    ) : <></>
  );
  return (
    <>
      {alsoKnownMarkup}
    </>
  );
}