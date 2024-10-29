import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Server, Users, Code, Network, Hash, Layout, Trash, Filter, Book } from "lucide-react";
import { ChevronUp, ChevronDown } from 'lucide-react';

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
    <section className="content-section" id={id}>
      <button
        className="section-header interactive"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`section-content-${id}`}
      >
        {icon}
        <h2>{title}</h2>
        {isExpanded ?
          <ChevronUp className="transition-transform" /> :
          <ChevronDown className="transition-transform" />
        }
      </button>

      {isExpanded && (
        <div
          className="section-content"
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
    <div className="central-concepts">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="concept-box bg-opacity-10 bg-white p-6 rounded-lg border border-opacity-20 hover:transform hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-purple-400" size={24} />
            <h4 className="text-lg font-semibold">Event Kinds</h4>
          </div>
          <ul className="space-y-3 text-sm">
            <li>• Numerische Identifikatoren für Ereignistypen</li>
            <li>• Praktisch für Abfragen und Filterung von Events</li>
            <li>• Ermöglichen gezielte Suche nach bestimmten Datentypen</li>
            <li>• Teil der technischen Event-Struktur</li>
            <li>• Helfen Relays bei der effizienten Verarbeitung</li>
          </ul>
          <div className="mt-4 text-sm text-purple-300">
            Beispiel: Kind 1 = öffentliche Textnachricht
          </div>
        </div>

        <div className="concept-box bg-opacity-10 bg-white p-6 rounded-lg border border-opacity-20 hover:transform hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-3 mb-4">
            <Book className="text-purple-400" size={24} />
            <h4 className="text-lg font-semibold">NIPs</h4>
          </div>
          <ul className="space-y-3 text-sm">
            <li>• Entwicklungsrichtlinien und Standards</li>
            <li>• Definieren neue Protokoll-Funktionen</li>
            <li>• Sichern Kompatibilität zwischen Clients/Relays</li>
            <li>• Dokumentieren Best Practices</li>
            <li>• Ermöglichen kontrollierte Evolution des Protokolls</li>
          </ul>
          <div className="mt-4 text-sm text-purple-300">
            Beispiel: NIP-01 definiert das Basisprotokoll
          </div>
        </div>
      </div>

      <div className="kinds-ranges bg-opacity-5 bg-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">{t('event_kinds.ranges.title')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="kind-range-box p-4 bg-opacity-10 bg-white rounded-lg">
            <div className="font-semibold text-purple-400 mb-2">0-999</div>
            <p className="text-sm">{t('event_kinds.ranges.regular')}</p>
          </div>
          <div className="kind-range-box p-4 bg-opacity-10 bg-white rounded-lg">
            <div className="font-semibold text-purple-400 mb-2">1000-9999</div>
            <p className="text-sm">{t('event_kinds.ranges.regular_replaceable')}</p>
          </div>
          <div className="kind-range-box p-4 bg-opacity-10 bg-white rounded-lg">
            <div className="font-semibold text-purple-400 mb-2">10000-19999</div>
            <p className="text-sm">{t('event_kinds.ranges.ephemeral')}</p>
          </div>
          <div className="kind-range-box p-4 bg-opacity-10 bg-white rounded-lg">
            <div className="font-semibold text-purple-400 mb-2">20000-29999</div>
            <p className="text-sm">{t('event_kinds.ranges.parameterized')}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple-900 bg-opacity-20 rounded-lg">
        <p className="text-sm">
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
      <div className="loading-container">
        <div className="loading-spinner" />
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <article className="page-container">
      <header className="page-header">
        <h1 className="page-title">{t('welcome')}</h1>
        <p className="page-intro">{t('nostr_intro')}</p>
      </header>

      <div className="sections-container">
        <Section
          id="protocol-basics"
          title={t('protocol_basics')}
          icon={<Hash className="section-icon" size={24} />}
          defaultExpanded={true}
        >
          <p className="content-text">{t('protocol_basics_intro')}</p>
          <div className="code-section">
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
        </Section>

        <Section
          id="protocol-concepts"
          title={t('protocol_concepts.title')}
          icon={<Layout className="section-icon" size={24} />}
        >
          <CentralConcepts t={t} />
        </Section>

        <Section
          id="relays"
          title={t('relays_section.title')}
          icon={<Server className="section-icon" size={24} />}
        >
          <p className="content-text">{t('relays_section.intro')}</p>
          <div className="cards-grid">
            <div className="feature-item card">
              <h4 className="card-title">{t('relays_section.features.decentralized.title')}</h4>
              <p className="card-text">{t('relays_section.features.decentralized.description')}</p>
            </div>
            <div className="feature-item card">
              <h4 className="card-title">{t('relays_section.features.redundant.title')}</h4>
              <p className="card-text">{t('relays_section.features.redundant.description')}</p>
            </div>
            <div className="feature-item card">
              <h4 className="card-title">{t('relays_section.features.flexible.title')}</h4>
              <p className="card-text">{t('relays_section.features.flexible.description')}</p>
            </div>
            <div className="feature-item card">
              <h4 className="card-title">{t('relays_section.features.scalable.title')}</h4>
              <p className="card-text">{t('relays_section.features.scalable.description')}</p>
            </div>
          </div>
        </Section>

        <Section
          id="clients"
          title={t('clients_section.title')}
          icon={<Users className="section-icon" size={24} />}
        >
          <p className="content-text">{t('clients_section.intro')}</p>
          <div className="cards-grid">
            <div className="client-item card">
              <h4 className="card-title">{t('clients_section.types.web.title')}</h4>
              <p className="card-text">{t('clients_section.types.web.description')}</p>
            </div>
            <div className="client-item card">
              <h4 className="card-title">{t('clients_section.types.mobile.title')}</h4>
              <p className="card-text">{t('clients_section.types.mobile.description')}</p>
            </div>
            <div className="client-item card">
              <h4 className="card-title">{t('clients_section.types.desktop.title')}</h4>
              <p className="card-text">{t('clients_section.types.desktop.description')}</p>
            </div>
          </div>
        </Section>

        <Section
          id="summary"
          title={t('summary.title')}
          icon={<Network className="section-icon" size={24} />}
        >
          <p className="content-text">{t('summary.text')}</p>
        </Section>
      </div>
    </article>
  );
};

export default Home;