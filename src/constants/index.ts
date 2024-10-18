// Definiere die verfügbaren NIPs (Nostr Implementation Possibilities)
export const AVAILABLE_NIPS = [
  'home',  // Startseite
  'nip1',  // NIP-01 Seite
  'nip2'   // NIP-02 Seite
] as const; // Verwende 'as const', um das Array als Tupel von konstanten Zeichenfolgen zu behandeln

// Definiere die Standard-URL für den Relay-Server
export const DEFAULT_RELAY_URL = 'wss://relay.damus.io';

// Definiere die unterstützten Sprachen für die Anwendung
export const SUPPORTED_LANGUAGES = ['en', 'de'] as const; // Verwende 'as const', um das Array als Tupel von konstanten Zeichenfolgen zu behandeln

// Definiere die URLs der Relay-Server
export const RELAY_URLS = [
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
] as const; // Verwende 'as const', um das Array als Tupel von konstanten Zeichenfolgen zu behandeln