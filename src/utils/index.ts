// src/utils/index.ts

// Funktion zum sanften Scrollen nach oben
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Funktion zum Formatieren eines Zeitstempels in ein lesbares Datum und Uhrzeit
export const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString();
};