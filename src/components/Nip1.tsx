import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import NDK from "@nostr-dev-kit/ndk";
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Hash, 
  Key, 
  Clock, 
  Tag, 
  FileText, 
  Shield 
} from "lucide-react";
import RelayConnector from './RelayConnector';
import { getArrayTranslation, getObjectTranslation, TranslatedFields } from '../utils/translationUtils';

interface SectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const Section: React.FC<SectionProps> = ({ id, title, icon, children, isExpanded, onToggle }) => (
  <div className="section">
    <button 
      className="section-header" 
      onClick={onToggle}
      aria-expanded={isExpanded}
    >
      {icon}
      <h2>{title}</h2>
      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    {isExpanded && (
      <div className="section-content">
        {children}
      </div>
    )}
  </div>
);

interface EventData {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

const Nip1: React.FC = () => {
  const { t } = useTranslation('nip1');
  const [event, setEvent] = useState<EventData | null>(null);
  const [ndk, setNdk] = useState<NDK | null>(null);
  const [eventId, setEventId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>('overview');

  const EXAMPLE_EVENT_ID = "86885d03218abe92f1800fb2f0a306535710111d60e8c9aafd0179db11963ed7";

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId);
  };

  const handleExampleClick = () => {
    setEventId(EXAMPLE_EVENT_ID);
  };

  const fetchEvent = async (id: string) => {
    if (!ndk) {
      setError(t('errors.no_relay_connection'));
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const fetchedEvent = await ndk.fetchEvent(id);
      if (fetchedEvent) {
        setEvent(fetchedEvent.rawEvent() as EventData);
      } else {
        setError(t('errors.event_not_found'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.fetch_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchEvent(eventId);
  };

  // Renderfunktion für die Übersichtssektion
  const renderOverview = () => (
    <div className="overview">
      <p className="description">{t('sections.overview.description')}</p>
      <ul className="overview-list">
        {getArrayTranslation(t, 'sections.overview.points').map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );

  // Renderfunktion für die Event-Struktur-Sektion
  const renderEventStructure = () => (
    <div className="event-structure">
      <p className="description">{t('sections.event_structure.description')}</p>
      <div className="fields-grid">
        {Object.entries(getObjectTranslation<TranslatedFields>(t, 'sections.event_structure.fields'))
          .map(([key, field]) => (
            <div key={key} className="field-card">
              <div className="field-header">
                {getFieldIcon(key)}
                <h3>{field.title}</h3>
              </div>
              <p className="field-description">{field.description}</p>
              {field.technical && (
                <div className="technical-note">
                  <code>{field.technical}</code>
                </div>
              )}
              {field.examples && (
                <ul className="examples-list">
                  {field.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </div>
    </div>
  );

  // Renderfunktion für die Relay-Kommunikations-Sektion
  const renderRelayCommunication = () => (
    <div className="relay-communication">
      <p className="description">{t('sections.relay_communication.description')}</p>
      <div className="message-types">
        <h3>{t('sections.relay_communication.messages.types.title')}</h3>
        <div className="types-grid">
          {Object.entries(getObjectTranslation(t, 'sections.relay_communication.messages.types'))
            .filter(([key]) => key !== 'title')
            .map(([key, description]) => (
              <div key={key} className="type-card">
                <h4>{key}</h4>
                <p>{String(description)}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="subscription-system">
        <h3>{t('sections.relay_communication.subscription.title')}</h3>
        <p>{t('sections.relay_communication.subscription.description')}</p>
        <ul className="filter-options">
          {getArrayTranslation(t, 'sections.relay_communication.subscription.filter_options')
            .map((option, index) => (
              <li key={index}>{option}</li>
            ))}
        </ul>
      </div>
    </div>
  );

  // Hilfsfunktion für Field Icons
  const getFieldIcon = (key: string) => {
    const iconSize = 18;
    switch (key) {
      case 'id': return <Hash size={iconSize} />;
      case 'pubkey': return <Key size={iconSize} />;
      case 'created_at': return <Clock size={iconSize} />;
      case 'kind': return <Tag size={iconSize} />;
      case 'tags': return <Tag size={iconSize} />;
      case 'content': return <FileText size={iconSize} />;
      case 'sig': return <Shield size={iconSize} />;
      default: return null;
    }
  };

  return (
    <div className="nip1-container">
      <RelayConnector onConnect={setNdk} />
      
      <header className="nip1-header">
        <h1>{t('nip1_title')}</h1>
        <p className="intro-text">{t('key_protocol_description')}</p>
      </header>

      <main className="nip1-content">
        <Section 
          id="overview"
          title={t('sections.overview.title')}
          icon={<Hash className="section-icon" />}
          isExpanded={expandedSection === 'overview'}
          onToggle={() => toggleSection('overview')}
        >
          {renderOverview()}
        </Section>

        <Section 
          id="event-structure"
          title={t('sections.event_structure.title')}
          icon={<FileText className="section-icon" />}
          isExpanded={expandedSection === 'event-structure'}
          onToggle={() => toggleSection('event-structure')}
        >
          {renderEventStructure()}
        </Section>

        <Section 
          id="relay-communication"
          title={t('sections.relay_communication.title')}
          icon={<Activity className="section-icon" />}
          isExpanded={expandedSection === 'relay-communication'}
          onToggle={() => toggleSection('relay-communication')}
        >
          {renderRelayCommunication()}
        </Section>

        <section className="interactive-section">
          <h2>{t('event_fetcher')}</h2>
          <div className="example-container">
            <p className="example-text">
              {t('example.try_it_out')}
            </p>
            <div className="example-id-container">
              <code className="example-id">{EXAMPLE_EVENT_ID}</code>
              <button 
                type="button" 
                className="example-button"
                onClick={handleExampleClick}
              >
                {t('example.use_this_id')}
              </button>
            </div>
          </div>

          <form onSubmit={handleFetch} className="fetch-form">
            <div className="input-group">
              <label htmlFor="eventId">
                {t('labels.event_id')}
                <span className="input-helper">{t('labels.event_id_helper')}</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="eventId"
                  type="text"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  placeholder={t('placeholder.enter_event_id')}
                  className="event-input"
                />
                {eventId && (
                  <button 
                    type="button" 
                    className="clear-button"
                    onClick={() => setEventId('')}
                    aria-label={t('buttons.clear_input')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading || !ndk || !eventId.trim()} 
              className="fetch-button"
            >
              {loading ? (
                <>
                  <Activity className="animate-spin h-4 w-4" />
                  {t('buttons.fetching')}
                </>
              ) : t('buttons.fetch_event')}
            </button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {event && (
            <div className="result-section">
              <h3>{t('fetched_event')}</h3>
              <div className="json-result">
                <pre>{JSON.stringify(event, null, 2)}</pre>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="nip1-footer">
        <a 
          href="https://github.com/nostr-protocol/nips/blob/master/01.md" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
        >
          {t('detailed_github_page')}
        </a>
      </footer>
    </div>
  );
};

export default Nip1;