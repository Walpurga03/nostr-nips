import React, { useEffect } from 'react';
import "websocket-polyfill";
import NDK from "@nostr-dev-kit/ndk";
import { RELAY_URLS } from '../constants'; // Importiere die Relay-URLs

// Definiere die Props für die RelayConnector-Komponente
interface RelayConnectorProps {
    onConnect: (ndk: NDK) => void;
}

const RelayConnector: React.FC<RelayConnectorProps> = ({ onConnect }) => {
    useEffect(() => {
        // Funktion zum Verbinden mit den Relays
        const connectToRelays = async () => {
            const newNdk = new NDK({
                explicitRelayUrls: [...RELAY_URLS], // Konvertiere in ein veränderbares Array
                enableOutboxModel: false,
            });
            await newNdk.connect(6000);
            onConnect(newNdk);
            console.log("Connected to relays");
        };

        connectToRelays();
    }, [onConnect]);

    return null;
};

export default RelayConnector;