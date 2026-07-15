# Story 2 — API Server

**Goal:** a thin Express server wrapping Story 1's scoring function.

**Endpoint:** `POST /api/gate`

Request:
```json
{
  "domain": "intent-to-billing" | "fraud-to-account-action",
  "sourceAgentClaim": "string",
  "claimBasis": "verified-fact" | "corroborated-signal" | "single-weak-signal" | "speculative-inference",
  "downstreamAction": "string",
  "actionReversibility": "easily-reversible" | "hard-to-reverse" | "irreversible"
}
```

Response:
```json
{
  "decision": "Auto-Execute" | "Staged/Canary" | "Human Review",
  "score": 0-100,
  "rationale": "string"
}
```

**Stack:** Node.js + TypeScript, Express (Hono is an acceptable substitute, no other spec changes needed). Serves the static frontend (Story 3) from the same process — one process to run, nothing separate to deploy.

**Scripts:** `npm run dev` (tsx/ts-node), `npm run build`, `npm start`.

**Out of scope:** auth, persistence, rate limiting, handling arbitrary free-text handoffs from a real external caller — this endpoint only needs to serve the 6 fixed demo scenarios from Story 4.
