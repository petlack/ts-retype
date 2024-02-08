import './index.js';

import { duplicate } from './duplicate.js';

assert(duplicate.names.length === 3);
assert(duplicate.files.length === 3);

console.log(JSON.stringify(duplicate, null, 2));

function assert(must: boolean) {
    if (!must) throw new Error('Expected true, got false');
}
