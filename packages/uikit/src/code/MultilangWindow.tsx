import { Window, WindowProps } from './Window.js';
import { LanguageTab } from './LanguageTab.js';
import { Terminal } from './Terminal.js';
import { clsx } from '../clsx.js';
import { useState } from 'react';

export type MultilangWindowProps = Omit<WindowProps, 'children'> & {
    codes: {
        lang: string;
        code: string[];
    }[];
    selectedLang?: string;
    size?: keyof typeof sizeVariants;
    className?: string;
}

const sizeVariants = {
    sm: 'w-[20ch]',
    md: 'w-[40ch]',
    lg: 'w-[80ch]',
    xl: 'w-[120ch]',
    full: 'w-full',
};

export function MultilangWindow({
    className,
    codes,
    selectedLang,
    theme,
    size,
    ...props
}: MultilangWindowProps) {
    const [lang, setLang] = useState(selectedLang || codes[0].lang);

    const langsToCodes = codes.reduce(
        (res, { lang, code }) => ({ ...res, [lang]: code }),
        {} as { [lang: string]: string[] }
    );
    const code = lang in langsToCodes ? langsToCodes[lang] : [''];

    return (
        <div className={clsx(
            'flex-col',
            size ? sizeVariants[size]: null,
        )}>
            <div className={clsx(
                'flex flex-row pl-2',
                className,
            )}>
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
