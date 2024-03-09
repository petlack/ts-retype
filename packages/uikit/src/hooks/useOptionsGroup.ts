import {
    isValidElement,
    useCallback,
    useEffect,
    useRef,
    useState,
    HTMLAttributes,
    KeyboardEvent,
    ReactElement,
    ReactNode,
} from 'react';

export type Option<T> = {
  value: T;
  isSelected?: boolean;
};

export type OptionsGroup = {
    containerProps: HTMLAttributes<HTMLDivElement>;
    itemProps: (idx: number) => HTMLAttributes<HTMLDivElement>;
    labelProps: HTMLAttributes<HTMLLabelElement>;
    selectedOptionIdx: number;
};

export type UseOptionsGroup<ValueType> = {
    name: string;
    options: ValueType[];
    onChange?: (value: ValueType) => void;
}

export function useOptionsGroup<ValueType>(
    { name, options, onChange }: UseOptionsGroup<ValueType>
): OptionsGroup {
    const [selectedOptionIdx, setSelectedOptionIdx] = useState<number>(1);

    const updateSelectedOption = useCallback(
        (idx: number) => {
            setSelectedOptionIdx(idx);
            onChange?.(options[idx]);
        },
        [setSelectedOptionIdx, onChange, options],
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            const handles = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
            if (handles.includes(event.key)) {
                event.preventDefault();
            }
            if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                updateSelectedOption(prevOption(options.length)(selectedOptionIdx));
            }
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                updateSelectedOption(nextOption(options.length)(selectedOptionIdx));
            }
        },
        [updateSelectedOption, options.length, selectedOptionIdx],
    );

    const refs = useRef<(HTMLDivElement | null)[]>(options.map(() => null));

    useEffect(() => {
        refs.current[selectedOptionIdx]?.focus();
    }, [selectedOptionIdx, refs]);

    return {
        containerProps: {
            role: 'radiogroup',
            'aria-labelledby': `option-group-${name}-label`,
            onKeyDown: handleKeyDown,
        },
        itemProps: (idx) => ({
            ref: refs.current[idx],
            value: options[idx],
            role: 'radio',
            'aria-checked': selectedOptionIdx === idx,
            tabIndex: selectedOptionIdx === idx ? 0 : -1,
            onClick: () => updateSelectedOption(idx),
        }),
        labelProps: {
            id: `option-group-${name}-label`,
        },
        selectedOptionIdx,
    };
}

export const getOptionValue = <ValueType>(child: ReactNode): ValueType => {
    return getProps<Option<ValueType>>(child)?.value as ValueType;
};

const nextOption = (total: number) => (prev: number) => (prev + 1) % total;
const prevOption = (total: number) => (prev: number) => prev === 0 ? total - 1 : (prev - 1) % total;

const getProps = <T = Record<string, unknown>>(child: ReactNode): T | undefined => {
    return isValidElement(child) ? ((child as ReactElement).props as T) : undefined;
};
