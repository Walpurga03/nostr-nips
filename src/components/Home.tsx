import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Server, Users, Code, Network, Hash, Layout, Trash } from "lucide-react";

const getArrayTranslation = (t: any, key: string): string[] => {
  try {
    const value = t(key, { returnObjects: true }) as string[] | string;
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.error(`Translation error for key ${key}:`, error);
    return [];
  }
};

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => (
  <section className="content-section">
    <div className="section-header">
      {icon}
      <h2>{title}</h2>
    </div>
    {children}
  </section>
);

const Home: React.FC = () => {
  const { t, ready } = useTranslation('home');

  if (!ready) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // Event Structure Section
  const renderEventStructure = () => (
    <div className="event-structure">
      <h3>{t('event_structure.title')}</h3>
      <div className="code-example">
        <pre>
          {`{
  "id": "...",        // ${t('event_structure.id_desc')}
  "pubkey": "...",    // ${t('event_structure.pubkey_desc')}
  "created_at": ...,  // ${t('event_structure.created_at_desc')}
  "kind": ...,        // ${t('event_structure.kind_desc')}
  "tags": [...],      // ${t('event_structure.tags_desc')}
  "content": "...",   // ${t('event_structure.content_desc')}
  "sig": "..."        // ${t('event_structure.sig_desc')}
}`}
        </pre>
      </div>
    </div>
  );

  // NIPs Section
  const renderNipsSection = () => (
    <div className="nips-explanation">
      <p className="content-text">{t('nips_section.intro')}</p>
      <p className="content-text">{t('nips_section.docs')}</p>
      <div className="points-list">
        {getArrayTranslation(t, 'nips_section.explanation.points').map((point, index) => (
          <div key={index} className="point-item">
            <span className="point-marker">•</span>
            <span>{point}</span>
          </div>
        ))}
      </div>
      <div className="example-box">
        <div className="example-title">{t('nips_section.examples.title')}</div>
        <ul className="example-list">
          <li>{t('nips_section.examples.nip01')}</li>
          <li>{t('nips_section.examples.nip02')}</li>
          <li>{t('nips_section.examples.nip03')}</li>
          <li>{t('nips_section.examples.nip04')}</li>
        </ul>
      </div>
    </div>
  );

  // Event Kinds Section
  const renderEventKinds = () => (
    <div className="kinds-section">
      <div className="kinds-explanation">
        <h3>{t('event_kinds.explanation_title')}</h3>
        <p className="kinds-intro">{t('event_kinds.explanation_intro')}</p>
        <div className="points-list">
          {getArrayTranslation(t, 'event_kinds.purpose_points').map((point, index) => (
            <div key={index} className="point-item">
              <span className="point-marker">•</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
        <p>{t('event_kinds.connection_to_nips')}</p>
      </div>

      <div className="ranges-grid">
        <h3>{t('event_kinds.ranges.title')}</h3>
        <div className="range-grid">
          <div className="range-item">
            <span className="range-value">0-999</span>
            <p>{t('event_kinds.ranges.regular')}</p>
          </div>
          <div className="range-item">
            <span className="range-value">1000-9999</span>
            <p>{t('event_kinds.ranges.regular_replaceable')}</p>
          </div>
          <div className="range-item">
            <span className="range-value">10000-19999</span>
            <p>{t('event_kinds.ranges.ephemeral')}</p>
          </div>
          <div className="range-item">
            <span className="range-value">20000-29999</span>
            <p>{t('event_kinds.ranges.parameterized')}</p>
          </div>
        </div>
      </div>

      <div className="common-kinds">
        <h3>{t('event_kinds.common_title')}</h3>
        <div className="kinds-grid">
          <div className="kind-item">
            <Code size={20} />
            <h4>Kind 0</h4>
            <p>{t('event_kinds.metadata')}</p>
          </div>
          <div className="kind-item">
            <MessageCircle size={20} />
            <h4>Kind 1</h4>
            <p>{t('event_kinds.text_note')}</p>
          </div>
          <div className="kind-item">
            <Server size={20} />
            <h4>Kind 2</h4>
            <p>{t('event_kinds.recommend_server')}</p>
          </div>
          <div className="kind-item">
            <Users size={20} />
            <h4>Kind 3</h4>
            <p>{t('event_kinds.contacts')}</p>
          </div>
          <div className="kind-item">
            <MessageCircle size={20} />
            <h4>Kind 4</h4>
            <p>{t('event_kinds.direct_message')}</p>
          </div>
          <div className="kind-item">
            <Trash size={20} />
            <h4>Kind 5</h4>
            <p>{t('event_kinds.deletion')}</p>
          </div>
        </div>
      </div>

      <div className="implementation-example">
        <h3>{t('implementation_example.title')}</h3>
        <p>{t('implementation_example.content')}</p>
      </div>
    </div>
  );

  // Relays Section
  const renderRelays = () => (
    <div>
      <p className="content-text">{t('relays_section.intro')}</p>
      <div className="feature-grid">
        <div className="feature-item">
          <h4>{t('relays_section.features.decentralized.title')}</h4>
          <p>{t('relays_section.features.decentralized.description')}</p>
        </div>
        <div className="feature-item">
          <h4>{t('relays_section.features.redundant.title')}</h4>
          <p>{t('relays_section.features.redundant.description')}</p>
        </div>
        <div className="feature-item">
          <h4>{t('relays_section.features.flexible.title')}</h4>
          <p>{t('relays_section.features.flexible.description')}</p>
        </div>
        <div className="feature-item">
          <h4>{t('relays_section.features.scalable.title')}</h4>
          <p>{t('relays_section.features.scalable.description')}</p>
        </div>
      </div>
    </div>
  );

  // Clients Section
  const renderClients = () => (
    <div>
      <p className="content-text">{t('clients_section.intro')}</p>
      <div className="client-types">
        <div className="client-type">
          <h4>{t('clients_section.types.web.title')}</h4>
          <p>{t('clients_section.types.web.description')}</p>
        </div>
        <div className="client-type">
          <h4>{t('clients_section.types.mobile.title')}</h4>
          <p>{t('clients_section.types.mobile.description')}</p>
        </div>
        <div className="client-type">
          <h4>{t('clients_section.types.desktop.title')}</h4>
          <p>{t('clients_section.types.desktop.description')}</p>
        </div>
      </div>
    </div>
  );

  return (
    <article className="home">
      <header className="home-header">
        <h1 className="title-gradient">{t('welcome')}</h1>
        <p className="intro-text">{t('nostr_intro')}</p>
      </header>

      <div className="sections-container">
        <Section title={t('protocol_basics')} icon={<Hash className="section-icon" size={24} />}>
          <p className="content-text">{t('protocol_basics_intro')}</p>
          {renderEventStructure()}
        </Section>

        <Section title={t('protocol_concepts.title')} icon={<Layout className="section-icon" size={24} />}>
          <h3>{t('protocol_concepts.nips_vs_kinds')}</h3>
          <p className="content-text">{t('protocol_concepts.nips_vs_kinds_explanation')}</p>
          {renderNipsSection()}
          {renderEventKinds()}
        </Section>

        <Section title={t('relays_section.title')} icon={<Server className="section-icon" size={24} />}>
          {renderRelays()}
        </Section>

        <Section title={t('clients_section.title')} icon={<Users className="section-icon" size={24} />}>
          {renderClients()}
        </Section>

        <Section title={t('summary.title')} icon={<Network className="section-icon" size={24} />}>
          <p className="content-text">{t('summary.text')}</p>
        </Section>
      </div>
    </article>
  );
};

export default Home;