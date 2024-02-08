import { LanguageTab } from './LanguageTab.js';
import { Terminal } from './Terminal.js';
import { Window, WindowProps } from './Window.js';
import { useState } from 'react';

export type MultilangWindowProps = Omit<WindowProps, 'children'> & {
  codes: {
    lang: string;
    code: string[];
  }[];
  selectedLang?: string;
}

export function MultilangWindow({ codes, theme, selectedLang, ...props }: MultilangWindowProps) {
    const [lang, setLang] = useState(selectedLang || codes[0].lang);

    const langsToCodes = codes.reduce(
        (res, { lang, code }) => ({ ...res, [lang]: code }),
        {} as { [lang: string]: string[] }
    );
    const code = lang in langsToCodes ? langsToCodes[lang] : [''];

    return (
        <div className="flex-col">
            <div className="flex flex-row pl-4 pb-1">
                {Object.keys(langsToCodes)
                    .map((lg) => (
                        <LanguageTab
                            key={lg}
                            lang={lg}
                            selectedLang={lang}
                            setLang={setLang}
                        />
                    ))}
            </div>
            <Window theme={theme} {...props}>
                <Terminal>
                    {code}
                </Terminal>
            </Window>
        </div>
    );
}
