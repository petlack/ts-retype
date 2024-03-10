#!/usr/bin/env node

import { Logger, bold, formatSize } from '@ts-retype/utils';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { fromColors } from './builder.js';
import { variants } from './palette.js';
import { execute, getRootDir } from '@ts-retype/utils/std';

const log = new Logger('theme');

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
        log.error('Could not find rootDir');
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
        const content = `export const colors = ${JSON.stringify(twColors, null, 4)};`;
        const colorsFile = join(rootDir, 'config/colors.cjs');
        log.info(`Writing ${bold(formatSize(content.length))} to ${colorsFile}`);
        await writeFile(colorsFile, content);
    }

    if (exportCss) {
        const content = [
            '.clrs-light {',
            ...colorsLight.map(c => `    ${c}`),
            '}',
            '',
            '.clrs-dark {',
            ...colorsDark.map(c => `    ${c}`),
            '}',
        ].join('\n');
        const cssFile = join(rootDir, 'packages/uikit/src/colors.css');
        log.info(`Writing ${bold(formatSize(content.length))} to ${cssFile}`);
        await writeFile(cssFile, content);
    }
}

execute(generateThemes);
