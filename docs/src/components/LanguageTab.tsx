import './LanguageTab.styl';

export type LanguageTabProps = {
  lang: string;
  selectedLang: string;
  setLang: (lang: string) => void;
}

export function LanguageTab({ lang, selectedLang, setLang }: LanguageTabProps) {
  return (
    <span
      className={`tab ${selectedLang === lang ? 'tab-active' : ''}`}
      onClick={() => setLang(lang)}
    >
      <span className="tab-indicator"></span>
      <span className="tab-caption">{lang}</span>
    </span>
  );
}