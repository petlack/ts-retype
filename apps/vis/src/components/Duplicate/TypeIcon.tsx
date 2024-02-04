import type { ArrayElement, TypeDuplicate } from '@ts-retype/search/types';
// import { Tooltip } from '../../hooks/useTooltip/index.js';

export type TypeIconProps = {
  type: ArrayElement<TypeDuplicate['files']>['type'];
  group: TypeDuplicate['group']
}

export function TypeIcon({ type }: TypeIconProps) {
    const tooltipContent = {
        function: 'Function Type Declaration',
        union: 'Union Type Declaration',
        enum: 'Enum Type Declaration',
        literal: 'Literal Type Declaration',
        alias: 'Type Alias Declaration',
        interface: 'Interface Declaration',
    }[type];

    const typeSymbol = {
        function: '=>',
        union: '[]',
        enum: '[]',
        literal: '{}',
        alias: '{}',
        interface: '{}',
    }[type];

    return (
        <div className="relative cursor-help transition-colors duration-150 ease-in text-bgaa-400 hover:text-bgaa-900">
            <span className="name mono">{typeSymbol}</span>
            <span>{tooltipContent}</span>
            {/* <Tooltip> */}
            {/*     <span className="name mono">{typeSymbol}</span> */}
            {/*     <span>{tooltipContent}</span> */}
            {/* </Tooltip> */}
        </div>
    );
}
