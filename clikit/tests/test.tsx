import React from 'react';
import chalk from 'chalk';
import test from 'ava';
import { render } from 'ink-testing-library';
import { Make } from '../src/make.js';

test('greet unknown user', t => {
  const {lastFrame} = render(<Make />);

  t.is(lastFrame(), `Hello, ${chalk.green('Stranger')}`);
});

test('greet user with a name', t => {
  const {lastFrame} = render(<Make />);

  t.is(lastFrame(), `Hello, ${chalk.green('Jane')}`);
});
