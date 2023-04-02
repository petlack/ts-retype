import { parse, getAllCandidates, removeAliasDuplicates } from './parse';
import { similarity } from './similarity';
import { createFile } from './utils';

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

// const all = getAllCandidates(srcFile);
// console.log('all');
// console.log(JSON.stringify({ all }, null, 2));

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

// console.log(
//   removeAliasDuplicates([
//     { name: 'a', pos: [0, 10], type: 'alias' },
//     { name: 'anonymous', pos: [1, 10], type: 'interface' },
//     { name: 'anonymous', pos: [3, 6], type: 'literal' },
//   ]),
// );
