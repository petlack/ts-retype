import { Duplicate } from './Duplicate.js';
import { FulltextData } from '../../types.js';

export function Listing({ duplicates }: { duplicates: FulltextData[] }) {
    const duplicatesMarkup = duplicates.map((duplicate) => {
        return <Duplicate key={duplicate.id} {...duplicate} />;
    });

    return (
        <div className="flex flex-col gap-3 p-3">
            {duplicatesMarkup}
        </div>
    );
}
