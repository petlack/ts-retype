#!/usr/bin/env node
/* eslint-disable no-console */

import { writeFile } from 'fs/promises';
import { join } from 'path';
import { fromColors } from './builder.js';
import { getRootDir } from '@ts-retype/utils';

async function generateThemes() {
    const accent = '#0a799e';
    const second = '#c68726';
    const exportJs = false;
    const exportCss = true;

    const light = fromColors({ accent, second, mode: 'light' });
    const dark = fromColors({ accent, second, mode: 'dark' });

    const rootDir = await getRootDir();

    if (!rootDir) {
        console.error('Could not find rootDir');
        return;
    }

    const colorsLight = Object.entries(light)
        .flatMap(([name, value]) => {
            if (typeof value === 'string') {
                return [`--clr-${name}: ${value};`];
            }
            return Object.entries(value).map(([step, color]) => `--clr-${name}-${step}: ${color};`);
        });

    const colorsDark = Object.entries(dark)
        .flatMap(([name, value]) => {
            if (typeof value === 'string') {
                return [`--clr-${name}: ${value};`];
            }
            return Object.entries(value).map(([step, color]) => `--clr-${name}-${step}: ${color};`);
        });

    if (exportJs) {
        await writeFile(
            join(rootDir, 'config/themes.cjs'),
            [
                `export const light = ${JSON.stringify(light, null, 4)};`,
                '',
                `export const dark = ${JSON.stringify(dark, null, 4)};`,
            ].join('\n'),
        );
    }

    if (exportCss) {
        await writeFile(
            join(rootDir, 'packages/uikit/src/colors.css'),
            [
                '.clrs-light {',
                ...colorsLight.map(c => `    ${c}`),
                '}',
                '',
                '.clrs-dark {',
                ...colorsDark.map(c => `    ${c}`),
                '}',
            ].join('\n'),
        );
    }
}

generateThemes()
    .then(() => console.log('Done'))
    .catch(err => {
        console.error(err);
        console.error('Error');
    });
