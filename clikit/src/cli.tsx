#!/usr/bin/env node

import React from 'react';
import { story } from './render.js';
import meow from 'meow';
import { App } from './example.js';
import { Make } from './make.js';

const cli = meow(
  `
	Usage
	  $ clikit

	Options
    --version   Print version
		--verbose   Print debug info
    --theme     Light or Dark
    --step      Step to run
    --pipeline  Pipeline to run

	Examples
	  $ clikit --theme=light
`,
  {
    importMeta: import.meta,
    flags: {
      verbose: { type: 'boolean' },
      version: { type: 'boolean' },
      theme: { type: 'string' },
      step: { type: 'string' },
      pipeline: { type: 'string' },
    },
  },
);

story([
  { markup: <App flags={cli.flags} />, options: { forceUi: true, forceLog: true, flags: cli.flags } },
  { markup: <Make />, options: { flags: cli.flags } },
]).then(() => process.exit(0)).catch(() => process.exit(1));
