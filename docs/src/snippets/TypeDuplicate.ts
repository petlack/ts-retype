type TypeDuplicate = {
  files: {
    name: string;
    file: string;
    src: string;
    srcHgl: any;
    lines: [number, number];
    pos: [number, number];
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
  signature?: {
    name?: string;
    params: { name: string; type?: string }[];
    return?: string;
    strMin?: string;
    strFull?: string;
  };
  types?: string[];
};
