type TypeDuplicate = {
  files: {
    file: string;
    lines: [number, number];
    type: 'interface' | 'literal' | 'alias' | 'function' | 'enum' | 'union';
  }[];
  group: 'different' | 'renamed' | 'identical';
  names: {
    count: number;
    name: string;
  }[];
  members?: string[];
  parameters?: {
    name: string;
    type: string;
  }[];
  properties?: {
    name: string;
    type: string;
  }[];
  returnType?: string;
  types?: string[];
};
