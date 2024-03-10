/* eslint-disable no-console */

import { parse } from './parse.js';
import { similarity } from './similarity.js';
import { createFile } from './utils.js';

const src = `
export type User = {
  displayName: string;
  email: string;
  password: string;
};
interface IUser {
  displayName: string;
  email: string;
  password: string;
}
async function saveUser(
  user: {
    displayName: string;
    email: string;
    password: string
  }) {
  await db.createUser(user);
}
`;
const srcFile = createFile(src);

console.log();

const parsed = parse(srcFile);
console.log('parsed');
console.log(JSON.stringify({ parsed }, null, 2));

console.log();
console.log('similarity');
console.log(similarity(parsed[0], parsed[1]));

console.log(''.padEnd(100, '='));
console.log(''.padEnd(100, '='));
console.log();
console.log();
