import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import NDK from "@nostr-dev-kit/ndk";
import RelayConnector from './RelayConnector';

const Nip1: React.FC = () => {
  const { t } = useTranslation('nip1');
  const [event, setEvent] = useState<any>(null);
  const [ndk, setNdk] = useState<NDK | null>(null);
  const [eventId, setEventId] = useState<string>('');

  // Funktion zum Abrufen eines Ereignisses basierend auf der ID
  const fetchEvent = async (id: string) => {
    if (ndk) {
      const sub = await ndk.fetchEvent(id);
      console.log(sub?.rawEvent());
      setEvent(sub?.rawEvent());
    }
  };

  // Funktion zum Handhaben des Formular-Submits
  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvent(eventId);
  };

  // Funktion zum Formatieren eines Ereignisses
  const formatEvent = (event: any) => {
    return {
      id: event.id,
      pubkey: event.pubkey,
      created_at: event.created_at,
      kind: event.kind,
      tags: event.tags,
      content: event.content,
      sig: event.sig
    };
  };

  // Funktion zum Escapen von HTML-Zeichen
  const escapeHtml = (json: string) => {
    return json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  // Funktion zum Bestimmen der CSS-Klasse basierend auf dem JSON-Teil
  const getClassForJsonPart = (match: string) => {
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        return 'json-key';
      } else {
        return 'json-string';
      }
    } else if (/true|false/.test(match)) {
      return 'json-boolean';
    } else if (/null/.test(match)) {
      return 'json-null';
    } else {
      return 'json-number';
    }
  };

  // Funktion zum Syntax-Highlighting von JSON
  const syntaxHighlight = (json: string) => {
    json = escapeHtml(json);
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:\s*)?|true|false|null|[0-9]+)/g, (match) => {
      const cls = getClassForJsonPart(match);
      return `<span class="${cls}">${match}</span>`;
    });
  };

  return (
    <div className="nip1-container">
      <RelayConnector onConnect={setNdk} />
      <h2>{t('nip1_title')}</h2>
      <ul>
        <li><strong>{t('key_protocol')}</strong>: {t('key_protocol_description')}</li>
        <li><strong>{t('event_format')}</strong>: {t('event_format_description')}</li>
        <li><strong>{t('filters_and_subscriptions')}</strong>: {t('filters_and_subscriptions_description')}</li>
        <li><strong>{t('websocket_connections')}</strong>: {t('websocket_connections_description')}</li>
      </ul>

      <h3>{t('example_usage')}</h3>
      <p>{t('example_usage_intro')}</p>
      <p>{t('example_usage_scenario')}</p>
      <pre className="formatted-text" dangerouslySetInnerHTML={{
        __html: syntaxHighlight(JSON.stringify({
          id: "86885d03218abe92f1800fb2f0a306535710111d60e8c9aafd0179db11963ed7",
          pubkey: "user123",
          created_at: "1728888328",
          kind: "message",
          tags: ["chat", "example"],
          content: t('example_message_content'),
          signature: "abcdef1234567890"
        }, null, 2))
      }}></pre>
      <p>{t('example_explanation')}</p>
      <ul>
        <li><strong>id</strong>: {t('example_id')}</li>
        <li><strong>pubkey</strong>: {t('example_pubkey')}</li>
        <li><strong>created_at</strong>: {t('example_created_at')}</li>
        <li><strong>kind</strong>: {t('example_kind')}</li>
        <li><strong>tags</strong>: {t('example_tags')}</li>
        <li><strong>content</strong>: {t('example_content')}</li>
        <li><strong>sig</strong>: {t('example_sig')}</li>
      </ul>
      <p>{t('example_filters')}</p>

      <h3>{t('event_fetcher')}</h3>
      <div className="input-form-container">
        <form onSubmit={handleFetch}>
          <label>
            Event ID:
            <input type="text" value={eventId} onChange={(e) => setEventId(e.target.value)} />
          </label>
          <button type="submit">Fetch Event</button>
        </form>
      </div>
      {event && (
        <div className="fetched-event json-container">
          <h3>{t('fetched_event')}</h3>
          <pre className="formatted-text" dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(formatEvent(event), null, 2)) }}></pre>
        </div>
      )}
      <p>
        <a className="link" href="https://github.com/nostr-protocol/nips/blob/master/01.md" target="_blank" rel="noopener noreferrer">
          {t('detailed_github_page')}
        </a>
      </p>
    </div>
  );
}

export default Nip1;