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

const nextOption = (total: number) => (prev: number) => (prev + 1) % total;
const prevOption = (total: number) => (prev: number) => prev === 0 ? total - 1 : (prev - 1) % total;

const getProps = <T = Record<string, unknown>>(child: ReactNode): T | undefined => {
  return isValidElement(child) ? ((child as ReactElement).props as T) : undefined;
};

export const getOptionValue = <ValueType>(child: ReactNode): ValueType => {
  return getProps<Option<ValueType>>(child)?.value as ValueType;
};

export function useOptionsGroup<ValueType>(name: string, options: ValueType[]) {
  const [selectedOption, setSelectedOption] = useState<number>(1);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const handles = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (handles.includes(event.key)) {
        event.preventDefault();
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        setSelectedOption(prevOption(options.length));
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        setSelectedOption(nextOption(options.length));
      }
    },
    [setSelectedOption],
  );

  const handleClick = useCallback(
    (idx: number) => {
      setSelectedOption(idx);
    },
    [setSelectedOption],
  );

  const refs = options.map(() => useRef<HTMLDivElement | null>(null));

  useEffect(() => {
    const ref = refs[selectedOption];
    if (ref && ref.current) {
      ref.current?.focus();
    }
  }, [selectedOption, refs]);

  const containerProps: HTMLAttributes<HTMLDivElement> = {
    role: 'radiogroup',
    'aria-labelledby': `option-group-${name}-label`,
    onKeyDown: handleKeyDown,
  };

  const itemProps = (child: ReactNode, idx: number) => ({
    ref: refs[idx],
    value: getOptionValue<ValueType>(child),
    role: 'radio',
    'aria-checked': selectedOption === idx,
    tabIndex: selectedOption === idx ? 0 : -1,
    onClick: () => handleClick(idx),
  });

  const labelProps = {
    id: `option-group-${name}-label`,
  };

  return { containerProps, itemProps, labelProps, selectedOption };
}
