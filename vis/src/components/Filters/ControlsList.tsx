import { FC, useState, useCallback, useEffect } from 'react';
import { Control } from './Control';

const find = (haystack: string[], needle: string) => haystack.findIndex(id => id === needle);

export const ControlsList: FC<
  Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onSelect' | 'selected'> &
  {
    children: string[],
    onSelect: (key: string) => void,
    selected: string,
    Render: FC<{ id: string, selected: string }>,
  }
> = ({ children, onSelect, selected, Render, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(find(children, selected));
  
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowDown') {
      if (!isFocused) {
        if (focusedIdx < children.length - 1) {
          setFocusedIdx(focusedIdx + 1);
          onSelect(children[focusedIdx + 1]);
        }
      }
    } else if (e.key === 'ArrowUp') {
      if (!isFocused) {
        if (focusedIdx > 0) {
          setFocusedIdx(focusedIdx - 1);
          onSelect(children[focusedIdx - 1]);
        }
      }
    } else if (e.key === 'Enter') {
      setIsFocused(true);
    } else if (e.key === 'Tab' && !e.shiftKey) {
      if (isFocused) {
        if (focusedIdx === children.length - 1) {
          setFocusedIdx(find(children, selected));
          setIsFocused(false);
        } else {
          setFocusedIdx(focusedIdx + 1);
        }
      }
    } else if (e.key === 'Tab' && e.shiftKey) {
      if (isFocused) {
        if (focusedIdx === 0) {
          setFocusedIdx(find(children, selected));
          setIsFocused(false);
        } else {
          setFocusedIdx(focusedIdx - 1);
        }
      }
    }
  }, [selected, focusedIdx, children, isFocused, setFocusedIdx, setIsFocused, onSelect]);

  const markup = children.map(key => {
    const onClick = () => onSelect(key);
    const isSelected = key === selected;
    return (
      <Control
        id={key}
        key={key}
        selected={selected}
        isSelected={isSelected}
        onClick={onClick}
        Render={Render}
        isFocusable={isFocused}
      />
    );
  });

  useEffect(() => {
    setFocusedIdx(find(children, selected));
  }, [children, selected, setFocusedIdx]);

  return (
    <ul
      {...props}
      {...(isFocused ? {} : { tabIndex: 0 })}
      onKeyDown={onKeyDown}
      role="tablist"
      aria-label={props['aria-label']}
    >
      {markup}
    </ul>
  );
};