import { Renderable } from './types';

export const Ul: React.FC<Renderable> = ({ children, ...rest }) => (
  <ul {...rest}>{children}</ul>
);

export const Li: React.FC<Renderable> = ({ children, ...rest }) => (
  <li {...rest}>{children}</li>
);

export const Pass: React.FC<Renderable> = ({ children }) => <>{children}</>;
