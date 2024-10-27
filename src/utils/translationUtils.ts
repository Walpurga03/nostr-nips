// src/utils/translationUtils.ts

/**
 * Hilfsfunktion zum sicheren Abrufen von Array-Übersetzungen
 * @param t - Die Übersetzungsfunktion von useTranslation
 * @param key - Der Übersetzungsschlüssel
 * @returns Ein Array von Strings oder ein leeres Array wenn die Übersetzung nicht existiert
 */
export const getArrayTranslation = (t: any, key: string): string[] => {
    try {
      const value = t(key, { returnObjects: true });
      return Array.isArray(value) ? value : [];
    } catch (error) {
      console.warn(`Translation error for key ${key}:`, error);
      return [];
    }
  };
  
  /**
   * Hilfsfunktion zum sicheren Abrufen von Objekt-Übersetzungen
   * @param t - Die Übersetzungsfunktion von useTranslation
   * @param key - Der Übersetzungsschlüssel
   * @returns Ein Objekt des spezifizierten Typs oder ein leeres Objekt wenn die Übersetzung nicht existiert
   */
  export const getObjectTranslation = <T extends object>(t: any, key: string): T => {
    try {
      const value = t(key, { returnObjects: true });
      return (typeof value === 'object' && value !== null ? value : {}) as T;
    } catch (error) {
      console.warn(`Translation error for key ${key}:`, error);
      return {} as T;
    }
  };
  
  /**
   * Interface für übersetzte Felder mit Titel und Beschreibung
   */
  export interface TranslatedField {
    title: string;
    description: string;
    technical?: string;
    examples?: string[];
  }
  
  /**
   * Interface für ein Objekt von übersetzten Feldern
   */
  export interface TranslatedFields {
    [key: string]: TranslatedField;
  }