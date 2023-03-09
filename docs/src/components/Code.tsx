import { useState } from 'react';

import './code.styl';

type SingleCodeProps = { code: string }
type MultilangCodeProps = { codes: { lang: string, code: string }[] }
export type CodeProps = SingleCodeProps | MultilangCodeProps

function SingleCode({ code }: SingleCodeProps) {
  return (
    <div className="code">
      <p className="line bash"><span>{code}</span></p>
    </div>
  );
}

function MultilangCode({ codes }: MultilangCodeProps) {
  const langsToCodes = codes.reduce(
    (res, { lang, code }) => ({ ...res, [lang]: code }),
    {} as { [lang: string]: string }
  );
  const [lang, setLang] = useState(Object.keys(langsToCodes)[0]);
  const code = lang in langsToCodes ? langsToCodes[lang] : '';
  return (
    <div className="code-lang">
      <div className="lang-menu">
        {Object.keys(langsToCodes)
          .map((lg) => (
            <span
              key={lg}
              className={lang === lg ? 'active' : ''}
              onClick={() => setLang(lg)}
            >{lg}</span>
          ))
        }
      </div>
      <div className="code">
        <p className="line bash"><span>{code}</span></p>
      </div>
    </div>
  );
}

export default function Code(props: CodeProps) {
  if ((props as SingleCodeProps).code) {
    return SingleCode(props as SingleCodeProps);
  }
  return MultilangCode(props as MultilangCodeProps);
}