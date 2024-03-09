#!/usr/bin/env node
/* eslint-disable no-console */

import { writeFile } from 'fs/promises';
import { join } from 'path';
import { fromColors } from './builder.js';
import { execute, getRootDir } from '@ts-retype/utils';
import { variants } from './palette.js';

async function generateThemes() {
    const accent = '#0a799e';
    const second = '#c68726';
    const exportJs = true;
    const exportCss = true;

    const light = fromColors({
        accent,
        second,
        crust: variants.latte.crust.hex,
        mantle: variants.latte.mantle.hex,
        base: variants.latte.base.hex,
        mode: 'light',
    });
    const dark = fromColors({
        accent,
        second,
        crust: variants.mocha.crust.hex,
        mantle: variants.mocha.mantle.hex,
        base: variants.mocha.base.hex,
        mode: 'dark',
    });

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

    const twColors = Object.fromEntries(
        Object.entries(light)
            .map(([name, value]) => {
                if (typeof value === 'string') {
                    return [name, `var(--clr-${name})`];
                }
                return [
                    name,
                    Object.fromEntries(
                        Object.keys(value)
                            .map(step => [+step, `var(--clr-${name}-${step})`])
                    ),
                ];
            })
    );

    if (exportJs) {
        await writeFile(
            join(rootDir, 'config/colors.cjs'),
            `export const colors = ${JSON.stringify(twColors, null, 4)};`,
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

execute(generateThemes);