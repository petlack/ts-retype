import { FC, HTMLAttributes, KeyboardEvent, MouseEvent, useCallback, useState } from 'react';

export const Control: FC<{
  id: string,
  isFocusable: boolean,
  isSelected: boolean,
  selected: string,
  Render: FC<{ id: string, selected: string } & HTMLAttributes<HTMLElement>>,
} & HTMLAttributes<HTMLElement>> = ({
  id,
  isFocusable,
  isSelected,
  onClick,
  selected,
  Render,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const onFocus = useCallback(() => {
    setIsFocused(true);
  }, [setIsFocused]);
  const onBlur = useCallback(() => {
    setIsFocused(false);
  }, [setIsFocused]);
  const onKeyDown = useCallback((e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && isFocused) {
      e.preventDefault();
      onClick && onClick({} as MouseEvent<HTMLElement>);
    }
  }, [isFocused, onClick]);

  const tabProps = isFocusable ? { tabIndex: 0 } : {};

  return (
    <Render
      {...props}
      {...tabProps}
      id={id}
      selected={selected}
      aria-selected={isSelected}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  );
};