# Nostr Schlüsselpaar & Messaging Guide / Nostr Key Pair & Messaging Guide

## 🇩🇪 Deutsch

### Schlüsselpaar erstellen
1. **Online-Tool Methode**
   - Besuche [Nostr.guru](https://nostr.guru/keygen.html)
   - Klicke auf "Generate"
   - Speichere beide Schlüssel sicher ab:
     - Private Key (geheim halten!)
     - Public Key (kann geteilt werden)

2. **Command Line Methode**
```bash
# Installation von nostr-tool
npm install -g nostr-tool

# Generiere ein Schlüsselpaar
nostr-tool keygen
```

### Nachricht senden (Client-unabhängig)
1. **Mit nostr-tool**
```bash
# Nachricht senden
nostr-tool publish -k <DEIN_PRIVATE_KEY> -r wss://relay.nostr.info "Hallo Nostr Welt!"
```

2. **Mit curl**
```bash
# Event erstellen und signieren
EVENT=$(nostr-tool sign -k <DEIN_PRIVATE_KEY> -t "Hallo Nostr Welt!")

# An Relay senden
curl -X POST -H "Content-Type: application/json" -d "$EVENT" https://relay.nostr.info
```

### Wichtige Sicherheitshinweise
- ⚠️ Bewahre deinen Private Key sicher auf
- 🔒 Teile niemals deinen Private Key
- 📝 Erstelle Backups deiner Schlüssel
- ✅ Verifiziere immer die Relay-URLs

---

## 🇬🇧 English

### Create Key Pair
1. **Online Tool Method**
   - Visit [Nostr.guru](https://nostr.guru/keygen.html)
   - Click "Generate"
   - Save both keys securely:
     - Private Key (keep secret!)
     - Public Key (can be shared)

2. **Command Line Method**
```bash
# Install nostr-tool
npm install -g nostr-tool

# Generate a key pair
nostr-tool keygen
```

### Send Message (Client-independent)
1. **Using nostr-tool**
```bash
# Send message
nostr-tool publish -k <YOUR_PRIVATE_KEY> -r wss://relay.nostr.info "Hello Nostr World!"
```

2. **Using curl**
```bash
# Create and sign event
EVENT=$(nostr-tool sign -k <YOUR_PRIVATE_KEY> -t "Hello Nostr World!")

# Send to relay
curl -X POST -H "Content-Type: application/json" -d "$EVENT" https://relay.nostr.info
```

### Important Security Notes
- ⚠️ Keep your Private Key secure
- 🔒 Never share your Private Key
- 📝 Create backups of your keys
- ✅ Always verify relay URLs

## Code Examples

### JavaScript/TypeScript
```typescript
import * as nostr from 'nostr-tools';

// Generate key pair
const privateKey = nostr.generatePrivateKey();
const publicKey = nostr.getPublicKey(privateKey);

// Create and sign event
const event = {
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: "Hello Nostr World!",
  pubkey: publicKey
};

const signedEvent = nostr.signEvent(event, privateKey);

// Connect to relay and publish
const relay = nostr.relayInit('wss://relay.nostr.info');
await relay.connect();
await relay.publish(signedEvent);
```

### Python
```python
from nostr.key import PrivateKey
from nostr.relay_manager import RelayManager
from nostr.message_type import ClientMessageType
import time

# Generate key pair
private_key = PrivateKey()
public_key = private_key.public_key

# Create and sign event
event = {
    "content": "Hello Nostr World!",
    "created_at": int(time.time()),
    "kind": 1,
    "tags": [],
    "pubkey": public_key.hex(),
}

signed_event = private_key.sign_event(event)

# Connect to relay and publish
relay_manager = RelayManager()
relay_manager.add_relay("wss://relay.nostr.info")
relay_manager.open_connections()
time.sleep(1.25) # Wait for connection

relay_manager.publish_event(signed_event)
time.sleep(1) # Wait for message to be sent
relay_manager.close_connections()
```

## Nützliche Tools / Useful Tools
- [Nostr.guru](https://nostr.guru/) - Online Key Generator
- [Nostr-Tool](https://github.com/nostr-protocol/nostr-tool) - Command Line Tool
- [Nostr-Tools](https://github.com/nbd-wtf/nostr-tools) - JavaScript Library
- [Python-Nostr](https://github.com/jeffthibault/python-nostr) - Python Library
