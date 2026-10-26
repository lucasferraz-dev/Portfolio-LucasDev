import { useEffect, useState } from 'react';
import pt from './locales/pt';
import en from './locales/en';
import es from './locales/es';
import { LANGUAGES, LanguageContext } from './useLanguage';

const TRANSLATIONS = { pt, en, es };
const STORAGE_KEY = 'lang';

function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in TRANSLATIONS) return saved;
  } catch {}

  const browserLangs = navigator.languages?.length ? navigator.languages : [navigator.language];
  const match = browserLangs
    .map((lang) => lang?.slice(0, 2).toLowerCase())
    .find((code) => code in TRANSLATIONS);

  return match ?? 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectLanguage);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const { htmlLang } = LANGUAGES.find((l) => l.code === lang);
    document.documentElement.lang = htmlLang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, [lang, t]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
