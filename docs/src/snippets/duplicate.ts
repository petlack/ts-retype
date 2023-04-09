const duplicate: TypeDuplicate = {
  names: [
    { name: 'User', count: 1 },
    { name: 'IUser', count: 1 },
    { name: 'anonymous', count: 1 }
  ],
  files: [
    {
      name: 'User',
      type: 'literal',
      pos: [54, 117],
      lines: [6, 10],
      properties: [
        { name: 'displayName', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' }
      ],
      file: 'src/model.ts',
      src: `// ...
export type User = {
  displayName: string;
  email: string;
  password: string;
};`
    },
    {
      name: 'IUser',
      type: 'interface',
      pos: [14, 93],
      lines: [3, 7],
      properties: [
        { name: 'displayName', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' }
      ],
      file: 'src/auth.ts',
      src: `// ...
interface IUser {
  displayName: string;
  email: string;
  password: string;
}
// ...`
    },
    {
      name: 'anonymous',
      type: 'literal',
      pos: [145, 215],
      lines: [18, 22],
      properties: [
        { name: 'displayName', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' }
      ],
      file: 'src/api.ts',
      src: `async function saveUser(
  user: {
    displayName: string;
    email: string;
    password: string
  }) {`
    }
  ],
  group: 'renamed',
  properties: [
    { name: 'displayName', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'password', type: 'string' }
  ]
};
