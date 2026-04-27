# WebFingerprint

> **A real-time browser fingerprinting and privacy awareness demo.**  
> See exactly what websites know about you — before the page even loads.

---

## Demo

_Live demo coming soon._

---

## Screenshots

_Screenshots coming soon._

---

## Features

### Browser Fingerprinting
- Canvas fingerprint (2D rendering hash)
- WebGL renderer + vendor identification
- Audio context fingerprint
- Installed font detection
- WebAssembly timing fingerprint
- WebGPU adapter info and compute shader timing
- Entropy score — how unique is your configuration

### Behavioral Biometrics
- Mouse movement style and velocity patterns
- Scroll rhythm and depth tracking
- Typing cadence (keystroke timing)
- Tab focus / visibility events

### Network & System Intelligence
- Real IP geolocation (MaxMind GeoLite2 — local, no third-party calls)
- ISP, ASN, and connection type detection
- Timezone vs. reported locale mismatch detection
- Battery level and charging state (where available)
- Hardware concurrency and device memory

### AI-Powered Profile
- Claude API (claude-haiku-4-5) infers age range, income bracket, interests, and tech comfort from your fingerprint
- Three-tier source: Claude API → Chrome Gemini Nano (on-device) → deterministic heuristic fallback
- Source badge shows exactly which tier generated your profile

### Ad Auction Simulation
- Simulated real-time bidding (RTB) auction with 15+ named ad companies
- AI generates realistic CPM bids based on your actual fingerprint data
- Animated reveal — one bid at a time, 120ms cadence
- "Why This Price?" breakdown: factors that raised or lowered your value
- Links to real ad preference dashboards (Google, Meta, Amazon, etc.)

### Live Globe
- CesiumJS 3D globe with visitor pins and arc animations
- Multi-visitor session: see everyone currently on the site
- Click any pin to inspect that visitor's collected data

### Privacy Risk Score
- Aggregate 0–100 score with component breakdown
- Color-coded severity per data category

### Revisit Detection
- Cross-session visitor recognition via fingerprint hash
- Shows visit count, first seen, and days since last visit

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Bun runtime + Hono framework |
| Real-time | Native Bun WebSocket |
| Globe | CesiumJS + OpenStreetMap tiles |
| AI (server) | Anthropic Claude API (`claude-haiku-4-5-20251001`) |
| AI (client) | Chrome Gemini Nano (`window.ai`) — on-device, no API call |
| Geolocation | MaxMind GeoLite2 City (local MMDB, no external requests) |
| Cache | Redis (optional) — AI response cache + unique visitor tracking |
| Process manager | PM2 (production) |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.1
- An [Anthropic API key](https://console.anthropic.com/)
- MaxMind GeoLite2-City database (free, requires account)

### 1. Clone and install

```bash
git clone https://github.com/rsalehin/WebFingerprint.git
cd WebFingerprint
bun install
```

### 2. Get the GeoLite2 database

Sign up at [maxmind.com](https://www.maxmind.com/en/geolite2/signup) and download `GeoLite2-City.mmdb`. Place it at:

```
data/GeoLite2-City.mmdb
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 4. Run in development

```bash
# Terminal 1 — backend
bun run server/index.ts

# Terminal 2 — frontend
bun run dev
```

Open http://localhost:5173.

### 5. Production build

```bash
bun run build
bun run server/index.ts
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | Yes | `3020` | Backend server port |
| `VITE_WS_PORT` | Yes | `3020` | WebSocket port (must match `PORT`) |
| `ANTHROPIC_API_KEY` | Yes | — | Anthropic API key for AI profiling and auction |
| `REDIS_URL` | No | — | Redis connection URL; enables caching and revisit tracking |

---

## What Information Is Collected

Everything collected stays in your browser session and the in-memory server state. Nothing is persisted to a database. This site collects:

| Category | Examples |
|---|---|
| Network | IP address, ISP, ASN, country, city, timezone |
| Hardware | CPU cores, device memory, GPU model, battery |
| Browser | User agent, language, plugins, Do Not Track |
| Screen | Resolution, color depth, pixel ratio, touch support |
| Fingerprints | Canvas hash, WebGL hash, audio fingerprint, font list |
| Behavioral | Mouse velocity style, scroll depth, typing rhythm |
| Advanced | Permissions state, storage quotas, Intl locale, feature support |

---

## Architecture

```
Browser                          Server (Bun + Hono, :3020)
-------                          --------------------------
useWebSocket.ts                  index.ts
  |  fingerprint.ts  ---------->  WebSocket handler
  |  advanced.ts                   |  geolocation.ts (MaxMind local)
  |  behavior.ts                   |  ai-profiler.ts
  |  wasmFingerprint.ts            |    +- Claude API (haiku)
  |  webgpuFingerprint.ts          |    +- heuristic fallback
  |  chromeAI.ts (on-device)       |  shared-visitors.ts (Redis pub/sub)
  +--------------------------------> HTTP routes: /api/auction, /api/revisit
```

---

## Technical Highlights

1. **Three-tier AI fallback** — Claude API -> Chrome Gemini Nano (on-device, zero latency, zero cost) -> deterministic heuristic. The UI badge shows which tier ran.

2. **Entropy scoring** — Shannon entropy calculated across fingerprint dimensions to quantify how uniquely identifiable the browser is among the global pool.

3. **WebAssembly + WebGPU timing fingerprints** — measures execution timing variance of WASM and GPU compute shaders; resistant to simple spoofing because timing reflects real hardware.

4. **Behavioral biometrics** — mouse velocity, scroll cadence, and keystroke timing are collected passively and fed into the AI profiler as soft signals.

5. **Real-time RTB simulation** — ad auction runs in <100ms (matching real RTB latency), with AI-generated CPM bids derived from the actual fingerprint rather than fake random values.

6. **Redis-optional architecture** — every Redis call has a graceful sync fallback so the app runs fully in single-instance mode with zero infrastructure beyond Bun.

---

## Privacy Tips

- Use a privacy-focused browser (Firefox + uBlock Origin, Brave, or Tor Browser)
- Enable "Resist Fingerprinting" in Firefox (`privacy.resistFingerprinting = true`)
- Use a VPN or Tor to mask your real IP and geolocation
- Disable JavaScript for sites you don't trust (breaks most fingerprinting vectors)
- Check your real ad profiles: [Google](https://adssettings.google.com), [Meta](https://www.facebook.com/adpreferences), [Amazon](https://www.amazon.com/adprefs)

---

## License

MIT (c) rsalehin
