import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Server,
  Users,
  Network,
  Hash,
  Layout,
  Filter,
  Book,
  Shield,
  Settings,
  TrendingUp
} from "lucide-react";
import { ChevronUp, ChevronDown } from 'lucide-react';

// Typen und Interfaces
/**
 * Props für ausklappbare Abschnitte auf der Startseite
 * @interface SectionProps
 * @property {string} id - Eindeutiger Identifikator für den Abschnitt
 * @property {string} title - Überschrift des Abschnitts
 * @property {React.ReactNode} icon - Icon-Komponente zur Anzeige
 * @property {React.ReactNode} children - Inhalt, der beim Ausklappen angezeigt wird
 * @property {boolean} [defaultExpanded] - Ob der Abschnitt standardmäßig ausgeklappt sein soll
 */
interface SectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

/**
 * Ausklappbare Abschnittskomponente mit Animation und Barrierefreiheitsfunktionen
 * @component Section
 * @param {SectionProps} props - Komponentenprops
 */
const Section: React.FC<SectionProps> = ({
  id,
  title,
  icon,
  children,
  defaultExpanded = false
}) => {
  // Zustand für das Tracking des ausgeklappten Status
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section className="sl_content-section" id={id}>
      <button
        className="sl_section-header sl_interactive"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`section-content-${id}`}
      >
        {icon}
        <h2>{title}</h2>
        {/* Icon je nach Ausklappzustand wechseln */}
        {isExpanded ?
          <ChevronUp className="sl_transition-transform" /> :
          <ChevronDown className="sl_transition-transform" />
        }
      </button>

      {/* Inhalt mit ARIA-Attributen für Barrierefreiheit bedingt rendern */}
      {isExpanded && (
        <div
          className="home-section-content"
          id={`section-content-${id}`}
          role="region"
          aria-labelledby={id}
        >
          {children}
        </div>
      )}
    </section>
  );
};

/**
 * Zentrale Konzepte-Komponente zur Erklärung von Event Kinds und NIPs
 * Diese Komponente wurde für bessere Organisation und mögliche Wiederverwendung separiert
 * @component CentralConcepts
 * @param {{ t: any }} props - Übersetzungsfunktion von i18next
 */
const CentralConcepts = ({ t }: { t: any }) => {
  return (
    <div className="home-protocol-concepts-container">
      {/* Event Kinds und NIPs Grid */}
      <div className="home-concepts-grid">
        {/* Event Kinds Card */}
        <div className="home-concept-card">
          <div className="home-concept-card-header">
            <Filter size={24} />
            <h4>{t('central_concepts.event_kinds.title')}</h4>
          </div>
          <ul className="home-concept-list">
            {t('central_concepts.event_kinds.list_items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div className="home-concept-example">
            {t('central_concepts.event_kinds.example')}
          </div>
        </div>

        {/* NIPs Card */}
        <div className="home-concept-card">
          <div className="home-concept-card-header">
            <Book size={24} />
            <h4>{t('central_concepts.nips.title')}</h4>
          </div>
          <ul className="home-concept-list">
            {t('central_concepts.nips.list_items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div className="home-concept-example">
            {t('central_concepts.nips.example')}
          </div>
        </div>
      </div>

      {/* Event Kinds Ranges */}
      <div className="home-event-kinds-ranges">
        <h3>{t('event_kinds.ranges.title')}</h3>
        <div className="home-ranges-grid">
          <div className="home-range-card">
            <div className="home-range-number">0-999</div>
            <p className="home-range-description">{t('event_kinds.ranges.regular')}</p>
          </div>
          <div className="home-range-card">
            <div className="home-range-number">1000-9999</div>
            <p className="home-range-description">{t('event_kinds.ranges.regular_replaceable')}</p>
          </div>
          <div className="home-range-card">
            <div className="home-range-number">10000-19999</div>
            <p className="home-range-description">{t('event_kinds.ranges.ephemeral')}</p>
          </div>
          <div className="home-range-card">
            <div className="home-range-number">20000-29999</div>
            <p className="home-range-description">{t('event_kinds.ranges.parameterized')}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="home-concepts-summary">
        <p>
          <strong>{t('central_concepts.summary.title')}:</strong> {t('central_concepts.summary.text')}
        </p>
      </div>
    </div>
  );
};

/**
 * Home-Komponente als Hauptlandingpage für den Nostr NIPs Explorer
 * Bietet einen Überblick über Kernkonzepte und Protokoll-Grundlagen
 * 
 * Designentscheidungen:
 * - Verwendung von ausklappbaren Abschnitten für bessere Übersichtlichkeit
 * - Standardmäßiges Ausklappen des Basics-Abschnitts für direkte Informationsvermittlung
 * - Icon-basierte Navigation für intuitive Bedienung
 * - Responsive Design für verschiedene Bildschirmgrößen
 * 
 * @component Home
 */
const Home: React.FC = () => {
  // Initialisierung des Übersetzungs-Hooks mit 'home' Namespace
  const { t, ready } = useTranslation('home');

  // Ladezustand anzeigen, während Übersetzungen geladen werden
  if (!ready) {
    return (
      <div>
        <div />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <article>
      {/* Seitenkopf */}
      <header className="sl_page-header">
        <h1 className="sl_page-title">{t('welcome')}</h1>
        <p className="sl_page-intro">{t('nostr_intro')}</p>
      </header>

      {/* Hauptinhaltsbereiche */}
      <main className="sections-container">
        {/* Protokoll-Grundlagen Abschnitt */}
        <Section
          id="protocol-basics"
          title={t('protocol_basics')}
          icon={<Hash className="sl_section-icon" size={24} />}
          defaultExpanded={true}
        >
          <div className="home-protocol-basics-container">
            <p className="home-protocol-basics-intro">{t('protocol_basics_intro')}</p>
            <div className="home-event-structure-container">
              <h3 className="home-event-structure-heading">{t('event_structure.title')}</h3>
              <div className="home-code-example-container">
                <pre className="home-code-example-pre">
                  <code>
                    {`{
  `}<span className="home-code-example-key">"id"</span>{`: "...",        // ${t('event_structure.id_desc')}
  `}<span className="home-code-example-key">"pubkey"</span>{`: "...",    // ${t('event_structure.pubkey_desc')}
  `}<span className="home-code-example-key">"created_at"</span>{`: ...,  // ${t('event_structure.created_at_desc')}
  `}<span className="home-code-example-key">"kind"</span>{`: ...,        // ${t('event_structure.kind_desc')}
  `}<span className="home-code-example-key">"tags"</span>{`: [...],      // ${t('event_structure.tags_desc')}
  `}<span className="home-code-example-key">"content"</span>{`: "...",   // ${t('event_structure.content_desc')}
  `}<span className="home-code-example-key">"sig"</span>{`: "..."        // ${t('event_structure.sig_desc')}
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </Section>

        {/* Protokoll-Konzepte Abschnitt */}
        <Section
          id="protocol-concepts"
          title={t('protocol_concepts.title')}
          icon={<Layout className="sl_section-icon" size={24} />}
        >
          <CentralConcepts t={t} />
        </Section>

        {/* Relays Abschnitt */}
        <Section
          id="relays"
          title={t('relays_section.title')}
          icon={<Server className="sl_section-icon" size={24} />}
        >
          <div className="home-relays-container">
            <p className="home-relays-intro">{t('relays_section.intro')}</p>

            <div className="home-relays-features-grid">
              {/* Dezentralisiert Feature */}
              <div className="home-relay-feature-card">
                <div className="home-relay-feature-header">
                  <div className="home-relay-feature-icon">
                    <Network size={24} />
                  </div>
                  <h4 className="home-relay-feature-title">
                    {t('relays_section.features.decentralized.title')}
                  </h4>
                </div>
                <p className="home-relay-feature-description">
                  {t('relays_section.features.decentralized.description')}
                </p>
                <div className="home-relay-status">Active Nodes</div>
              </div>

              {/* Redundant Feature */}
              <div className="home-relay-feature-card">
                <div className="home-relay-feature-header">
                  <div className="home-relay-feature-icon">
                    <Shield size={24} />
                  </div>
                  <h4 className="home-relay-feature-title">
                    {t('relays_section.features.redundant.title')}
                  </h4>
                </div>
                <p className="home-relay-feature-description">
                  {t('relays_section.features.redundant.description')}
                </p>
                <div className="home-relay-status">Backup Ready</div>
              </div>

              {/* Flexibel Feature */}
              <div className="home-relay-feature-card">
                <div className="home-relay-feature-header">
                  <div className="home-relay-feature-icon">
                    <Settings size={24} />
                  </div>
                  <h4 className="home-relay-feature-title">
                    {t('relays_section.features.flexible.title')}
                  </h4>
                </div>
                <p className="home-relay-feature-description">
                  {t('relays_section.features.flexible.description')}
                </p>
                <div className="home-relay-status">Configurable</div>
              </div>

              {/* Skalierbar Feature */}
              <div className="home-relay-feature-card">
                <div className="home-relay-feature-header">
                  <div className="home-relay-feature-icon">
                    <TrendingUp size={24} />
                  </div>
                  <h4 className="home-relay-feature-title">
                    {t('relays_section.features.scalable.title')}
                  </h4>
                </div>
                <p className="home-relay-feature-description">
                  {t('relays_section.features.scalable.description')}
                </p>
                <div className="home-relay-status">High Performance</div>
              </div>
            </div>
          </div>
        </Section>

        {/* Clients Abschnitt */}
        <Section
          id="clients"
          title={t('clients_section.title')}
          icon={<Users className="sl_section-icon" size={24} />}
        >
          <div className="home-clients-container">
            <p className="home-clients-intro">{t('clients_section.intro')}</p>

            <div className="home-client-types-grid">
              {/* Web Client Card */}
              <div className="home-client-type-card home-client-type-web">
                <div className="home-client-type-icon">
                  <Layout size={24} />
                </div>
                <h4 className="home-client-type-title">
                  {t('clients_section.types.web.title')}
                </h4>
                <p className="home-client-type-description">
                  {t('clients_section.types.web.description')}
                </p>
                <div className="home-client-features">
                  <span className="home-client-feature-tag">
                    <Layout size={14} />
                    Browser-basiert
                  </span>
                  <span className="home-client-feature-tag">
                    <Network size={14} />
                    Überall verfügbar
                  </span>
                </div>
              </div>

              {/* Mobile Client Card */}
              <div className="home-client-type-card home-client-type-mobile">
                <div className="home-client-type-icon">
                  <Users size={24} />
                </div>
                <h4 className="home-client-type-title">
                  {t('clients_section.types.mobile.title')}
                </h4>
                <p className="home-client-type-description">
                  {t('clients_section.types.mobile.description')}
                </p>
                <div className="home-client-features">
                  <span className="home-client-feature-tag">
                    <Users size={14} />
                    iOS & Android
                  </span>
                  <span className="home-client-feature-tag">
                    <Server size={14} />
                    Push Support
                  </span>
                </div>
              </div>

              {/* Desktop Client Card */}
              <div className="home-client-type-card home-client-type-desktop">
                <div className="home-client-type-icon">
                  <Server size={24} />
                </div>
                <h4 className="home-client-type-title">
                  {t('clients_section.types.desktop.title')}
                </h4>
                <p className="home-client-type-description">
                  {t('clients_section.types.desktop.description')}
                </p>
                <div className="home-client-features">
                  <span className="home-client-feature-tag">
                    <Server size={14} />
                    Volle Kontrolle
                  </span>
                  <span className="home-client-feature-tag">
                    <Network size={14} />
                    Offline Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Zusammenfassungs-Abschnitt */}
        <Section
          id="summary"
          title={t('summary.title')}
          icon={<Network className="sl_section-icon" size={24} />}
        >
          <div className="home-summary-container">
            <div className="home-summary-content">
              <h2 className="home-summary-title">
                <Network size={32} />
                {t('summary.title')}
              </h2>

              <div className="home-summary-text">
                {/* Split text and highlight key terms */}
                {t('summary.text').split(' ').map((word, index) => {
                  const isKeyword = [
                    'Nostr',
                    'NIPs',
                    'Protokoll',
                    'dezentral',
                    'Relays',
                    'Clients'
                  ].includes(word);

                  return isKeyword ? (
                    <span key={index} className="home-summary-keyword">
                      {word}{' '}
                    </span>
                  ) : (
                    word + ' '
                  );
                })}
              </div>

              <div className="home-summary-info-box">
                <Layout size={24} />
                <p>{t('summary.info_box')}</p>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </article>
  );
};

export default Home;