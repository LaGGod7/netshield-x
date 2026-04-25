# NetShield X 🛡️

### Decentralized Peer-to-Peer Intrusion Detection System

NetShield X is a lightweight, self-hosted IDS that protects networks without routing traffic through any third party. When one node detects an attack, every other node on the mesh is armed against it instantly.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)](https://www.typescriptlang.org/)

---

## 🚨 The Problem

Traditional firewalls protect machines individually. When attacker 45.33.32.156 hits Machine A and gets blocked, Machine B, C, and D have no idea that attacker exists — until they get hit too.

## 🛡️ The Solution

NetShield X is a P2P mesh where every node shares threat intelligence the moment any one of them sees an attack. One node gets hit → every node on the network blocks that IP within 10 seconds.

---

## ✨ Core Features

- **🔍 Brute Force Detection** — Rolling window engine blocks attackers in real time
- **📡 Gossip Protocol** — Threat intel propagates across all peers automatically
- **🌐 UDP Peer Discovery** — Zero config, nodes find each other on the LAN
- **⛓️ Blockchain Ledger** — Immutable distributed record of every attack
- **📊 Live Dashboard** — Real time radar, particle animations, WebSocket push
- **🎯 Honeypot** — `/login` trap actively lures and fingerprints attackers
- **🤖 AI Threat Classification** — TensorFlow.js powered behavioral analysis
- **🌍 Global Threat Intelligence** — IP geolocation and reputation scoring

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 19, Vite, Tailwind CSS, Framer Motion |
| Backend     | Node.js, Express, TypeScript        |
| Realtime    | Socket.IO WebSockets                |
| Networking  | UDP broadcast, HTTP gossip sync     |
| AI/ML       | TensorFlow.js                       |
| Ledger      | SHA256 blockchain (Node crypto)     |
| 3D Graphics | Three.js, React Globe.GL            |

---

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **Git** (for cloning the repository)

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/netshield-x.git
   cd netshield-x
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   APP_URL=http://localhost:3000
   ```

---

## 🎯 Usage

### Development Mode

1. **Start the server**
   ```bash
   npm run dev
   ```

2. **Open the dashboard**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start in production mode**
   ```bash
   npm run preview
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run clean` - Clean build artifacts
- `npm run lint` - Run TypeScript type checking

---

## 🏗️ Architecture

### P2P Mesh Networking

1. **Peer Discovery**: UDP broadcasts on port 30001
2. **State Synchronization**: HTTP gossip every 10 seconds
3. **Threat Propagation**: Instant blocking across all nodes

### Threat Detection Pipeline

1. **Traffic Analysis**: Rolling window brute force detection
2. **AI Classification**: TensorFlow.js behavioral scoring
3. **Geolocation**: IP reputation and location data
4. **Blockchain Recording**: Immutable attack ledger

### Real-time Dashboard

- **WebSocket Updates**: Live threat visualization
- **3D Globe**: Global attack mapping
- **Particle System**: Animated threat trajectories
- **Hardware Telemetry**: System load monitoring

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini AI API key for enhanced threat analysis | Yes |
| `APP_URL` | Application URL for self-referential links | No |
| `PORT` | Server port (default: 3000) | No |
| `PEER_NODES` | Comma-separated list of initial peer IPs | No |

### Customization

- **Brute Force Threshold**: Modify `BRUTE_THRESHOLD` in `server.ts`
- **Detection Window**: Adjust `BRUTE_WINDOW` for sensitivity
- **AI Model**: Customize TensorFlow.js architecture for advanced use cases

---

## 🌐 API Endpoints

### Core Endpoints

- `GET /` - Serve frontend application
- `POST /login` - Honeypot endpoint (monitors attacks)
- `GET /api/status` - System status and metrics
- `GET /api/blocked` - List of blocked IPs
- `GET /api/ledger` - Blockchain transaction history

### WebSocket Events

- `new_alert` - Real-time attack notifications
- `new_dossier` - Threat intelligence updates
- `peer_sync` - Mesh network synchronization
- `system_metrics` - Hardware telemetry

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use ESLint configuration
- Write tests for new features
- Update documentation for API changes

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by decentralized security concepts
- Built with modern web technologies
- AI-powered threat detection using TensorFlow.js
- Real-time visualization with Three.js and Framer Motion

---

## 📞 Support

For questions, issues, or contributions:

- Open an issue on GitHub
- Check the [documentation](DOCUMENTATION.md) for detailed technical specs
- Join our community discussions

---

**Stay secure, stay decentralized.** 🛡️

---
