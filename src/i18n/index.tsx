import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, TranslationDictionary } from '../types/i18n';
import { SUPPORTED_LANGUAGES, translations } from './translations';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('ai_whiteboard_lang') as SupportedLanguage;
    if (saved && translations[saved]) return saved;
    const browserLang = navigator.language.slice(0, 2) as SupportedLanguage;
    return translations[browserLang] ? browserLang : 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('ai_whiteboard_lang', lang);
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    document.documentElement.dir = langInfo?.dir || 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === language);
    document.documentElement.dir = langInfo?.dir || 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language] || translations.en;
  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === language);
  const dir = currentLangInfo?.dir || 'ltr';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
