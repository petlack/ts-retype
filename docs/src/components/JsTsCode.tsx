import { toColorTokens } from '../format';
import { Code, Window } from './Window';

export type JsTsCodeProps = {
  children: string;
}

const black = '#313131';
const blue = '#5174c9';
const orange = '#d98333';
const purple = '#8e37d2';
const darkBlue = '#0d296b';

const jstsTheme = {
  dark: {
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

export function JsTsCode({ children }: JsTsCodeProps) {
  const tokens = toColorTokens(children, 'light', jstsTheme);
  const childrenMarkup = tokens.map(([[color, className], chunk], idx) => (
    <span key={idx} className={`chunk ${className || ''}`} style={{ color: color }}>{chunk}</span>
  ));
  // const childrenMarkup = children.split('\n').map((line, idx) => <span key={idx}>{`${line}\n`}</span>);
  return (
    <div className="bash">
      <Window theme="light" name="bash" showHeader={false}>
        <Code>{childrenMarkup}</Code>
      </Window>
    </div>
  );
}