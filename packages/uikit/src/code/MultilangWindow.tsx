import { LanguageTab } from './LanguageTab.js';
import { Terminal } from './Terminal.js';
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

    return (
        <div className="window-multilang">
            <div className="flex flex-row pl-4 pb-1">
                {tabsMarkup}
            </div>
            <Window theme={theme}>
                <Terminal>
                    {code}
                </Terminal>
            </Window>
        </div>
    );
}
