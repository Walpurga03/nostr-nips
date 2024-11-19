/// <reference path="./types/translations.d.ts" />

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';

// Verfügbare Sprachen
export const AVAILABLE_LANGUAGES = ['en', 'de'] as const;
export type AvailableLanguage = typeof AVAILABLE_LANGUAGES[number];

// Verfügbare Namespaces
export const NAMESPACES = ['nav', 'home', 'nip1', 'nip2', 'keyGenerator'] as const;
export type TranslationNamespace = typeof NAMESPACES[number];

// Ressourcen mit Typsicherheit
const resources = {
  en: translationEN,
  de: translationDE
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: AVAILABLE_LANGUAGES,
    
    // Interpolation
    interpolation: {
      escapeValue: false
    },
    
    // Namespaces
    defaultNS: 'nav',
    ns: NAMESPACES,
    
    // Spracherkennung
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      htmlTag: document.documentElement
    },
    
    // Debug-Modus (nur in Entwicklung)
    debug: process.env.NODE_ENV === 'development',
    
    // React-spezifische Optionen
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      nsMode: 'default'
    }
  });

// Setze die HTML lang attribute
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng);
});

export default i18n;