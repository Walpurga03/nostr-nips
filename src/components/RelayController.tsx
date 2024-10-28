import React, { useState, useEffect } from 'react';
import NDK from "@nostr-dev-kit/ndk";
import { 
  Activity, 
  CheckCircle2, 
  XCircle,
  Power,
  PowerOff
} from "lucide-react";

interface RelayControllerProps {
  ndk: NDK | null;
}

const RelayController: React.FC<RelayControllerProps> = ({ ndk }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funktion zum Verbinden mit den Relays
  const connect = async () => {
    if (!ndk) return;
    
    try {
      setIsConnecting(true);
      setError(null);
      
      // Verbindung mit allen konfigurierten Relays aufbauen
      await ndk.connect();
      
      setIsConnected(true);
    } catch (err) {
      setError('Verbindung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  // Funktion zum Trennen der Verbindung
  const disconnect = async () => {
    if (!ndk || !ndk.pool) return;
    
    try {
      // Alle Relay-Verbindungen einzeln trennen
      const relays = Array.from(ndk.pool.relays.values());
      await Promise.all(relays.map(async (relay) => {
        try {
          // @ts-ignore - Die disconnect-Methode existiert, auch wenn TypeScript sie nicht erkennt
          await relay.disconnect();
        } catch (err) {
          console.error(`Failed to disconnect from ${relay.url}:`, err);
        }
      }));
      
      setIsConnected(false);
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  useEffect(() => {
    if (!ndk?.pool) return;

    const handleConnect = () => {
      // Prüfen ob mindestens ein Relay verbunden ist
      const hasConnectedRelay = Array.from(ndk.pool.relays.values())
        .some(relay => relay.status === 1);
      setIsConnected(hasConnectedRelay);
    };

    const handleDisconnect = () => {
      // Prüfen ob noch andere Relays verbunden sind
      const hasConnectedRelay = Array.from(ndk.pool.relays.values())
        .some(relay => relay.status === 1);
      setIsConnected(hasConnectedRelay);
    };

    // Event Listener registrieren
    ndk.pool.on('relay:connect', handleConnect);
    ndk.pool.on('relay:disconnect', handleDisconnect);

    // Initialen Status setzen
    handleConnect();

    // Cleanup
    return () => {
      ndk.pool.removeListener('relay:connect', handleConnect);
      ndk.pool.removeListener('relay:disconnect', handleDisconnect);
    };
  }, [ndk]);

  const getConnectedRelays = () => {
    if (!ndk?.pool) return [];
    return Array.from(ndk.pool.relays.values())
      .filter(relay => relay.status === 1);
  };

  return (
    <div className="relay-controller">
      <div className="status-display">
        <div className="status-indicator">
          {isConnecting ? (
            <Activity className="animate-spin text-yellow-500" />
          ) : isConnected ? (
            <CheckCircle2 className="text-green-500" />
          ) : (
            <XCircle className="text-red-500" />
          )}
          <span>
            {isConnecting ? 'Verbindung wird hergestellt...' :
             isConnected ? 'Verbunden' : 'Nicht verbunden'}
          </span>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      <div className="control-buttons">
        <button
          onClick={connect}
          disabled={isConnected || isConnecting}
          className="connect-button"
        >
          <Power className={isConnected ? 'text-green-500' : 'text-gray-500'} />
          Verbinden
        </button>

        <button
          onClick={disconnect}
          disabled={!isConnected || isConnecting}
          className="disconnect-button"
        >
          <PowerOff className={!isConnected ? 'text-red-500' : 'text-gray-500'} />
          Trennen
        </button>
      </div>

      {isConnected && (
        <div className="relay-list">
          <h4>Verbundene Relays ({getConnectedRelays().length}):</h4>
          <ul>
            {getConnectedRelays().map(relay => (
              <li key={relay.url}>
                <CheckCircle2 className="text-green-500" />
                {new URL(relay.url).hostname}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RelayController;