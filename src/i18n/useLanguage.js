import { createContext, useContext } from 'react';

export const LANGUAGES = [
  { code: 'pt', label: 'PT', name: 'Português', htmlLang: 'pt-BR' },
  { code: 'en', label: 'EN', name: 'English', htmlLang: 'en' },
  { code: 'es', label: 'ES', name: 'Español', htmlLang: 'es' },
];

export const LanguageContext = createContext(null);

export function useLanguage() {
  return useContext(LanguageContext);
}
