import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Server, Users, Network, Hash, Layout, Filter, Book } from "lucide-react";
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  icon,
  children,
  defaultExpanded = false
}) => {
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
        {isExpanded ?
          <ChevronUp className="sl_transition-transform" /> :
          <ChevronDown className="sl_transition-transform" />
        }
      </button>

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

// Neue CentralConcepts Komponente direkt in der Datei
const CentralConcepts = ({ t }: { t: any }) => {
  return (
    <div>
      <div>
        <div>
          <div>
            <Filter size={24} />
            <h4>Event Kinds</h4>
          </div>
          <ul>
            <li>• Numerische Identifikatoren für Ereignistypen</li>
            <li>• Praktisch für Abfragen und Filterung von Events</li>
            <li>• Ermöglichen gezielte Suche nach bestimmten Datentypen</li>
            <li>• Teil der technischen Event-Struktur</li>
            <li>• Helfen Relays bei der effizienten Verarbeitung</li>
          </ul>
          <div>
            Beispiel: Kind 1 = öffentliche Textnachricht
          </div>
        </div>

        <div>
          <div>
            <Book size={24} />
            <h4>NIPs</h4>
          </div>
          <ul>
            <li>• Entwicklungsrichtlinien und Standards</li>
            <li>• Definieren neue Protokoll-Funktionen</li>
            <li>• Sichern Kompatibilität zwischen Clients/Relays</li>
            <li>• Dokumentieren Best Practices</li>
            <li>• Ermöglichen kontrollierte Evolution des Protokolls</li>
          </ul>
          <div>
            Beispiel: NIP-01 definiert das Basisprotokoll
          </div>
        </div>
      </div>

      <div>
        <h3>{t('event_kinds.ranges.title')}</h3>
        <div>
          <div>
            <div>0-999</div>
            <p>{t('event_kinds.ranges.regular')}</p>
          </div>
          <div>
            <div>1000-9999</div>
            <p >{t('event_kinds.ranges.regular_replaceable')}</p>
          </div>
          <div>
            <div>10000-19999</div>
            <p>{t('event_kinds.ranges.ephemeral')}</p>
          </div>
          <div>
            <div>20000-29999</div>
            <p>{t('event_kinds.ranges.parameterized')}</p>
          </div>
        </div>
      </div>

      <div>
        <p>
          <strong>Zusammenfassend:</strong> Während Event Kinds die technische Kategorisierung und
          Filterung von Ereignissen ermöglichen, bieten NIPs den Rahmen für die standardisierte
          Weiterentwicklung des Protokolls. Diese Kombination ermöglicht es Nostr, flexibel und
          dennoch kompatibel zu bleiben.
        </p>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { t, ready } = useTranslation('home');

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
      <header className="sl_page-header">
        <h1 className="sl_page-title">{t('welcome')}</h1>
        <p className="sl_page-intro">{t('nostr_intro')}</p>
      </header>

      <div>
        <Section
          id="protocol-basics"
          title={t('protocol_basics')}
          icon={<Hash className="sl_section-icon" size={24} />}
          defaultExpanded={true}
        >
          <p>{t('protocol_basics_intro')}</p>
          <div>
            <h3>{t('event_structure.title')}</h3>
            <div className="home-code-example">
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
        </Section>

        <Section
          id="protocol-concepts"
          title={t('protocol_concepts.title')}
          icon={<Layout className="sl_section-icon" size={24} />}
        >
          <CentralConcepts t={t} />
        </Section>

        <Section
          id="relays"
          title={t('relays_section.title')}
          icon={<Server className="sl_section-icon" size={24} />}
        >
          <p>{t('relays_section.intro')}</p>
          <div>
            <div>
              <h4>{t('relays_section.features.decentralized.title')}</h4>
              <p>{t('relays_section.features.decentralized.description')}</p>
            </div>
            <div>
              <h4>{t('relays_section.features.redundant.title')}</h4>
              <p>{t('relays_section.features.redundant.description')}</p>
            </div>
            <div>
              <h4>{t('relays_section.features.flexible.title')}</h4>
              <p>{t('relays_section.features.flexible.description')}</p>
            </div>
            <div>
              <h4>{t('relays_section.features.scalable.title')}</h4>
              <p>{t('relays_section.features.scalable.description')}</p>
            </div>
          </div>
        </Section>

        <Section
          id="clients"
          title={t('clients_section.title')}
          icon={<Users className="sl_section-icon" size={24} />}
        >
          <p>{t('clients_section.intro')}</p>
          <div>
            <div>
              <h4>{t('clients_section.types.web.title')}</h4>
              <p>{t('clients_section.types.web.description')}</p>
            </div>
            <div>
              <h4>{t('clients_section.types.mobile.title')}</h4>
              <p>{t('clients_section.types.mobile.description')}</p>
            </div>
            <div>
              <h4>{t('clients_section.types.desktop.title')}</h4>
              <p>{t('clients_section.types.desktop.description')}</p>
            </div>
          </div>
        </Section>

        <Section
          id="summary"
          title={t('summary.title')}
          icon={<Network className="sl_section-icon" size={24} />}
        >
          <p>{t('summary.text')}</p>
        </Section>
      </div>
    </article>
  );
};

export default Home;