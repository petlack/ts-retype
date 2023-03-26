const duplicate: TypeDuplicate = {
  files: [
    { file: 'src/model.ts', lines: [12, 16], type: 'alias' },
    { file: 'src/auth.ts', lines: [42, 46], type: 'interface' },
    { file: 'src/api.ts', lines: [76, 83], type: 'literal' },
  ],
  group: 'renamed',
  names: [
    { name: 'IUser', count: 1 },
    { name: 'User', count: 1 },
    { name: 'anonymous', count: 1 },
  ],
  properties: [
    { name: 'displayName', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'password', type: 'string' },
  ],
};
