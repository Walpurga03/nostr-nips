// src/types/index.ts

// Definiere den Typ für die aktiven Seiten der Anwendung
export type ActivePage = 'home' | 'nip1' | 'nip2';

// Definiere den Typ für die Übersetzungsschlüssel basierend auf den Schlüsseln der englischen Übersetzungsdatei
export type TranslationKey = keyof typeof import('../locales/en/translation.json');