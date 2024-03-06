import { clsx } from '../clsx.js';

export type LanguageTabProps = {
    lang: string;
    selectedLang: string;
    setLang: (lang: string) => void;
}

export function LanguageTab({ lang, selectedLang, setLang }: LanguageTabProps) {
    const isCurrent = selectedLang === lang;
    const tabStyle = clsx(
        'tab',
        'p-2',
        'cursor-pointer',
        'font-bold',
        'transition duration-500 ease-in-out',
        isCurrent ? [
            'text-accent-600',
            'hover:text-accent-700',
        ] : [
            'text-neutral-300',
            'hover:text-neutral-900',
        ],
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
