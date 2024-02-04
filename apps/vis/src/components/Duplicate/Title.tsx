import type { ArrayElement, TypeDuplicate } from '@ts-retype/search/types';
import { Badge } from './Badge.js';
import { SearchAwareText } from '@ts-retype/uikit';
import { TypeIcon } from './TypeIcon.js';
import { SAT_FOUND } from '../../model/snippet.js';

export type TitleProps = {
  type: ArrayElement<TypeDuplicate['files']>['type'];
  names: TypeDuplicate['names'];
  group: TypeDuplicate['group'];
  selectedFile: ArrayElement<TypeDuplicate['files']>;
  className?: string;
}

export type NamesListingProps = {
  selectedFile: ArrayElement<TypeDuplicate['files']>;
}

function DuplicateName({ selectedFile }: NamesListingProps) {
    return (
        <h2 className="text-xl font-regular">
            <SearchAwareText foundClassName={SAT_FOUND}>{selectedFile.file}</SearchAwareText>
        </h2>
    );
}

export function Title({ className, group, type, names, selectedFile }: TitleProps) {
    return (
        <div className={`${className} grid grid-cols-[200px_max-content_1fr] justify-items-end items-center gap-x-2 px-2 py-1`}>
            <TypeIcon group={group} type={type} />
            <DuplicateName selectedFile={selectedFile} />
            <Badge group={group} names={names} />
        </div>
    );
}
