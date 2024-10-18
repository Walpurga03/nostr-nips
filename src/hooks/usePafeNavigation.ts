// src/hooks/usePageNavigation.ts

// Importiere useState aus React, um den Zustand zu verwalten
import { useState } from 'react';
// Importiere den Typ ActivePage aus den Typdefinitionen
import { ActivePage } from '../types';

// Definiere und exportiere den benutzerdefinierten Hook usePageNavigation
export const usePageNavigation = () => {
  // Definiere einen Zustand für die aktive Seite, initialisiere mit 'home'
  const [activePage, setActivePage] = useState<ActivePage>('home');
  
  // Funktion zum Navigieren zu einer bestimmten Seite
  const navigateTo = (page: ActivePage) => {
    // Setze die aktive Seite
    setActivePage(page);
    // Scrolle die Seite nach oben mit einer sanften Scroll-Animation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Rückgabe des aktuellen Zustands und der Navigationsfunktion
  return { activePage, navigateTo };
};