import { useState } from 'react';
import { ConfigContext } from './useConfig';

export type ConfigProviderProps<T> = {
  children: JSX.Element;
  config: Partial<T>;
}

export function ConfigProvider<T>({
  children,
  config: initialConfig,
}: ConfigProviderProps<T>) {
  const [config, setConfig] = useState(initialConfig);
  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}
