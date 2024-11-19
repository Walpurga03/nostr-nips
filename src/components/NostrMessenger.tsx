import React, { useState } from 'react';
import NDK, { NDKPrivateKeySigner, NDKEvent } from '@nostr-dev-kit/ndk';
import { useTranslation } from 'react-i18next';
import { Send, Plus, X, RefreshCw } from 'lucide-react';
import { nip19 } from 'nostr-tools';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from './ui/alert';
import KeyGenerator from './KeyGenerator';
import '../styles/nostrMessenger.css';

const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.nostr.band',
  'wss://nos.lol',
];

interface ConnectionState {
  isConnecting: boolean;
  isConnected: boolean;
  isSending: boolean;
}

const NostrMessenger: React.FC = () => {
  const [privateKey, setPrivateKey] = useState<string>('');
  const [relays, setRelays] = useState<string[]>(DEFAULT_RELAYS);
  const [newRelay, setNewRelay] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<NDKEvent[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnecting: false,
    isConnected: false,
    isSending: false,
  });
  const [error, setError] = useState<string>('');
  const [ndk, setNdk] = useState<NDK | null>(null);
  const [showKeyGenerator, setShowKeyGenerator] = useState<boolean>(false);
  const { t } = useTranslation();

  const connectToRelays = async () => {
    if (!privateKey) {
      setError(t('nostrMessenger.noPrivateKey', 'Please enter your private key'));
      return;
    }

    try {
      setConnectionState(prev => ({ ...prev, isConnecting: true }));
      setError('');

      let key = privateKey;
      if (privateKey.startsWith('nsec')) {
        const decoded = nip19.decode(privateKey);
        key = decoded.data as string;
      }

      const signer = new NDKPrivateKeySigner(key);
      const newNdk = new NDK({
        explicitRelayUrls: relays,
        signer,
      });

      await newNdk.connect();
      setNdk(newNdk);
      setConnectionState(prev => ({
        ...prev,
        isConnecting: false,
        isConnected: true,
      }));

      // Subscribe to messages
      const user = await signer.user();
      const filter = { kinds: [1], authors: [user.pubkey] };
      const sub = newNdk.subscribe(filter);
      
      sub.on('event', (event: NDKEvent) => {
        setMessages(prev => [event, ...prev]);
      });

    } catch (err) {
      console.error('Failed to connect:', err);
      setError(t('nostrMessenger.connectionError', 'Failed to connect to relays'));
      setConnectionState(prev => ({
        ...prev,
        isConnecting: false,
        isConnected: false,
      }));
    }
  };

  const addRelay = () => {
    if (!newRelay) return;
    if (!newRelay.startsWith('wss://')) {
      setError(t('nostrMessenger.invalidRelay', 'Relay URL must start with wss://'));
      return;
    }
    if (!relays.includes(newRelay)) {
      setRelays(prev => [...prev, newRelay]);
    }
    setNewRelay('');
  };

  const removeRelay = (relay: string) => {
    setRelays(prev => prev.filter(r => r !== relay));
  };

  const sendMessage = async () => {
    if (!ndk || !message.trim()) return;

    try {
      setConnectionState(prev => ({ ...prev, isSending: true }));
      const event = new NDKEvent(ndk);
      event.kind = 1;
      event.content = message;
      await event.publish();
      
      setMessages((prevMessages) => [event, ...prevMessages]);
      setMessage('');
      setConnectionState(prev => ({ ...prev, isSending: false }));
      setError('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(t('nostrMessenger.sendError', 'Failed to send message'));
      setConnectionState(prev => ({ ...prev, isSending: false }));
    }
  };

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp * 1000);
      return new Intl.DateTimeFormat('default', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleKeyGenerated = (privKey: string, pubKey: string) => {
    setPrivateKey(privKey);
    setShowKeyGenerator(false);
  };

  return (
    <div className="nostr-messenger">
      <div className="messenger-container">
        {!connectionState.isConnected && !showKeyGenerator && (
          <div className="key-options">
            <button
              onClick={() => setShowKeyGenerator(true)}
              className="generate-key-button"
            >
              {t('nostrMessenger.generateKey', 'Generate New Key')}
            </button>
            <div className="or-divider">
              {t('nostrMessenger.or', 'or')}
            </div>
          </div>
        )}

        {showKeyGenerator ? (
          <KeyGenerator onKeyGenerated={handleKeyGenerated} />
        ) : (
          <>
            <div className="connection-section">
              <div className="private-key-input">
                <input
                  type="password"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder={t('nostrMessenger.enterPrivateKey', 'Enter your private key (hex or nsec)')}
                />
              </div>

              <div className="relay-management">
                <div className="relay-input">
                  <input
                    type="text"
                    value={newRelay}
                    onChange={(e) => setNewRelay(e.target.value)}
                    placeholder={t('nostrMessenger.enterRelay', 'Enter relay websocket URL')}
                  />
                  <button onClick={addRelay} className="add-relay-button">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <div className="relay-list">
                  {relays.map((relay) => (
                    <div key={relay} className="relay-item">
                      <span>{relay}</span>
                      <button onClick={() => removeRelay(relay)} className="remove-relay-button">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={connectToRelays}
                className="connect-button"
                disabled={connectionState.isConnecting}
              >
                <RefreshCw className={`h-5 w-5 ${connectionState.isConnecting ? 'animate-spin' : ''}`} />
                {connectionState.isConnecting
                  ? t('nostrMessenger.connecting', 'Connecting...')
                  : t('nostrMessenger.connect', 'Connect to Relays')}
              </button>
            </div>

            {connectionState.isConnected && (
              <div className="messaging-section">
                <div className="message-input-container">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('nostrMessenger.messagePlaceholder', 'Type your message here...')}
                    className="message-input"
                    rows={4}
                  />
                  <button
                    onClick={sendMessage}
                    className="send-button"
                    disabled={!message.trim() || connectionState.isSending}
                  >
                    <Send className="h-5 w-5" />
                    {connectionState.isSending
                      ? t('nostrMessenger.sending', 'Sending...')
                      : t('nostrMessenger.send', 'Send Message')}
                  </button>
                </div>

                <div className="messages-list">
                  <h3 className="text-xl font-semibold mb-4">
                    {t('nostrMessenger.yourMessages', 'Your Messages')}
                  </h3>
                  {messages.length === 0 ? (
                    <div className="no-messages">
                      {t('nostrMessenger.noMessages', 'No messages yet. Start the conversation!')}
                    </div>
                  ) : (
                    messages.map((event) => (
                      <div key={event.id} className="message-item">
                        <div className="message-content">{event.content}</div>
                        <div className="message-timestamp">
                          {event.created_at ? formatDate(event.created_at) : t('nostrMessenger.justNow', 'Just now')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>{t('nostrMessenger.error', 'Error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default NostrMessenger;
