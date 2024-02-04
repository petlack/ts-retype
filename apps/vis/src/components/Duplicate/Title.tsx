import type { ArrayElement, TypeDuplicate } from '@ts-retype/search/types';
import { Badge } from './Badge.js';
import { SearchAwareText } from '@ts-retype/uikit';
import { TypeIcon } from './TypeIcon.js';

export type TitleProps = {
  type: ArrayElement<TypeDuplicate['files']>['type'];
  names: TypeDuplicate['names'];
  group: TypeDuplicate['group'];
  selectedFile: ArrayElement<TypeDuplicate['files']>;
}

export type NamesListingProps = {
  selectedFile: ArrayElement<TypeDuplicate['files']>;
}

export function sortNames(names: TypeDuplicate['names']) {
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

function DuplicateName({ selectedFile }: NamesListingProps) {
    return (
        <h2 className="mono">
            <SearchAwareText>{selectedFile.file}</SearchAwareText>
        </h2>
    );
}


export function Title({ group, type, names, selectedFile }: TitleProps) {
    return (
        <div className="title">
            <TypeIcon group={group} type={type} />
            <DuplicateName selectedFile={selectedFile} />
            <Badge group={group} names={names} />
        </div>
    );
}
