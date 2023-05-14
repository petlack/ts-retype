import React from 'react';
import { Heading, snap } from '@ts-retype/clikit';

function run() {
  const output = snap(<Heading>abcdefghijklmnopqrstuvwxyz</Heading>, { discreet: true });
  console.log(output);
}

run();
