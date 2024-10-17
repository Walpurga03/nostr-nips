import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputForm from './InputForm';
import '../styles/Nip1.css'; // Import the CSS file

const Nip1: React.FC = () => {
  const { t } = useTranslation('nip1');
  const [event, setEvent] = useState<any>(null);

  const handleFetchEvent = (fetchedEvent: any) => {
    setEvent(fetchedEvent);
  };

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

  const syntaxHighlight = (json: string) => {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:\s*)?|true|false|null|[0-9]+)/g, (match) => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return `<span class="${cls}">${match}</span>`;
    });
  };

  return (
    <div className="nip1-container">
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
          id: "1234567890abcdef",
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
      <InputForm onFetchEvent={handleFetchEvent} />
      {event && (
        <div className="fetched-event json-container">
          <h3>{t('fetched_event')}</h3>
          <pre className="formatted-text" dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(formatEvent(event), null, 2)) }}></pre>
        </div>
      )}
      <p>
        <a href="https://github.com/nostr-protocol/nips/blob/master/01.md" target="_blank" rel="noopener noreferrer">
          {t('detailed_github_page')}
        </a>
      </p>
    </div>
  );
}

export default Nip1;