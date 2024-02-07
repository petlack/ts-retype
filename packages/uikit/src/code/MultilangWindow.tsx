import { Code } from './Code.js';
import { LanguageTab } from './LanguageTab.js';
import { Window } from './Window.js';
import { useState } from 'react';

export type MultilangWindowProps = {
  theme: 'dark' | 'light';
  codes: {
    lang: string;
    code: string[];
  }[];
  selectedLang?: string;
}

export function MultilangWindow({ codes, theme, selectedLang }: MultilangWindowProps) {
    const [lang, setLang] = useState(selectedLang || codes[0].lang);

    const langsToCodes = codes.reduce(
        (res, { lang, code }) => ({ ...res, [lang]: code }),
        {} as { [lang: string]: string[] }
    );
    const code = lang in langsToCodes ? langsToCodes[lang] : [''];
    const tabsMarkup = Object.keys(langsToCodes)
        .map((lg) => (
            <LanguageTab key={lg} lang={lg} selectedLang={lang} setLang={setLang} />
        ));
    const lines = code.map((line, idx) => (
        <span key={idx}>{line}</span>
    ));

    return (
        <div className="window-multilang">
            <div className="tabs">
                {tabsMarkup}
            </div>
            <Window theme={theme} name="bash" showHeader={false}>
                {lines}
            </Window>
        </div>
    );
}
