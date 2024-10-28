import React, { useEffect, useState } from 'react';
import NDK from "@nostr-dev-kit/ndk";
import { 
  Activity, 
  Wifi, 
  WifiOff,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from '../components/ui/alert';

interface RelayStatus {
  url: string;
  status: 'connected' | 'disconnected' | 'connecting';
  latency?: number;
  lastUpdate: Date;
  error?: string;
}

interface RelayStatusProps {
  ndk: NDK | null;
  className?: string;
}

const RelayStatus: React.FC<RelayStatusProps> = ({ ndk, className }) => {
  const [relayStatuses, setRelayStatuses] = useState<RelayStatus[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Max Retries für Verbindungsversuche
  const MAX_RETRIES = 3;

  useEffect(() => {
    if (!ndk) return;

    const connectToRelay = async (relay: any) => {
      try {
        await relay.connect();
        return true;
      } catch (error) {
        console.error(`Failed to connect to ${relay.url}:`, error);
        return false;
      }
    };

    const updateRelayStatus = (relay: any, status: RelayStatus['status'], error?: string) => {
      setRelayStatuses(prev => {
        const existing = prev.find(r => r.url === relay.url);
        if (!existing) {
          return [...prev, {
            url: relay.url,
            status,
            lastUpdate: new Date(),
            error
          }];
        }
        return prev.map(r =>
          r.url === relay.url ? {
            ...r,
            status,
            lastUpdate: new Date(),
            error
          } : r
        );
      });
    };

    const initializeRelays = async () => {
      if (ndk.pool) {
        const relays = Array.from(ndk.pool.relays.values());
        
        // Initial status setzen
        relays.forEach(relay => {
          updateRelayStatus(relay, 'connecting');
        });

        // Verbindungsversuche mit allen Relays
        for (const relay of relays) {
          let connected = false;
          let attempts = 0;

          while (!connected && attempts < MAX_RETRIES) {
            connected = await connectToRelay(relay);
            if (!connected) {
              attempts++;
              await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
            }
          }

          updateRelayStatus(
            relay,
            connected ? 'connected' : 'disconnected',
            connected ? undefined : `Failed to connect after ${attempts} attempts`
          );
        }

        // Überprüfen ob mindestens ein Relay verbunden ist
        const connectedRelays = relays.filter(relay => relay.status === 1);
        if (connectedRelays.length === 0) {
          setConnectionError('Unable to connect to any relays. Please check your internet connection or try again later.');
        }
      }
      setIsInitializing(false);
    };

    const handleConnect = (relay: any) => {
      updateRelayStatus(relay, 'connected');
      setConnectionError(null);
    };

    const handleDisconnect = (relay: any) => {
      updateRelayStatus(relay, 'disconnected');
      
      // Überprüfen ob noch andere Relays verbunden sind
      const remainingConnected = Array.from(ndk.pool?.relays.values() || [])
        .filter(r => r.status === 1).length;
      
      if (remainingConnected === 0) {
        setConnectionError('Lost connection to all relays. Attempting to reconnect...');
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => connectToRelay(relay), 1000 * (retryCount + 1));
        }
      }
    };

    const handleConnecting = (relay: any) => {
      updateRelayStatus(relay, 'connecting');
    };

    initializeRelays();

    if (ndk.pool) {
      ndk.pool.on('relay:connect', handleConnect);
      ndk.pool.on('relay:disconnect', handleDisconnect);
      ndk.pool.on('relay:connecting', handleConnecting);
    }

    return () => {
      if (ndk.pool) {
        ndk.pool.removeListener('relay:connect', handleConnect);
        ndk.pool.removeListener('relay:disconnect', handleDisconnect);
        ndk.pool.removeListener('relay:connecting', handleConnecting);
      }
    };
  }, [ndk, retryCount]);

  const getStatusDetails = (status: RelayStatus['status']) => {
    switch (status) {
      case 'connected':
        return {
          icon: <Wifi className="w-4 h-4 text-green-500" />,
          text: 'Connected',
          className: 'text-green-500'
        };
      case 'connecting':
        return {
          icon: <Activity className="w-4 h-4 text-yellow-500 animate-spin" />,
          text: 'Connecting...',
          className: 'text-yellow-500'
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="w-4 h-4 text-red-500" />,
          text: 'Disconnected',
          className: 'text-red-500'
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4 text-gray-500" />,
          text: 'Unknown',
          className: 'text-gray-500'
        };
    }
  };

  if (isInitializing) {
    return (
      <div className="relay-status-loading">
        <Activity className="animate-spin" />
        <span>Initializing relay connections...</span>
      </div>
    );
  }

  const connectedCount = relayStatuses.filter(r => r.status === 'connected').length;

  return (
    <div className={`relay-status-container ${className}`}>
      <div className="relay-status-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="relay-status-summary">
          <span className="relay-count">
            {connectedCount} / {relayStatuses.length} Relays Connected
          </span>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      {connectionError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{connectionError}</AlertDescription>
        </Alert>
      )}

      {isExpanded && (
        <div className="relay-status-list">
          {relayStatuses.map((relay) => {
            const status = getStatusDetails(relay.status);
            return (
              <div key={relay.url} className={`relay-status-item ${status.className}`}>
                <div className="relay-info">
                  <div className="relay-status-indicator">
                    {status.icon}
                    <span className="relay-hostname">
                      {new URL(relay.url).hostname}
                    </span>
                  </div>
                  <div className="relay-details">
                    <span className="relay-status">{status.text}</span>
                    <span className="relay-updated">
                      Last updated: {relay.lastUpdate.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                {relay.error && (
                  <div className="relay-error">
                    {relay.error}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RelayStatus;