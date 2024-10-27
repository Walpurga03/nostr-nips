import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Activity } from "lucide-react";
import NDK from "@nostr-dev-kit/ndk";

interface RelayStatus {
  url: string;
  status: 'connected' | 'disconnected' | 'connecting';
  latency?: number;
}

interface RelayStatusProps {
  ndk: NDK | null;
  className?: string;
}

const RelayStatus: React.FC<RelayStatusProps> = ({ ndk, className }) => {
  const [relayStatuses, setRelayStatuses] = useState<RelayStatus[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!ndk) return;

    const updateRelayStatus = (relay: any, status: RelayStatus['status'], latency?: number) => {
      setRelayStatuses(prev => {
        const existing = prev.find(r => r.url === relay.url);
        if (!existing) {
          return [...prev, { url: relay.url, status, latency }];
        }
        return prev.map(r => 
          r.url === relay.url ? { ...r, status, latency } : r
        );
      });
    };

    const initializeRelays = () => {
      if (ndk.pool) {
        const relays = Array.from(ndk.pool.relays.values());
        setRelayStatuses(relays.map(relay => ({
          url: relay.url,
          status: relay.status === 1 ? 'connected' : 'disconnected'
        })));
      }
      setIsInitializing(false);
    };

    const handleConnect = (relay: any) => {
      const latency = Date.now() - (relay.connectStartedAt || Date.now());
      updateRelayStatus(relay, 'connected', latency);
    };

    const handleDisconnect = (relay: any) => {
      updateRelayStatus(relay, 'disconnected');
    };

    const handleConnecting = (relay: any) => {
      relay.connectStartedAt = Date.now();
      updateRelayStatus(relay, 'connecting');
    };

    // Initialize current status
    initializeRelays();

    // Subscribe to events
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
  }, [ndk]);

  if (isInitializing) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Activity className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2">Initializing relays...</span>
      </div>
    );
  }

  return (
    <div className={`bg-secondary/20 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Activity className="w-5 h-5 mr-2" />
        Relay Status
      </h3>
      <div className="space-y-2">
        {relayStatuses.map((relay) => (
          <div key={relay.url} className="flex items-center justify-between bg-secondary/10 rounded p-2">
            <div className="flex items-center">
              {relay.status === 'connected' ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : relay.status === 'connecting' ? (
                <Activity className="w-4 h-4 text-yellow-500 animate-spin" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="ml-2 text-sm">
                {new URL(relay.url).hostname}
              </span>
            </div>
            {relay.latency && relay.status === 'connected' && (
              <span className="text-xs opacity-75">
                {relay.latency}ms
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelayStatus;