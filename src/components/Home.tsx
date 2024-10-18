import React from 'react';
import { useTranslation } from 'react-i18next';

// Definiere die Struktur für die Abschnitte auf der Startseite
interface Section {
  title: string;
  contents: string[];
}

// Definiere die Abschnitte und deren Inhalte
const SECTIONS: Section[] = [
  {
    title: 'what_are_nips',
    contents: ['nips_intro', 'nips_docs', 'nips_website']
  },
  {
    title: 'what_are_relays',
    contents: ['relays_intro']
  },
  {
    title: 'what_are_clients',
    contents: ['clients_intro']
  },
  {
    title: 'summary',
    contents: ['summary_text']
  }
];

const Home: React.FC = () => {
  const { t, ready } = useTranslation('home');

  // Zeige einen Ladebildschirm, wenn die Übersetzungen noch nicht bereit sind
  if (!ready) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <article className="home">
      <header>
        <h1>{t('welcome')}</h1>
        <p className="intro">{t('nostr_intro')}</p>
      </header>

      {/* Render die Abschnitte dynamisch basierend auf den SECTIONS */}
      {SECTIONS.map(({ title, contents }) => (
        <section key={title}>
          <h2>{t(title)}</h2>
          {contents.map((content) => (
            <p key={content}>{t(content)}</p>
          ))}
        </section>
      ))}
    </article>
  );
};

export default Home;