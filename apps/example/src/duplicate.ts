import type { TypeDuplicate } from '@ts-retype/search';

export const duplicate: TypeDuplicate = {
  names: [
    { name: 'User', count: 1 },
    { name: 'IUser', count: 1 },
    { name: 'anonymous', count: 1 }
  ],
  files: [
    {
      name: 'User',
      type: 'literal',
      src: '...omitted...',
      pos: [54, 123],
      offset: 26,
      lines: [6, 10],
      properties: [
        { name: 'displayName', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' }
      ],
      file: 'src/model.ts'
    },
    {
      name: 'IUser',
      type: 'interface',
      src: '...omitted...',
      pos: [14, 99],
      offset: 7,
      lines: [3, 7],
      properties: [
        { name: 'displayName', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' }
      ],
      file: 'src/auth.ts'
    },
    {
      name: 'anonymous',
      type: 'literal',
      src: '...omitted...',
      pos: [197, 268],
      offset: 35,
      lines: [18, 22],
      properties: [
        { name: 'displayName', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' }
      ],
      file: 'src/api.ts'
    }
  ],
  group: 'renamed',
  properties: [
    { name: 'displayName', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'password', type: 'string' }
  ]
};