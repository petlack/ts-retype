const colorRegex = /\$[a-z]+\$/g;

const defaultThemes = {
  dark: {
    com: ['gray', 'thin'],
    typ: ['yellow'],
    var: ['yellow'],
    jbr: ['purple', 'thin'],
    kew: ['purple'],
    awa: ['purple'],
    pun: ['white', 'thin'],
    fun: ['blue'],
    bra: ['orange', 'thin'],
    jkw: ['red'],
    lva: ['red'],
    w: ['white'],
    gen: ['white'],
    str: ['green', 'thin'],
  },
  light: {
    com: ['grayLight', 'thin'],
    gen: ['black'],
    typ: ['green'],
    var: ['orange', 'thin'],
    jbr: ['green', 'thin'],
    kew: ['orange'],
    awa: ['purple'],
    pun: ['gray', 'thin'],
    fun: ['blue'],
    bra: ['blueDark', 'thin'],
    jkw: ['blueDark'],
    lva: ['blueDark', 'thin'],
    str: ['green', 'thin'],
    w: ['white'],
  },
};

export function toColorTokens(src: string, theme: 'light' | 'dark', themes = defaultThemes) {
  const tokens = [];
  let match;
  let lastIndex = 0;
  const result = [];
  while ((match = colorRegex.exec(src))) {
    tokens.push(match[0]);
    result.push(src.slice(lastIndex, match.index));
    lastIndex = match.index + match[0].length;
  }
  result.push(src.slice(lastIndex));

  const colors = themes[theme];

  const coloredTokens = [];

  for (const [idx, token] of Object.entries(tokens)) {
    const color = colors[(token.replaceAll('$', '') || 'w') as keyof typeof colors];
    coloredTokens.push([color, result[+idx + 1]]);
  }
  return coloredTokens;
}
