# NetShield X: Decentralized Threat Defense 
**Architecture & Implementation Documentation**

## 1. Executive Summary (What It Does)
NetShield X is a Decentralized Layer-7 Intrusion Detection System (IDS) and Firewall. Unlike traditional centralized firewalls, NetShield X operates as a peer-to-peer (P2P) mesh network. When an attacker targets one node (computer) on the network, that node automatically permanently bans the attacker and broadcasts a cryptographic record of the attack to all other machines in the network. Every other machine immediately updates its own local firewall to block the attacker before they can even attempt a second strike.

### Core Features:
*   **Honeypot & Traffic Analysis:** Provides an exposed target (`/login`) that actively monitors for malicious behavior like Brute Force attacks, DDoS floods, and Port Scans.
*   **Decentralized Threat Ledger (Blockchain):** Stores immutable records of attacks, assigning a cryptographic block hash and gas-fee equivalent to every malicious event.
*   **Autonomous Mesh Networking:** Automatically discovers other NetShield nodes on the local network (LAN) without manual configuration.
*   **Live Radar & Telemetry:** Features a hacker-aesthetic dashboard with real-time 2D radar sweeping, live particle animations showing attack vectors, and organic CPU/hardware load telemetry.

---

## 2. Technical Architecture (How It Does It)

### A. The Layer-7 Firewall (Node.js & Express)
*   **True IP Extraction:** The Express backend intercepts incoming HTTP requests and extracts the true hardware IP address (`req.socket.remoteAddress` or `x-forwarded-for`), bypassing frontend proxies.
*   **Memory-Mapped Rule Engine:** The server stores login attempts in a high-speed `Map<string, number[]>`. If a single IP generates too many requests within a 20-second rolling window, it triggers a system anomaly.
*   **Pre-flight Drops:** Once flagged, the IP is added to a `blockedIps` Set. Any future request from this IP is instantly dropped with a `403 Forbidden` status before it ever reaches the application logic, saving CPU cycles.

### B. The Distributed Ledger (The "Mini-Blockchain")
*   **Event Minting:** When an attack is detected, the server mints a "Transaction". This includes the Attacker's IP, the exact timestamp, the severity of the attack, and a simulated cryptographic hash.
*   **Immutability:** This transaction is appended to an array (the ledger). Because it is distributed to other nodes instantly, the record cannot be quietly erased by a compromised local machine.

### C. The Gossip Protocol & Peer Discovery
*   **UDP LAN Auto-Discovery:** On boot, the server opens a UDP socket (Port 30001) and broadcasts an announcement (`NETSHIELD_ANNOUNCE`). Other nodes on the same WiFi listen for this and silently add the new machine to their peer list.
*   **State Merging (Gossip):** Every few seconds, each node initiates a `Sync` cycle. It sends an HTTP `POST` request to all known peers containing its entire blockchain state. The peers mathematically merge the incoming data, absorbing any new blocked IPs and network node addresses. This allows a block to propagate across the entire globe or local network exponentially fast.

### D. The Immersive Dashboard (React, Vite, Tailwind, Framer Motion)
*   **WebSocket Integration:** `Socket.IO` is used to establish a persistent, bi-directional pipe between the Node server and the React frontend. When an attack hits the backend, the server pushes the alert via WebSockets to the UI instantly.
*   **Animated Radar Canvas:** The UI utilizes `framer-motion` and custom CSS radial sweeps to render a simulated tactical radar. When a WebSocket alert fires, React state dynamically spawns a localized "particle" that animates across the grid, giving visual confirmation of the network strike.
*   **Hardware Telemetry:** To showcase system stress, the Node.js server maintains an organic CPU load simulation that physically spikes when large arrays are parsed or high-severity attacks are blocked, which is then piped to the UI.

---

## 3. Deployment & Security Benefits
Because NetShield X requires no central server (like AWS or Cloudflare), it poses no single point of failure. If an attacker manages to take down the primary node via overwhelming DDoS, the secondary nodes continue to operate independently, already armed with the attacker's fingerprints from the Blockchain ledger.
