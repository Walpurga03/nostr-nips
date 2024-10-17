import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Home.css'; // Importiere die CSS-Datei für die Startseite

const Home: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <div className="home">
      <h1>{t('welcome')}</h1>
      <p>{t('nostr_intro')}</p>

      <h2>{t('what_are_nips')}</h2>
      <p>{t('nips_intro')}</p>
      <p>{t('nips_docs')}</p>
      <p>{t('nips_website')}</p>

      <h2>{t('what_are_relays')}</h2>
      <p>{t('relays_intro')}</p>

      <h2>{t('what_are_clients')}</h2>
      <p>{t('clients_intro')}</p>

      <h2>{t('summary')}</h2>
      <p>{t('summary_text')}</p>
    </div>
  );
}

export default Home;