import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './i18n'; // Importiere die i18n-Konfiguration

// Erstelle das Root-Element und rendere die App-Komponente
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);