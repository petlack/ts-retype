import { RefractorRoot, refractor } from 'refractor/lib/core.js';
import tsLang from 'refractor/lang/typescript.js';
import json from 'refractor/lang/json.js';
import { TokenRoot } from './types.js';
import { flattenTokens, insertNewlines, filterEmpty } from './snippet.js';

export function refractorHighlight(src: string, lang?: string): RefractorRoot {
    if (!refractor.registered('ts')) {
        refractor.register(tsLang);
    }
    if (!refractor.registered('json')) {
        refractor.register(json);
    }
    return refractor.highlight(src, lang || 'ts');
}

export function highlight(src: string, lang?: string): TokenRoot {
    const refractorRoot = refractorHighlight(src, lang);
    const tokenRoot: TokenRoot = refractorRoot as TokenRoot;
    return filterEmpty(insertNewlines(flattenTokens(tokenRoot)));
}
