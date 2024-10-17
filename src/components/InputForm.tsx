import React, { useState } from 'react';
import "websocket-polyfill";
import NDK from "@nostr-dev-kit/ndk";
import '../styles/InputForm.css'; // Importiere die CSS-Datei

interface InputFormProps {
    onFetchEvent: (event: any) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onFetchEvent }) => {
    const [eventId, setEventId] = useState<string>('');
    const [ndk, setNdk] = useState<NDK | null>(null);

    const connectToRelays = async () => {
        if (!ndk) {
            const newNdk = new NDK({
                explicitRelayUrls: [
                    "wss://pablof7z.nostr1.com",
                    "wss://offchain.pub",
                    "wss://relay.f7z.io",
                    "wss://relay.damus.io",
                    "wss://relay.snort.social",
                    "wss://offchain.pub/",
                    "wss://nostr.mom",
                    "wss://nostr-pub.wellorder.net",
                    "wss://purplepag.es",
                    "wss://brb.io/",
                ],
                enableOutboxModel: false,
            });
            await newNdk.connect(6000);
            setNdk(newNdk);
            console.log("Connected to relays");
            return newNdk;
        }
        return ndk;
    };

    const fetchEvent = async (id: string) => {
        const activeNdk = await connectToRelays();
        if (activeNdk) {
            const sub = await activeNdk.fetchEvent(id);
            console.log(sub?.rawEvent());
            onFetchEvent(sub?.rawEvent());
        }
    };

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchEvent(eventId);
    };

    return (
        <div className="input-form-container">
            <form onSubmit={handleFetch}>
                <label>
                    Event ID:
                    <input type="text" value={eventId} onChange={(e) => setEventId(e.target.value)} />
                </label>
                <button type="submit">Fetch Event</button>
            </form>
        </div>
    );
};

export default InputForm;