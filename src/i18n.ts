/// <reference path="./types/translations.d.ts" />

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Deutsche Übersetzungen
import deNav from './locales/de/nav.json';
import deHome from './locales/de/home.json';
import deNip1 from './locales/de/nip1.json';
import deNip2 from './locales/de/nip2.json';
import deKeyGenerator from './locales/de/keyGenerator.json';
import dePageLayout from './locales/de/pageLayout.json';
import deFooter from './locales/de/footer.json';

// Englische Übersetzungen
import enNav from './locales/en/nav.json';
import enHome from './locales/en/home.json';
import enNip1 from './locales/en/nip1.json';
import enNip2 from './locales/en/nip2.json';
import enKeyGenerator from './locales/en/keyGenerator.json';
import enPageLayout from './locales/en/pageLayout.json';
import enFooter from './locales/en/footer.json';

// Verfügbare Sprachen
export const AVAILABLE_LANGUAGES = ['en', 'de'] as const;
export type AvailableLanguage = typeof AVAILABLE_LANGUAGES[number];

// Verfügbare Namespaces
export const NAMESPACES = ['nav', 'home', 'nip1', 'nip2', 'keyGenerator', 'pageLayout', 'footer'] as const;
export type TranslationNamespace = typeof NAMESPACES[number];

// Ressourcen mit Typsicherheit
const resources = {
  de: {
    nav: deNav,
    home: deHome,
    nip1: deNip1,
    nip2: deNip2,
    keyGenerator: deKeyGenerator,
    pageLayout: dePageLayout,
    footer: deFooter
  },
  en: {
    nav: enNav,
    home: enHome,
    nip1: enNip1,
    nip2: enNip2,
    keyGenerator: enKeyGenerator,
    pageLayout: enPageLayout,
    footer: enFooter
  }
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