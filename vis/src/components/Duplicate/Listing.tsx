import { Duplicate } from './Duplicate.js';
import { FulltextData } from '../../types.js';

import './Listing.scss';

export function Listing({ duplicates }: { duplicates: FulltextData[] }) {
  const duplicatesMarkup = duplicates.map((duplicate) => {
    return <Duplicate key={duplicate.id} {...duplicate} />;
  });

  return (
    <div className="duplicates">
      {duplicatesMarkup}
    </div>
  );
}
