<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>NetShield X — Decentralized IDS</title>
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet"/>
<style>
:root {
  --green: #00ff88;
  --green-dim: #00cc6a;
  --green-dark: #003320;
  --cyan: #00e5ff;
  --red: #ff3366;
  --bg: #020c06;
  --bg2: #040f08;
  --panel: rgba(0,255,136,0.04);
  --border: rgba(0,255,136,0.15);
  --border-bright: rgba(0,255,136,0.4);
  --text: #c8ffd8;
  --text-dim: #4a7a5a;
  --font-mono: 'Share Tech Mono', monospace;
  --font-display: 'Orbitron', monospace;
  --font-body: 'Rajdhani', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  overflow-x: hidden;
}

/* GRID BACKGROUND */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

/* SCAN LINE */
body::after {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--green), transparent);
  animation: scanline 6s linear infinite;
  z-index: 999;
  opacity: 0.4;
}
@keyframes scanline {
  0% { top: 0; }
  100% { top: 100vh; }
}

/* NAV */
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 48px;
  background: rgba(2,12,6,0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--green);
  letter-spacing: 0.1em;
  text-shadow: 0 0 20px var(--green);
}

.nav-logo span { color: var(--text-dim); }

.nav-links {
  display: flex;
  gap: 32px;
  list-style: none;
}

.nav-links a {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-dim);
  text-decoration: none;
  letter-spacing: 0.1em;
  transition: color 0.2s;
}
.nav-links a:hover { color: var(--green); }

.nav-badge {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--green);
  border: 1px solid var(--border-bright);
  padding: 6px 14px;
  letter-spacing: 0.1em;
}

/* HERO */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 48px 80px;
  overflow: hidden;
  z-index: 1;
}

/* RADAR */
.radar-wrap {
  position: absolute;
  right: -80px;
  top: 50%;
  transform: translateY(-50%);
  width: 600px;
  height: 600px;
  opacity: 0.15;
  pointer-events: none;
}

.radar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid var(--green);
  position: relative;
}

.radar::before, .radar::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  border: 1px solid var(--green);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
.radar::before { width: 66%; height: 66%; }
.radar::after { width: 33%; height: 33%; }

.radar-line {
  position: absolute;
  top: 50%; left: 50%;
  width: 50%;
  height: 1px;
  background: linear-gradient(90deg, var(--green), transparent);
  transform-origin: left center;
  animation: radarSpin 4s linear infinite;
}
@keyframes radarSpin { to { transform: rotate(360deg); } }

.radar-cross {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 100%; height: 1px;
  background: rgba(0,255,136,0.2);
}
.radar-cross::after {
  content: '';
  position: absolute;
  top: -200px; left: 50%;
  width: 1px; height: 400px;
  background: rgba(0,255,136,0.2);
}

.blip {
  position: absolute;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--red);
  box-shadow: 0 0 12px var(--red);
  animation: blip 3s ease-in-out infinite;
}
.blip:nth-child(1) { top: 25%; left: 60%; animation-delay: 0s; }
.blip:nth-child(2) { top: 70%; left: 35%; animation-delay: 1s; }
.blip:nth-child(3) { top: 45%; left: 75%; animation-delay: 2s; }
@keyframes blip {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

/* HERO CONTENT */
.hero-content {
  max-width: 720px;
  position: relative;
  z-index: 2;
}

.hero-tag {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--green);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.hero-tag::before {
  content: '';
  width: 32px; height: 1px;
  background: var(--green);
}

h1 {
  font-family: var(--font-display);
  font-size: clamp(42px, 6vw, 80px);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
  color: #fff;
  text-shadow: 0 0 60px rgba(0,255,136,0.2);
}

h1 .accent {
  color: var(--green);
  text-shadow: 0 0 40px var(--green);
}

.hero-sub {
  font-family: var(--font-display);
  font-size: clamp(14px, 2vw, 20px);
  color: var(--text-dim);
  letter-spacing: 0.15em;
  margin-bottom: 32px;
  font-weight: 400;
}

.hero-desc {
  font-size: 17px;
  color: rgba(200,255,216,0.7);
  max-width: 560px;
  margin-bottom: 48px;
  line-height: 1.8;
  font-weight: 300;
}

.hero-btns {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.1em;
  color: var(--bg);
  background: var(--green);
  padding: 14px 32px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.2s;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
}
.btn-primary:hover {
  background: #fff;
  box-shadow: 0 0 40px var(--green);
}

.btn-secondary {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.1em;
  color: var(--green);
  background: transparent;
  padding: 13px 32px;
  text-decoration: none;
  border: 1px solid var(--border-bright);
  transition: all 0.2s;
}
.btn-secondary:hover {
  background: var(--panel);
  border-color: var(--green);
}

/* STATS */
.stats {
  display: flex;
  gap: 48px;
  margin-top: 64px;
  padding-top: 40px;
  border-top: 1px solid var(--border);
}

.stat-item {}
.stat-val {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--green);
  text-shadow: 0 0 20px var(--green);
  line-height: 1;
}
.stat-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-dim);
  letter-spacing: 0.1em;
  margin-top: 4px;
}

/* SECTION */
section {
  position: relative;
  z-index: 1;
  padding: 100px 48px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-tag {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--green);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.section-tag::before {
  content: '';
  width: 24px; height: 1px;
  background: var(--green);
}

h2 {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
  margin-bottom: 48px;
}

h2 .accent { color: var(--green); }

/* PROBLEM / SOLUTION */
.ps-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  background: var(--border);
  margin-bottom: 80px;
}

.ps-panel {
  background: var(--bg2);
  padding: 40px;
}

.ps-panel.problem { border-top: 2px solid var(--red); }
.ps-panel.solution { border-top: 2px solid var(--green); }

.ps-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.15em;
  margin-bottom: 20px;
}
.problem .ps-label { color: var(--red); }
.solution .ps-label { color: var(--green); }

.ps-panel p {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(200,255,216,0.7);
  font-weight: 300;
}

/* ASCII ART FLOW */
.ascii-box {
  background: rgba(0,255,136,0.03);
  border: 1px solid var(--border);
  padding: 32px 40px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--green-dim);
  line-height: 1.8;
  overflow-x: auto;
  margin-bottom: 80px;
  position: relative;
}

.ascii-box::before {
  content: attr(data-title);
  position: absolute;
  top: -1px; left: 24px;
  font-size: 10px;
  letter-spacing: 0.15em;
  color: var(--green);
  background: var(--bg2);
  padding: 0 8px;
}

.ascii-box .highlight { color: var(--green); }
.ascii-box .dim { color: var(--text-dim); }
.ascii-box .danger { color: var(--red); }

/* FEATURES */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background: var(--border);
}

.feature-card {
  background: var(--bg2);
  padding: 32px;
  transition: background 0.2s;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: var(--green);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s;
}

.feature-card:hover { background: rgba(0,255,136,0.06); }
.feature-card:hover::before { transform: scaleX(1); }

.feature-icon {
  font-size: 28px;
  margin-bottom: 16px;
}

.feature-title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  letter-spacing: 0.05em;
}

.feature-desc {
  font-size: 14px;
  color: var(--text-dim);
  line-height: 1.7;
  font-weight: 300;
}

.feature-tag {
  display: inline-block;
  margin-top: 16px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--green);
  letter-spacing: 0.1em;
  border: 1px solid var(--border);
  padding: 3px 8px;
}

/* TECH STACK */
.stack-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  background: var(--border);
  margin-bottom: 80px;
}

.stack-item {
  background: var(--bg2);
  padding: 24px 20px;
  text-align: center;
  transition: background 0.2s;
}
.stack-item:hover { background: rgba(0,255,136,0.06); }

.stack-icon { font-size: 24px; margin-bottom: 10px; }

.stack-name {
  font-family: var(--font-display);
  font-size: 13px;
  color: #fff;
  font-weight: 600;
  margin-bottom: 4px;
}

.stack-role {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-dim);
  letter-spacing: 0.08em;
}

/* COMPARISON */
.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-mono);
  font-size: 13px;
  margin-bottom: 80px;
}

.compare-table th {
  padding: 16px 24px;
  text-align: left;
  background: rgba(0,255,136,0.08);
  color: var(--green);
  letter-spacing: 0.1em;
  font-size: 11px;
  border: 1px solid var(--border);
}

.compare-table th:first-child { color: var(--text-dim); }

.compare-table td {
  padding: 14px 24px;
  border: 1px solid var(--border);
  color: var(--text-dim);
}

.compare-table tr:hover td { background: rgba(0,255,136,0.03); }

.compare-table td:first-child { color: rgba(200,255,216,0.8); }

.yes { color: var(--green) !important; }
.no { color: var(--red) !important; }

/* HOW TO RUN */
.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  background: var(--border);
  margin-bottom: 48px;
}

.step {
  background: var(--bg2);
  padding: 32px 24px;
  position: relative;
}

.step-num {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 900;
  color: rgba(0,255,136,0.1);
  line-height: 1;
  margin-bottom: 16px;
}

.step-title {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--green);
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.step-code {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-dim);
  background: rgba(0,255,136,0.05);
  padding: 10px 14px;
  border-left: 2px solid var(--border-bright);
}

/* TERMINAL */
.terminal {
  background: #010a04;
  border: 1px solid var(--border);
  border-radius: 0;
  margin-bottom: 80px;
  overflow: hidden;
}

.terminal-bar {
  background: rgba(0,255,136,0.08);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border);
}

.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.r { background: #ff5f56; }
.dot.y { background: #ffbd2e; }
.dot.g { background: #27c93f; }

.terminal-title {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-dim);
  margin-left: 8px;
  letter-spacing: 0.1em;
}

.terminal-body {
  padding: 24px 28px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 2;
}

.t-prompt { color: var(--green); }
.t-cmd { color: #fff; }
.t-out { color: var(--text-dim); }
.t-success { color: var(--green); }
.t-warn { color: #ffbd2e; }
.t-error { color: var(--red); }
.t-info { color: var(--cyan); }

/* FOOTER */
footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--border);
  padding: 40px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-logo {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--green);
  text-shadow: 0 0 20px var(--green);
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-dim);
  text-decoration: none;
  letter-spacing: 0.1em;
  transition: color 0.2s;
}
.footer-links a:hover { color: var(--green); }

.footer-copy {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-dim);
  letter-spacing: 0.05em;
}

/* DIVIDER */
.divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 0 48px;
}

/* BADGE ROW */
.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 80px;
}

.badge {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  padding: 6px 14px;
  border: 1px solid var(--border);
  color: var(--text-dim);
  display: flex;
  align-items: center;
  gap: 6px;
}
.badge .dot-badge {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 6px var(--green);
}

/* GLOW ORBS */
.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}
.orb1 { width: 400px; height: 400px; background: rgba(0,255,136,0.04); top: 20%; left: -100px; }
.orb2 { width: 300px; height: 300px; background: rgba(0,229,255,0.03); bottom: 30%; right: -80px; }

/* ANIMATIONS */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-content > * {
  animation: fadeInUp 0.8s ease forwards;
  opacity: 0;
}
.hero-content > *:nth-child(1) { animation-delay: 0.1s; }
.hero-content > *:nth-child(2) { animation-delay: 0.2s; }
.hero-content > *:nth-child(3) { animation-delay: 0.3s; }
.hero-content > *:nth-child(4) { animation-delay: 0.4s; }
.hero-content > *:nth-child(5) { animation-delay: 0.5s; }
.hero-content > *:nth-child(6) { animation-delay: 0.6s; }

/* CURSOR BLINK */
.blink {
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* RESPONSIVE */
@media (max-width: 900px) {
  nav { padding: 16px 24px; }
  .nav-links { display: none; }
  section { padding: 60px 24px; }
  .hero { padding: 100px 24px 60px; }
  .ps-grid { grid-template-columns: 1fr; }
  .features-grid { grid-template-columns: 1fr 1fr; }
  .stack-grid { grid-template-columns: repeat(3, 1fr); }
  .steps { grid-template-columns: 1fr 1fr; }
  .radar-wrap { display: none; }
  footer { flex-direction: column; gap: 20px; text-align: center; }
}
</style>
</head>
<body>

<div class="orb orb1"></div>
<div class="orb orb2"></div>

<!-- NAV -->
<nav>
  <div class="nav-logo">NET<span>SHIELD</span> X</div>
  <ul class="nav-links">
    <li><a href="#problem">PROBLEM</a></li>
    <li><a href="#features">FEATURES</a></li>
    <li><a href="#architecture">ARCHITECTURE</a></li>
    <li><a href="#stack">STACK</a></li>
    <li><a href="#run">SETUP</a></li>
  </ul>
  <a href="https://github.com/LaGGod7/netshield-x" class="nav-badge">GITHUB ↗</a>
</nav>

<!-- HERO -->
<div class="hero">
  <div class="radar-wrap">
    <div class="radar">
      <div class="radar-line"></div>
      <div class="radar-cross"></div>
      <div class="blip"></div>
      <div class="blip"></div>
      <div class="blip"></div>
    </div>
  </div>

  <div class="hero-content">
    <div class="hero-tag">DECENTRALIZED THREAT DEFENSE SYSTEM</div>
    <h1>NET<span class="accent">SHIELD</span><br>X</h1>
    <div class="hero-sub">PEER-TO-PEER INTRUSION DETECTION</div>
    <p class="hero-desc">
      When one node detects an attack, every node on the mesh is armed against it instantly.
      No central server. No third party. No single point of failure.
    </p>
    <div class="hero-btns">
      <a href="#run" class="btn-primary">DEPLOY NOW</a>
      <a href="https://github.com/LaGGod7/netshield-x" class="btn-secondary">VIEW SOURCE →</a>
    </div>
    <div class="stats">
      <div class="stat-item">
        <div class="stat-val">10s</div>
        <div class="stat-label">PROPAGATION TIME</div>
      </div>
      <div class="stat-item">
        <div class="stat-val">P2P</div>
        <div class="stat-label">MESH ARCHITECTURE</div>
      </div>
      <div class="stat-item">
        <div class="stat-val">L7</div>
        <div class="stat-label">DETECTION LAYER</div>
      </div>
      <div class="stat-item">
        <div class="stat-val">0</div>
        <div class="stat-label">THIRD PARTIES</div>
      </div>
    </div>
  </div>
</div>

<hr class="divider"/>

<!-- PROBLEM / SOLUTION -->
<section id="problem">
  <div class="section-tag">THE CORE PROBLEM</div>
  <h2>Every machine learns alone.<br>Until <span class="accent">now.</span></h2>

  <div class="ps-grid">
    <div class="ps-panel problem">
      <div class="ps-label">⚠ THE PROBLEM</div>
      <p>Traditional firewalls protect machines individually. When attacker 45.33.32.156 hits Machine A and gets blocked — Machine B, C, and D have no idea that attacker exists. Each machine learns from scratch, in isolation, every single time. Meanwhile the attacker just moves to the next target.</p>
    </div>
    <div class="ps-panel solution">
      <div class="ps-label">✓ THE SOLUTION</div>
      <p>NetShield X is a P2P mesh where every node shares threat intelligence the moment any one of them sees an attack. One node gets hit → blocked IP + blockchain record propagates to every peer within 10 seconds. The attacker is already known before they try the second machine.</p>
    </div>
  </div>

  <div class="ascii-box" data-title="TRADITIONAL vs NETSHIELD X">
<span class="dim">TRADITIONAL:                           NETSHIELD X MESH:</span>

<span class="danger">[Attacker]</span> ──► <span class="highlight">[Machine A]</span> ✓ blocked    <span class="danger">[Attacker]</span> ──► <span class="highlight">[Node A]</span> detects attack
    │                                         │
    └────► <span class="highlight">[Machine B]</span> ✗ no idea             ├── gossip ──► <span class="highlight">[Node B]</span> ✓ already armed
    │                                         │
    └────► <span class="highlight">[Machine C]</span> ✗ no idea             ├── gossip ──► <span class="highlight">[Node C]</span> ✓ already armed
    │                                         │
    └────► <span class="highlight">[Machine D]</span> ✗ no idea             └── gossip ──► <span class="highlight">[Node D]</span> ✓ already armed

<span class="dim">Result: attacker hits every machine      Result: one attack detected = all nodes</span>
<span class="dim">separately before getting blocked.       armed before attacker reaches them.</span>
  </div>
</section>

<hr class="divider"/>

<!-- FEATURES -->
<section id="features">
  <div class="section-tag">CAPABILITIES</div>
  <h2>What <span class="accent">NetShield X</span><br>actually does</h2>

  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon">🔥</div>
      <div class="feature-title">Brute Force Engine</div>
      <div class="feature-desc">Rolling window detection — 4 hits in 20 seconds triggers instant permanent ban. Memory-mapped IP tracking with zero database overhead.</div>
      <div class="feature-tag">BRUTE_THRESHOLD: 4 / BRUTE_WINDOW: 20s</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🕸️</div>
      <div class="feature-title">Gossip Protocol</div>
      <div class="feature-desc">P2P state sync every 10 seconds. Blocked IPs, blockchain transactions, and peer addresses merge across all nodes automatically.</div>
      <div class="feature-tag">HTTP POST · EVERY 10s · ALL PEERS</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">📡</div>
      <div class="feature-title">UDP Peer Discovery</div>
      <div class="feature-desc">Zero configuration. Every node broadcasts NETSHIELD_ANNOUNCE to the entire subnet. Peers self-assemble into the mesh automatically.</div>
      <div class="feature-tag">UDP :30001 · BROADCAST · AUTO</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">⛓️</div>
      <div class="feature-title">Blockchain Ledger</div>
      <div class="feature-desc">Every attack mints a SHA256-hashed transaction. Distributed across all peers — no single node can tamper with or erase the record.</div>
      <div class="feature-tag">SHA256 · IMMUTABLE · DISTRIBUTED</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🎯</div>
      <div class="feature-title">Honeypot Trap</div>
      <div class="feature-desc">The /login endpoint is a deliberate lure. It monitors for brute force, DDoS floods, and port scans — actively drawing attackers in to fingerprint them.</div>
      <div class="feature-tag">LAYER-7 · BEHAVIOUR ANALYSIS</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🤖</div>
      <div class="feature-title">AI Threat Classifier</div>
      <div class="feature-desc">Classifies incoming threats as Automated Bot, Human Operator, Botnet Node, or Script Kiddie based on timing variance and request patterns.</div>
      <div class="feature-tag">TENSORFLOW.JS · REAL-TIME</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">⚡</div>
      <div class="feature-title">WebSocket Dashboard</div>
      <div class="feature-desc">Socket.IO pushes three events to all connected clients the instant fireAlert() fires — new_alert, blockchain_tx, and stats_update simultaneously.</div>
      <div class="feature-tag">SOCKET.IO · io.emit × 3</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🛡️</div>
      <div class="feature-title">Pre-flight Drops</div>
      <div class="feature-desc">Blocked IPs are dropped with 403 Forbidden before ever reaching application logic — saving CPU cycles and preventing any processing of malicious payloads.</div>
      <div class="feature-tag">403 FORBIDDEN · ZERO CPU WASTE</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon">📊</div>
      <div class="feature-title">Live Radar UI</div>
      <div class="feature-desc">Animated radar sweep, live particle effects showing attack vectors, and organic CPU telemetry that spikes during real threat processing.</div>
      <div class="feature-tag">FRAMER MOTION · REACT · TAILWIND</div>
    </div>
  </div>
</section>

<hr class="divider"/>

<!-- ARCHITECTURE -->
<section id="architecture">
  <div class="section-tag">SYSTEM DESIGN</div>
  <h2>How the <span class="accent">mesh</span><br>actually works</h2>

  <div class="ascii-box" data-title="NETSHIELD X NODE ARCHITECTURE">
<span class="highlight">┌─────────────────────────────────────────────────────────────────┐</span>
<span class="highlight">│</span>                       NETSHIELD X NODE                          <span class="highlight">│</span>
<span class="highlight">│</span>                                                                  <span class="highlight">│</span>
<span class="highlight">│</span>  <span class="dim">┌─────────────────┐</span>    WebSocket    <span class="dim">┌───────────────────────┐</span>  <span class="highlight">│</span>
<span class="highlight">│</span>  <span class="dim">│   React UI      │</span> ◄────────────── <span class="dim">│   Express + Socket.IO  │</span>  <span class="highlight">│</span>
<span class="highlight">│</span>  <span class="dim">│   Radar         │</span>  new_alert      <span class="dim">│   Brute Force Engine   │</span>  <span class="highlight">│</span>
<span class="highlight">│</span>  <span class="dim">│   Blockchain    │</span>  blockchain_tx  <span class="dim">│   Honeypot /login      │</span>  <span class="highlight">│</span>
<span class="highlight">│</span>  <span class="dim">│   Peer List     │</span>  stats_update   <span class="dim">│   AI Classifier        │</span>  <span class="highlight">│</span>
<span class="highlight">│</span>  <span class="dim">└─────────────────┘</span>                 <span class="dim">└──────────┬────────────┘</span>  <span class="highlight">│</span>
<span class="highlight">│</span>                                                  <span class="dim">│</span>               <span class="highlight">│</span>
<span class="highlight">│</span>                             <span class="dim">┌────────────────────┴──────────┐</span>   <span class="highlight">│</span>
<span class="highlight">│</span>                             <span class="dim">│</span>    <span class="highlight">Gossip Protocol</span>            <span class="dim">│</span>   <span class="highlight">│</span>
<span class="highlight">│</span>                             <span class="dim">│</span>  HTTP POST /api/peer_sync     <span class="dim">│</span>   <span class="highlight">│</span>
<span class="highlight">│</span>                             <span class="dim">│</span>  Merges: IPs + TXs + Peers   <span class="dim">│</span>   <span class="highlight">│</span>
<span class="highlight">│</span>                             <span class="dim">└────────────────────┬──────────┘</span>   <span class="highlight">│</span>
<span class="highlight">│</span>                                                  <span class="dim">│</span>               <span class="highlight">│</span>
<span class="highlight">│</span>                             <span class="dim">┌────────────────────┴──────────┐</span>   <span class="highlight">│</span>
<span class="highlight">│</span>                             <span class="dim">│</span>  <span class="highlight">UDP Broadcast :30001</span>         <span class="dim">│</span>   <span class="highlight">│</span>
<span class="highlight">│</span>                             <span class="dim">│</span>  NETSHIELD_ANNOUNCE every 5s  <span class="dim">│</span>   <span class="highlight">│</span>
<span class="highlight">│</span>                             <span class="dim">└───────────────────────────────┘</span>   <span class="highlight">│</span>
<span class="highlight">└─────────────────────────────────────────────────────────────────┘</span>
         <span class="dim">│  gossip sync every 10s          │  gossip sync every 10s</span>
         ▼                                 ▼
   <span class="highlight">[Peer Node B]</span>  ◄────────────────► <span class="highlight">[Peer Node C]</span>
  </div>

  <div class="ascii-box" data-title="ATTACK PROPAGATION TIMELINE">
<span class="highlight">T+0s</span>   <span class="danger">[45.33.32.156]</span> hits Node A /login — 4th attempt in 20s window
<span class="highlight">T+0s</span>   <span class="highlight">fireAlert()</span> fires — IP banned locally, blockchain TX minted
<span class="highlight">T+0s</span>   Socket.IO pushes <span class="highlight">new_alert</span> + <span class="highlight">blockchain_tx</span> + <span class="highlight">stats_update</span> to dashboard
<span class="highlight">T+0s</span>   HTTP POST to all knownPeers with full state payload
<span class="highlight">T+10s</span>  <span class="dim">Next gossip cycle — Node B, C, D merge blocked IP + TX into own state</span>
<span class="highlight">T+10s</span>  <span class="danger">[45.33.32.156]</span> hits Node B — <span class="highlight">instant 403 FORBIDDEN</span> before app logic
<span class="highlight">T+10s</span>  <span class="success">Attack fingerprint distributed. Mesh armed. Zero further processing.</span>
  </div>
</section>

<hr class="divider"/>

<!-- STACK -->
<section id="stack">
  <div class="section-tag">TECHNOLOGY</div>
  <h2>The <span class="accent">stack</span></h2>

  <div class="stack-grid">
    <div class="stack-item">
      <div class="stack-icon">⚛️</div>
      <div class="stack-name">React</div>
      <div class="stack-role">UI FRAMEWORK</div>
    </div>
    <div class="stack-item">
      <div class="stack-icon">⚡</div>
      <div class="stack-name">Vite</div>
      <div class="stack-role">BUILD TOOL</div>
    </div>
    <div class="stack-item">
      <div class="stack-icon">🟢</div>
      <div class="stack-name">Node.js</div>
      <div class="stack-role">RUNTIME</div>
    </div>
    <div class="stack-item">
      <div class="stack-icon">🚂</div>
      <div class="stack-name">Express</div>
      <div class="stack-role">HTTP SERVER</div>
    </div>
    <div class="stack-item">
      <div class="stack-icon">🔌</div>
      <div class="stack-name">Socket.IO</div>
      <div class="stack-role">WEBSOCKETS</div>
    </div>
    <div class="stack-item">
      <div class="stack-icon">🎨</div>
      <div class="stack-name">Tailwind</div>
      <div class="stack-role">STYLING</div>
    </div>
    <div class="stack-item">
      <div class="stack-icon">🎭</div>
      <div class="stack-name">Framer</div>
      <div class="stack-role">ANIMATIONS</div>
    </div>
    <div class="stack-item">
      <div class="stack-icon">📘</div>
      <div class="stack-name">TypeScript</div>
      <div class="stack-role">TYPE SAFETY</div>
    </div>
    <div class="stack-item">
      <div class="stack-icon">🔐</div>
      <div class="stack-name">SHA256</div>
      <div class="stack-role">BLOCKCHAIN</div>
    </div>
    <div class="stack-item">
      <div class="stack-icon">🤖</div>
      <div class="stack-name">TensorFlow</div>
      <div class="stack-role">AI CLASSIFY</div>
    </div>
  </div>

  <div class="section-tag">WHY NOT CLOUDFLARE OR MICROSOFT SENTINEL?</div>
  <h2>Built for networks that<br><span class="accent">can't use the cloud</span></h2>

  <table class="compare-table">
    <thead>
      <tr>
        <th>CAPABILITY</th>
        <th>CLOUDFLARE WAF</th>
        <th>MICROSOFT SENTINEL</th>
        <th>NETSHIELD X</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Self-hosted</td>
        <td class="no">✗ No</td>
        <td class="no">✗ No</td>
        <td class="yes">✓ Yes</td>
      </tr>
      <tr>
        <td>No third party</td>
        <td class="no">✗ Routes via CDN</td>
        <td class="no">✗ Azure cloud only</td>
        <td class="yes">✓ Your infra only</td>
      </tr>
      <tr>
        <td>Air-gap compatible</td>
        <td class="no">✗ No</td>
        <td class="no">✗ No</td>
        <td class="yes">✓ Yes</td>
      </tr>
      <tr>
        <td>P2P mesh intel sharing</td>
        <td class="no">✗ No</td>
        <td class="no">✗ No</td>
        <td class="yes">✓ Yes — core feature</td>
      </tr>
      <tr>
        <td>Zero-config peer discovery</td>
        <td class="no">✗ No</td>
        <td class="no">✗ No</td>
        <td class="yes">✓ UDP auto-discovery</td>
      </tr>
      <tr>
        <td>Distributed ledger</td>
        <td class="no">✗ No</td>
        <td class="no">✗ Centralized logs</td>
        <td class="yes">✓ Blockchain across peers</td>
      </tr>
      <tr>
        <td>Monthly cost</td>
        <td class="no">$20–$200+</td>
        <td class="no">$2,000+</td>
        <td class="yes">$0</td>
      </tr>
    </tbody>
  </table>
</section>

<hr class="divider"/>

<!-- HOW TO RUN -->
<section id="run">
  <div class="section-tag">DEPLOYMENT</div>
  <h2>Get it <span class="accent">running</span></h2>

  <div class="steps">
    <div class="step">
      <div class="step-num">01</div>
      <div class="step-title">CLONE REPO</div>
      <div class="step-code">git clone https://github.com/<br>LaGGod7/netshield-x.git<br>cd netshield-x</div>
    </div>
    <div class="step">
      <div class="step-num">02</div>
      <div class="step-title">INSTALL</div>
      <div class="step-code">npm install</div>
    </div>
    <div class="step">
      <div class="step-num">03</div>
      <div class="step-title">START BACKEND</div>
      <div class="step-code">npx ts-node server.ts<br><br># Terminal 1</div>
    </div>
    <div class="step">
      <div class="step-num">04</div>
      <div class="step-title">START FRONTEND</div>
      <div class="step-code">npm run dev<br><br># Terminal 2</div>
    </div>
  </div>

  <div class="terminal">
    <div class="terminal-bar">
      <div class="dot r"></div>
      <div class="dot y"></div>
      <div class="dot g"></div>
      <div class="terminal-title">NETSHIELD X — BOOT SEQUENCE</div>
    </div>
    <div class="terminal-body">
      <div><span class="t-prompt">$ </span><span class="t-cmd">npx ts-node server.ts</span></div>
      <div><span class="t-info">[UDP] Discovery socket bound on port 30001</span></div>
      <div><span class="t-success">[MESH] Broadcasting NETSHIELD_ANNOUNCE to 255.255.255.255</span></div>
      <div><span class="t-success">[AI] Threat Classifier Online & Calibrated</span></div>
      <div><span class="t-success">[SERVER] NetShield X listening on port 3000</span></div>
      <div><span class="t-info">[PEER] Discovered node at 192.168.1.42:3000</span></div>
      <div><span class="t-info">[SYNC] Merging state with 1 peer — 0 new blocks</span></div>
      <div><span class="t-warn">[ALERT] Brute force detected — 45.33.32.156</span></div>
      <div><span class="t-success">[BLOCK] IP banned — propagating to 1 peers</span></div>
      <div><span class="t-success">[CHAIN] TX minted — hash: a3f9b2c1d4e8...</span></div>
      <div><span class="t-prompt">█<span class="blink">_</span></span></div>
    </div>
  </div>

  <div class="badges">
    <div class="badge"><span class="dot-badge"></span>TypeScript</div>
    <div class="badge"><span class="dot-badge"></span>React 18</div>
    <div class="badge"><span class="dot-badge"></span>Node.js v20+</div>
    <div class="badge"><span class="dot-badge"></span>Socket.IO</div>
    <div class="badge"><span class="dot-badge"></span>UDP :30001</div>
    <div class="badge"><span class="dot-badge"></span>HTTP :3000</div>
    <div class="badge"><span class="dot-badge"></span>SHA256 Ledger</div>
    <div class="badge"><span class="dot-badge"></span>P2P Mesh</div>
    <div class="badge"><span class="dot-badge"></span>Zero Config</div>
    <div class="badge"><span class="dot-badge"></span>Air-Gap Ready</div>
  </div>
</section>

<footer>
  <div class="footer-logo">NETSHIELD X</div>
  <div class="footer-links">
    <a href="https://github.com/LaGGod7/netshield-x">GITHUB</a>
    <a href="#problem">DOCS</a>
    <a href="#run">SETUP</a>
  </div>
  <div class="footer-copy">BUILT BY LAGGOD7 · DECENTRALIZED IDS</div>
</footer>

</body>
</html>
