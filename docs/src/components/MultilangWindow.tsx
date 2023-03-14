import { useState } from 'react';
import { Window, WithBash } from './Window';

import './MultilangWindow.styl';

type CodeLang = {
  lang: string;
  code: string[];
}

export type MultilangWindowProps = {
  codes: CodeLang[];
}

export function MultilangWindow({ codes }: MultilangWindowProps) {
  const width = Math.max(...codes.map(c => Math.max(...c.code.map(c => c.length)))) + 1;

  const langsToCodes = codes.reduce(
    (res, { lang, code }) => ({ ...res, [lang]: code }),
    {} as { [lang: string]: string[] }
  );
  const [lang, setLang] = useState(codes[0].lang);
  const code = lang in langsToCodes ? langsToCodes[lang] : [''];
  const tabsMarkup = Object.keys(langsToCodes)
    .map((lg) => (
      <span
        key={lg}
        className={`tab ${lang === lg ? 'tab-active' : ''}`}
        onClick={() => setLang(lg)}
      >{lg}</span>
    ));
  const codeMarkup = code.map((line, idx) => (
    <span key={idx}>{`${line.padEnd(width, ' ')}\n`}</span>
  ));
  return (
    <div className="bash">
      <div className="tabs">
        {tabsMarkup}
      </div>
      <Window theme="dark" name="bash" showHeader={false}>
        <WithBash>
          {codeMarkup}
        </WithBash>
      </Window>
    </div>
  );
}