import { TokenRoot } from './snippet';

export type TypeDuplicate = {
  files: {
    name: string;
    file: string;
    lines: [number, number];
    pos: [number, number];
    offset: number;
    type: 'interface' | 'literal' | 'alias' | 'function' | 'enum' | 'union';
    src: string;
    srcHgl?: TokenRoot;
    properties?: { name: string; type: string }[];
  }[];
  group: 'different' | 'renamed' | 'identical';
  names: { count: number; name: string }[];
  members?: string[];
  parameters?: { name: string; type: string }[];
  properties?: { name: string; type: string }[];
  returnType?: string;
  signature?: {
    name?: string;
    params: { name: string; type?: string }[];
    return?: string;
    strMin?: string;
    strFull?: string;
  };
  types?: string[];
};
