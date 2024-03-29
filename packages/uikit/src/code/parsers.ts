import { Token, TokenRoot } from '@ts-retype/syhi/types';
import { lines } from '@ts-retype/utils/core';

export function parseBash(code: string): TokenRoot {
    const elements = lines(code)
        .map(line => [
            line.trim().startsWith('#') ?
      {
          type: 'element',
          properties: { className: ['token', 'comment'] },
          children: [{ type: 'text', value: line }],
      } as Token :
      {
          type: 'element',
          properties: { className: ['token', 'bold', 'bash'] },
          children: [{ type: 'text', value: line }],
      } as Token,
      { type: 'newline' } as Token
        ])
        .reduce((res, item) => [...res, ...item], []);

    return {
        type: 'root',
        children: elements.slice(0, -1),
    };
}
