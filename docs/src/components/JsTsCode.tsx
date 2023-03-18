import { toColorTokens } from '../format';
import { Code, Window } from './Window';

export type JsTsCodeProps = {
  children: string;
  theme: 'dark' | 'light';
}

const white = '#e0e0e0';
const grayLight = '#d0d0d0';
const black = '#313131';
const blue = '#5174c9';
const orange = '#d98333';
const lightOrange = '#ecab6f';
const purple = '#8e37d2';
const lightPurple = '#cb96f4';
const lightBlue = '#99c2f3';
const darkBlue = '#0d296b';
const cyan = 'hsl(195deg 86% 68%)';

const jstsTheme = {
  dark: {
    awa: [lightOrange, 'thin'],
    bra: [cyan, 'thin'],
    com: ['lightgray', 'thin'],
    fun: [lightPurple, 'thin'],
    gen: [white, 'thin'],
    jbr: [cyan, 'thin'],
    jkw: [white, 'thin'],
    kew: [lightOrange, 'thin'],
    lva: [white, 'thin'],
    pun: [grayLight, 'thin'],
    str: [lightBlue, 'thin'],
    typ: ['yellow', 'thin'],
    var: [lightBlue, 'thin'],
    w: ['white', 'thin'],
  },
  light: {
    awa: [orange, 'thin'],
    bra: [black, 'thin'],
    com: ['lightgray', 'thin'],
    fun: [purple, 'thin'],
    gen: [black, 'thin'],
    jbr: [black, 'thin'],
    jkw: [blue, 'thin'],
    kew: [orange, 'thin'],
    lva: [black, 'thin'],
    pun: [black, 'thin'],
    str: [darkBlue, 'thin'],
    typ: [black, 'thin'],
    var: [blue, 'thin'],
    w: ['white', 'thin'],
  },
};

export function JsTsCode({ children, theme }: JsTsCodeProps) {
  const tokens = toColorTokens(children, theme, jstsTheme);
  const childrenMarkup = tokens.map(([[color, className], chunk], idx) => (
    <span key={idx} className={`chunk ${className || ''}`} style={{ color: color }}>{chunk}</span>
  ));
  // const childrenMarkup = children.split('\n').map((line, idx) => <span key={idx}>{`${line}\n`}</span>);
  return (
    <div className="bash">
      <Window theme={theme} name="bash" showHeader={false}>
        <Code>{childrenMarkup}</Code>
      </Window>
    </div>
  );
}