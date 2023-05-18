import { SetStateAction, createContext, useContext } from 'react';

export type ConfigContextValue<T> = {
  setConfig: (action: SetStateAction<Partial<T>>) => void;
  config: Partial<T>;
};

export const ConfigContext = createContext<ConfigContextValue<unknown>>({
  setConfig() {
    /**/
  },
  config: {},
});

export function useConfig<T>() {
  const value = useContext(ConfigContext);
  return value as ConfigContextValue<T>;
}
