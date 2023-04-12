import './index.js';

import assert from 'node:assert/strict';
import { duplicate } from './duplicate.js';

assert.equal(duplicate.names.length, 3);
assert.equal(duplicate.files.length, 3);

console.log(JSON.stringify(duplicate, null, 2));
