import { clsx } from '../clsx.js';

export type LanguageTabProps = {
    lang: string;
    selectedLang: string;
    setLang: (lang: string) => void;
}

export function LanguageTab({ lang, selectedLang, setLang }: LanguageTabProps) {
    const tabStyle = clsx(
        'tab',
        'p-2',
        'cursor-pointer',
        selectedLang === lang ? 'text-accent-300' : 'text-neutral-700',
        'hover:text-default',
    );
    return (
        <span
            className={tabStyle}
            onClick={() => setLang(lang)}
        >
            <span className="tab-indicator"></span>
            <span className="tab-caption">{lang}</span>
        </span>
    );
}
