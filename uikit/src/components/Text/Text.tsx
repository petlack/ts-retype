import { FC, PropsWithChildren } from 'react';

export const Text: FC<PropsWithChildren> = ({ children }) => {
  return (
    <span>{children}</span>
  );
};
