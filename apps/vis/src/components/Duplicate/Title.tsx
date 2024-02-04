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

function DuplicateName({ selectedFile }: NamesListingProps) {
    return (
        <h2 className="text-3xl font-bold underline">
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
