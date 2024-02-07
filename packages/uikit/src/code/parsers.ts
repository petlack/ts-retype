import { Token, TokenRoot } from '@ts-retype/search/types';

export function parseBash(code: string): TokenRoot {
    const lines = code.split('\n')
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
        children: lines.slice(0, -1),
    };
}
