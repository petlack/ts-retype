import { SetStateAction, createContext, useContext } from 'react';

type SetState<T> = (action: SetStateAction<T>) => void;

export type ConsoleContextValue = {
  isFollow: boolean;
  setIsFollow: SetState<boolean>;
  offset: number;
  setOffset: SetState<number>;
  isFocused: boolean;
  setIsFocused: SetState<boolean>;
  buffer: number;
};

export const ConsoleContext = createContext<ConsoleContextValue>({
  setIsFocused() {
    /**/
  },
  setIsFollow() {
    /**/
  },
  setOffset() {
    /**/
  },
  buffer: 0,
  isFocused: false,
  isFollow: false,
  offset: 0,
});

export function useConsole() {
  const value = useContext(ConsoleContext);
  return value;
}
