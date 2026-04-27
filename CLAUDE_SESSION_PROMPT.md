# WebFingerprint — Session Starter Prompt
# Paste this entire block to Claude Code at the start of each session

You are working on WebFingerprint, a browser fingerprinting and privacy awareness app.
Read CLAUDE.md first before doing anything else — it contains the full project context,
architecture, design direction, and explicit list of what to change vs what to leave alone.

## Session 1 Goals (AI Integration):
1. Read server/ai-profiler.ts completely
2. Read src/types/index.ts completely  
3. Replace all Grok + OpenRouter code with Anthropic Claude API (@anthropic-ai/sdk)
4. Update .env.example to use ANTHROPIC_API_KEY instead of GROK_API_KEY
5. Run `bun run build` to verify no TypeScript errors
6. Commit: "feat: replace Grok/OpenRouter with Anthropic Claude API"

## Session 2 Goals (Frontend Redesign):
1. Read src/index.css, src/App.css, src/components/InfoPanel.css, src/components/AdAuction.css
2. Read src/App.tsx and src/components/InfoPanel.tsx
3. Implement the dark surveillance aesthetic described in CLAUDE.md
4. Add Privacy Risk Score component to InfoPanel
5. Add Live Audit Log panel
6. Run `bun run build` to verify no errors
7. Commit: "feat: dark surveillance UI redesign"

Do NOT start Session 2 work until Session 1 is committed and building successfully.
