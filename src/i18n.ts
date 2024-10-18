// Importiere notwendige Module und Übersetzungen
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';

// Definiere verfügbare Sprachen
export const AVAILABLE_LANGUAGES = ['en', 'de'] as const;
export type AvailableLanguage = typeof AVAILABLE_LANGUAGES[number];
export type TranslationNamespace = 'home' | 'nip1' | 'nip2';

// Typsichere Version des resources-Objekts
const resources: Record<AvailableLanguage, Record<TranslationNamespace, any>> = {
  en: {
    home: translationEN.home,
    nip1: translationEN.nip1,
    nip2: translationEN.nip2
  },
  de: {
    home: translationDE.home,
    nip1: translationDE.nip1,
    nip2: translationDE.nip2
  }
};

// Initialisiere i18n mit den Ressourcen und Konfigurationen
i18n
  .use(LanguageDetector) // Verwende LanguageDetector für die Spracherkennung
  .use(initReactI18next) // Initialisiere react-i18next
  .init({
    resources, // Übersetzungsressourcen
    fallbackLng: 'en', // Fallback-Sprache
    interpolation: {
      escapeValue: false // Keine Escapes für React
    },
    debug: false, // Debugging deaktiviert
    defaultNS: 'home', // Standard-Namespace
    ns: ['home', 'nip1', 'nip2'], // Verfügbare Namespaces
    detection: {
      order: ['localStorage', 'navigator'], // Reihenfolge der Spracherkennung
      caches: ['localStorage'] // Caching-Mechanismus
    }
  });

export default i18n;