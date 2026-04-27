# WebFingerprint — Claude Code Context

## What This Project Is
A privacy awareness and browser fingerprinting demonstration app.
Shows visitors what information websites can collect about them in real time.
Built as a portfolio piece and technical interview demo.

Original codebase: https://github.com/siinghd/yourinfo
This is a fork with two core changes:
1. Frontend completely redesigned (new visual identity)
2. All AI integrations replaced with Anthropic Claude API

## Tech Stack
- Frontend: React 19 + TypeScript + Vite
- Backend: Bun runtime + Hono framework
- Real-time: Native Bun WebSocket
- Globe: CesiumJS + OpenStreetMap tiles
- AI: Anthropic Claude API (claude-sonnet-4-5 or claude-haiku-4-5)
- Cache: Redis (optional, for AI response caching + unique visitor tracking)
- Geolocation: MaxMind GeoLite2 local database (data/GeoLite2-City.mmdb)
- Process manager: PM2 (production)

## Repository Structure
server/
index.ts          # Main Bun/Hono server, WebSocket handler, all API routes
ai-profiler.ts    # AI profiling + ad auction — ALL Grok/OpenRouter code lives here
geolocation.ts    # MaxMind GeoLite2 IP lookup
shared-visitors.ts # Redis Pub/Sub for multi-instance visitor sync
src/
App.tsx           # Root component, layout, globe + panel composition
App.css           # Root styles
main.tsx          # Entry point
index.css         # Global styles, CSS variables, theme
types/index.ts    # Shared TypeScript types (used by both client and server)
components/
Globe.tsx       # CesiumJS 3D globe, visitor pins, arcs, camera controls
InfoPanel.tsx   # Collapsible data panel: hardware, browser, network, AI profile
InfoPanel.css   # Panel styles
AdAuction.tsx   # Ad RTB auction simulation UI
AdAuction.css   # Auction styles
hooks/
useWebSocket.ts # WS lifecycle, client info collection, AI fetch, behavior tracking
utils/
fingerprint.ts      # Core browser fingerprinting (canvas, WebGL, audio, fonts, etc.)
advanced.ts         # Advanced fingerprinting (permissions, storage, Intl, features)
behavior.ts         # Mouse, scroll, typing, tab focus behavioral tracking
wasmFingerprint.ts  # WebAssembly timing fingerprint
webgpuFingerprint.ts # WebGPU adapter info + compute shader timing fingerprint
chromeAI.ts         # Chrome Gemini Nano on-device AI (window.ai)
adAuction.ts        # Ad auction logic, company definitions, CPM calculation
## What To Change — AI Integration

### Files to modify: server/ai-profiler.ts

Remove ALL of:
- Grok API (GROK_API_KEY, GROK_API_URL, grok-4-1-fast-reasoning model)
- OpenRouter/MiMo fallback (OPENROUTER_API_KEY, OPENROUTER_API_URL, xiaomi/mimo-v2-flash model)

Replace with:
- Anthropic Claude API using the official @anthropic-ai/sdk package
- Primary model: claude-haiku-4-5-20251001 (fast, cheap, good for profiling)
- Fallback model: same model with reduced max_tokens if primary fails
- Keep the exact same function signatures: generateAIProfile(), generateAIAuction()
- Keep Redis caching layer completely unchanged
- Keep the rule-based heuristic fallback completely unchanged
- Keep Chrome Gemini Nano (chromeAI.ts) completely unchanged — it's client-side only

### Environment variables to update:
Remove: GROK_API_KEY, OPENROUTER_API_KEY
Add: ANTHROPIC_API_KEY

### Anthropic SDK usage pattern:
```typescript
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const message = await client.messages.create({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Your prompt here' }],
});
const text = message.content[0].type === 'text' ? message.content[0].text : '';
```

## What To Change — Frontend Visual

### Design Direction
Dark, terminal/surveillance aesthetic. Think: security dashboard, not a marketing page.
- Color palette: near-black background (#0a0a0f), acid green accents (#00ff88), 
  electric blue secondary (#0088ff), red warning (#ff3366)
- Typography: monospace for data values (JetBrains Mono or Fira Code via Google Fonts),
  sans-serif for UI chrome
- Feel: like you are being watched. Data should feel exposed, not friendly.
- Animations: scanline effects, pulsing indicators, typewriter reveals for AI profile text
- Globe: keep CesiumJS but style it dark — dark ocean, muted land, bright visitor pins

### Files to redesign (in order of priority):
1. src/index.css — global variables, reset, base theme
2. src/App.css — layout, main grid
3. src/components/InfoPanel.css — data panel visual
4. src/components/AdAuction.css — auction panel visual
5. src/App.tsx — layout structure (minimal JSX changes, mostly CSS class renames)
6. src/components/InfoPanel.tsx — add Privacy Risk Score section, Live Audit Log panel
7. src/components/AdAuction.tsx — auction timeline animation

### New UI components to add (alongside redesign):
- Privacy Risk Score: aggregate 0-100 score, component breakdown, color-coded severity
- Live Audit Log: real-time scrolling list of collection events with timestamps
- AI source badge: which tier generated the profile (Claude API / Gemini Nano / heuristic)
- Fingerprint entropy display: how unique is this configuration

## What NOT to Change
- server/geolocation.ts — leave completely unchanged
- server/shared-visitors.ts — leave completely unchanged  
- server/index.ts — only change GROK_API_KEY refs to ANTHROPIC_API_KEY in comments/logs
- src/utils/fingerprint.ts — leave unchanged
- src/utils/advanced.ts — leave unchanged
- src/utils/behavior.ts — leave unchanged
- src/utils/wasmFingerprint.ts — leave unchanged
- src/utils/webgpuFingerprint.ts — leave unchanged
- src/utils/chromeAI.ts — leave unchanged
- src/hooks/useWebSocket.ts — leave unchanged
- src/types/index.ts — leave unchanged (add to it only if new features need new types)
- Globe.tsx — leave unchanged (CesiumJS integration is complex, don't touch)
- All build config: vite.config.ts, tsconfig*.json, package.json scripts

## Key Constraints
- Bun is the runtime — not Node. Use Bun-compatible APIs.
- The @anthropic-ai/sdk package works with Bun natively.
- Do not use fetch() manually for Anthropic — use the SDK.
- Keep all function return types identical to the original — useWebSocket.ts 
  depends on the exact shape of generateAIProfile() return value.
- Redis is optional — all Redis code must have graceful fallback to non-Redis mode.
- The MaxMind database file (data/GeoLite2-City.mmdb) must exist before server starts.
  If missing, geolocation silently returns null — this is expected behavior.

## Running the Project
```bash
# Install dependencies
bun install

# Development (frontend + backend separate terminals)
bun run dev          # frontend on :5173
bun run server/index.ts  # backend on :3020

# Production build
bun run build
bun run server/index.ts
```

## Environment Variables (.env)
PORT=3020
VITE_WS_PORT=3020
ANTHROPIC_API_KEY=your_anthropic_api_key_here_bxmrN34eLwk30yXwqPQPYW7qazyojTJUBg4TxIU6HK7W8xo3t9yPL7SAsuAcQ-JaS_rgAA
REDIS_URL=redis://localhost:6379  # optional
## Git Conventions
- Commit after each major change (AI integration, then visual redesign)
- Branch: main only (solo project)
- Do not commit .env files

## Session Startup Checklist
Before making any changes in a new session:
1. Read server/ai-profiler.ts completely before modifying it
2. Read src/types/index.ts to understand all shared types
3. Read the specific component file before modifying any component
4. Run `bun run build` after changes to verify TypeScript compiles
