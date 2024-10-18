import React, { useState } from 'react';
import NDK from "@nostr-dev-kit/ndk";
import RelayConnector from './RelayConnector';

const Nip2: React.FC = () => {
  const [ndk, setNdk] = useState<NDK | null>(null);
  const [pubkey, setPubkey] = useState<string>('');

  // Funktion zum Abrufen eines Ereignisses basierend auf dem Pubkey
  const fetchEvent = async (pubkey: string) => {
    console.log(`Fetching NIP-01 Profile Event for pubkey: ${pubkey}`);
    if (ndk) {
      try {
        const filter = {
          kinds: [0], // NIP-01 (Profile) Ereignisse
          authors: [pubkey],
          limit: 1 // Begrenzen wir es auf ein Ereignis zur Probe
        };
        console.log('Subscribing with filter:', filter);
        const sub = ndk.subscribe(filter);
        sub.on('event', (event) => {
          console.log('Event received:', event);
          console.log('Full JSON:', JSON.stringify(event, null, 2)); // Logge das vollständige JSON-Objekt
        });
        sub.on('eose', () => {
          console.log('End of subscription events');
        });
        sub.on('close', (error) => {
          console.error('Subscription closed with error:', error);
        });
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    } else {
      console.log('NDK instance is null');
    }
  };

  // Funktion zum Handhaben des Formular-Submits
  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvent(pubkey);
  };

  return (
    <div className="nip1-container">
      <RelayConnector onConnect={setNdk} />
      <h2>NIP-01: Profile Event</h2>
      <div className="input-form-container">
        <form onSubmit={handleFetch}>
          <label>
            Pubkey:
            <input type="text" value={pubkey} onChange={(e) => setPubkey(e.target.value)} />
          </label>
          <button type="submit">Fetch Event</button>
        </form>
      </div>
    </div>
  );
};

export default Nip2;