# NetShield X 🛡️
### Decentralized Peer-to-Peer Intrusion Detection System

NetShield X is a lightweight, self-hosted IDS that protects networks 
without routing traffic through any third party. When one node detects 
an attack, every other node on the mesh is armed against it instantly.

---

## The Problem
Traditional firewalls protect machines individually. When attacker 
45.33.32.156 hits Machine A and gets blocked, Machine B, C, and D 
have no idea that attacker exists — until they get hit too.

## The Solution
NetShield X is a P2P mesh where every node shares threat intelligence 
the moment any one of them sees an attack. One node gets hit → 
every node on the network blocks that IP within 10 seconds.

---

## Core Features
- **Brute Force Detection** — rolling window engine blocks attackers in real time
- **Gossip Protocol** — threat intel propagates across all peers automatically
- **UDP Peer Discovery** — zero config, nodes find each other on the LAN
- **Blockchain Ledger** — immutable distributed record of every attack
- **Live Dashboard** — real time radar, particle animations, WebSocket push
- **Honeypot** — /login trap actively lures and fingerprints attackers

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind, Framer Motion |
| Backend | Node.js, Express, TypeScript |
| Realtime | Socket.IO WebSockets |
| Networking | UDP broadcast, HTTP gossip sync |
| Ledger | SHA256 blockchain (Node crypto) |

---

## How to Run

### 1. Install dependencies
npm install

### 2. Start the server
npx ts-node server.ts

### 3. Start the frontend
npm run dev

### 4. Open the dashboard
http://localhost:5173

---

## How the P2P Mesh Works
1. Each node broadcasts NETSHIELD_ANNOUNCE over UDP every 5 seconds
2. Peers hear the broadcast and add the sender to their peer list
3. Every 10 seconds each node syncs its full state with all peers
4. Attack detected on Node A → blocked IPs + blockchain record 
   propagates to Node B, C, D within one sync cycle

---
