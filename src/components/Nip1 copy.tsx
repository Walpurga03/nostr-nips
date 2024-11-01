import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import NDK from "@nostr-dev-kit/ndk";
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../components/ui/alert';
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Hash,
  Key,
  Clock,
  Tag,
  FileText,
  Shield,
  CheckCircle2,
  XCircle
} from "lucide-react";
import RelayConnector from './RelayConnector';
import RelayController from './RelayController';
import { getArrayTranslation, getObjectTranslation, TranslatedFields } from '../utils/translationUtils';

interface EventData {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

interface SectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  icon,
  children,
  isExpanded,
  onToggle
}) => (
  <div className="section" id={id}>
    <button
      className="section-header"
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-controls={`section-content-${id}`}
    >
      {icon}
      <h2>{title}</h2>
      {isExpanded ? <ChevronUp className="transition-transform" /> : <ChevronDown className="transition-transform" />}
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
  </div>
);

const EXAMPLE_EVENT_ID = "86885d03218abe92f1800fb2f0a306535710111d60e8c9aafd0179db11963ed7";

const Nip1: React.FC = () => {
  const { t } = useTranslation('nip1');
  const [event, setEvent] = useState<EventData | null>(null);
  const [ndk, setNdk] = useState<NDK | null>(null);
  const [eventId, setEventId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>('overview');
  const [fetchSuccess, setFetchSuccess] = useState<boolean | null>(null);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId);
  }, [expandedSection]);

  const handleExampleClick = useCallback(() => {
    setEventId(EXAMPLE_EVENT_ID);
    setError(null);
    setFetchSuccess(null);
  }, []);

  const validateEventId = (id: string): boolean => {
    return /^[0-9a-f]{64}$/.test(id);
  };

  const formatEventData = (data: EventData): EventData => {
    return {
      ...data,
      created_at: data.created_at,
      tags: data.tags.map(tag => tag.map(item =>
        typeof item === 'string' ? item : JSON.stringify(item)
      ))
    };
  };

  const fetchEvent = async (id: string) => {
    if (!ndk) {
      setError(t('errors.no_relay_connection'));
      setFetchSuccess(false);
      return;
    }

    if (!validateEventId(id)) {
      setError(t('validation_errors.invalid_id'));
      setFetchSuccess(false);
      return;
    }

    setLoading(true);
    setError(null);
    setFetchSuccess(null);

    try {
      const fetchedEvent = await ndk.fetchEvent(id);
      if (fetchedEvent) {
        const formattedEvent = formatEventData(fetchedEvent.rawEvent() as EventData);
        setEvent(formattedEvent);
        setFetchSuccess(true);
      } else {
        setError(t('errors.event_not_found'));
        setFetchSuccess(false);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : t('errors.fetch_failed'));
      setFetchSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchEvent(eventId);
  };

  const handleClearInput = useCallback(() => {
    setEventId('');
    setError(null);
    setFetchSuccess(null);
    setEvent(null);
  }, []);

  const renderOverview = useCallback(() => (
    <div className="overview">
      <p className="description">{t('sections.overview.description')}</p>
      <ul className="overview-list">
        {getArrayTranslation(t, 'sections.overview.points').map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  ), [t]);

  const renderEventStructure = useCallback(() => (
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
            </div>
          ))}
      </div>
    </div>
  ), [t]);

  const renderRelayCommunication = useCallback(() => (
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
    </div>
  ), [t]);

  return (
    <div className="page-container">
      <RelayConnector onConnect={setNdk} />

      <header className="page-header">
        <h1 className="page-title">{t('nip1_title')}</h1>
        <p className="page-intro">{t('key_protocol_description')}</p>
      </header>

      <main className="sections-container">
        {/* Left Column: Content Sections */}
        <div className="content-sections">
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
        </div>

        {/* Right Column: Interactive Section */}
        <div className="interactive-content">
          <div className="relay-control-section card">
            <RelayController ndk={ndk} />
          </div>

          <section className="interactive-section card">
            <h2 className="section-title">
              {t('event_fetcher')}
            </h2>

            <div className="example-box">
              <p className="content-text">{t('example.try_it_out')}</p>
              <div className="example-container">
                <code className="code-example">{EXAMPLE_EVENT_ID}</code>
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleExampleClick}
                >
                  {t('example.use_this_id')}
                </button>
              </div>
            </div>

            <form onSubmit={handleFetch} className="form-container">
              <div className="form-group">
                <label htmlFor="eventId" className="form-label">
                  {t('labels.event_id')}
                </label>
                <div className="input-container">
                  <input
                    id="eventId"
                    type="text"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    placeholder={t('placeholder.enter_event_id')}
                    className={`form-input ${fetchSuccess === true ? 'success' : ''} ${fetchSuccess === false ? 'error' : ''}`}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'input-error' : undefined}
                  />
                  {eventId && (
                    <button
                      type="button"
                      className="clear-button"
                      onClick={handleClearInput}
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
                className="primary-button"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Activity className="animate-spin" />
                    {t('buttons.fetching')}
                  </>
                ) : (
                  <>
                    {fetchSuccess === true && <CheckCircle2 className="success-icon" />}
                    {fetchSuccess === false && <XCircle className="error-icon" />}
                    {t('buttons.fetch_event')}
                  </>
                )}
              </button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>{t('error')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {event && (
              <div className="result-section" role="region" aria-live="polite">
                <h3>{t('fetched_event')}</h3>
                <div className="code-example">
                  <pre>{JSON.stringify(event, null, 2)}</pre>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="page-footer">
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

// Hilfsfunktion für Field Icons
const getFieldIcon = (key: string) => {
  const iconProps = { size: 18, className: 'field-icon' };
  switch (key) {
    case 'id': return <Hash {...iconProps} />;
    case 'pubkey': return <Key {...iconProps} />;
    case 'created_at': return <Clock {...iconProps} />;
    case 'kind': return <Tag {...iconProps} />;
    case 'tags': return <Tag {...iconProps} />;
    case 'content': return <FileText {...iconProps} />;
    case 'sig': return <Shield {...iconProps} />;
    default: return null;
  }
};

export default Nip1;