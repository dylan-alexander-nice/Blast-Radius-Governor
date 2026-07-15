# Story 3 — Web UI

**Goal:** a single static page, no build step, served by the Express server.

**Flow:**
1. Dropdown listing all 6 demo scenarios (Story 4), grouped by domain, clearly labeled (e.g. "Intent → Billing: duplicate charge, verified")
2. "Run Governor" button → calls `POST /api/gate`
3. Loading state (~1–3s, real Bedrock call in flight)
4. Result panel: color-coded badge (green = Auto-Execute, amber = Staged/Canary, red = Human Review), numeric score, one-sentence rationale
5. A small strip showing the two inputs that drove the decision (claim basis + reversibility), so a viewer can see what fed the score

**Stretch goal (only if time allows):** a "run all 6" view listing every scenario's result in one table — strong closing shot for the video, visually proves one engine handling both domains.

**Not in scope:** any framework/build tooling — plain HTML/CSS/vanilla JS is enough and keeps this to one deployable process.
