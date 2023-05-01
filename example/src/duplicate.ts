import type { TypeDuplicate } from '@ts-retype/retype';

export const duplicate: TypeDuplicate = {
  names: [
    { name: 'User', count: 1 },
    { name: 'IUser', count: 1 },
    { name: 'anonymous', count: 1 },
  ],
  files: [
    {
      name: 'User',
      type: 'literal',
      src: '...omitted...',
      pos: [54, 117],
      offset: 26,
      lines: [6, 10],
      properties: [
        { name: 'displayName', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' },
      ],
      file: 'src/model.ts',
    },
    {
      name: 'IUser',
      type: 'interface',
      src: '...omitted...',
      pos: [14, 93],
      offset: 7,
      lines: [3, 7],
      properties: [
        { name: 'displayName', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' },
      ],
      file: 'src/auth.ts',
    },
    {
      name: 'anonymous',
      type: 'literal',
      src: '...omitted...',
      pos: [195, 266],
      offset: 33,
      lines: [18, 22],
      properties: [
        { name: 'displayName', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' },
      ],
      file: 'src/api.ts',
    },
  ],
  group: 'renamed',
  properties: [
    { name: 'displayName', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'password', type: 'string' },
  ],
};
