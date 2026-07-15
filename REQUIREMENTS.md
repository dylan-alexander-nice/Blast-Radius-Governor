# Blast Radius Governor — Requirements

## What & Why

NiCE's own 2026 State of Agentic AI outlook names a coming shift: multi-agent pipelines where "conversational AI → reasoning agents → orchestration agents → **governance agents**" collaborate — but that Governance Agent role isn't defined anywhere in their materials, and their own governance section only describes static policy thresholds, not a way to judge risk at the moment one agent's inference becomes another agent's accepted fact. This prototype *is* that Governance Agent: it scores every inter-agent handoff for how much of the downstream action rests on verified fact versus inferred judgment, and routes accordingly.

## Goals

- Prove one scoring engine can govern handoffs between *any* two agents, not just one fixed pipeline
- Ground the pitch directly in NiCE's own named-but-unbuilt "Governance Agent" role
- Ship a working, demoable prototype by the deadline — not a slide-only concept

## Requirements

- Score every handoff on two axes: **claim basis** (`verified-fact` / `corroborated-signal` / `single-weak-signal` / `speculative-inference`) and **action reversibility** (`easily-reversible` / `hard-to-reverse` / `irreversible`)
- Route to one of three outcomes: **Auto-Execute**, **Staged/Canary**, **Human Review**
- LLM scoring via **Amazon Nova 2 Lite** on Bedrock (`amazon.nova-2-lite-v1:0`), forced structured output `{ score, rationale }` — routing decided in code from the score, never by the model
- Demo across 2 domain pairs to prove genericity: **Intent-Classifier → Billing Agent**, and **Fraud-Signal → Account-Action Agent** (6 scenarios total, 3 per domain, one per outcome)
- Simple web UI: pick a scenario, see the live decision + score + rationale
- Deliverables: video walkthrough + slide deck (no live pitch)

## Out of Scope

- Real integration with any production system — this gates a *simulated* handoff, it doesn't execute anything downstream
- A real staged/canary rollout mechanism — it's a distinct UI state for the demo, not real infrastructure
- Auth, persistence, arbitrary free-text handoffs from an external caller — runs over the 6 fixed demo scenarios only
- A Nova 2 Lite "validation phase" — this is a prototype. If its output quality is rough, that's a real, reportable finding, not a blocker to resolve before building

## Acceptance Criteria

- [ ] All 6 scenarios return a decision within ~3 seconds
- [ ] All 6 have been rehearsed — output known before recording
- [ ] UI shows decision + score + rationale for every run, no crashes
- [ ] Video walkthrough covers at least one scenario per domain and per outcome
- [ ] Slide deck covers: the Governance Agent framing, the two-axis scoring model, demo highlights, business value
- [ ] Submission form updated with the video link and deck attached — lives at `ideas/sparkathon_submissions/blast-radius-governor.md` in the `topic_ai-llm-wiki` repo, not in this repo

## Story Map

Implementation details for each chunk live in `docs/stories/`. Suggested order: 1 → 2 → 3; Story 4 (scenario content) can be authored in parallel with 1–3 since it's content, not code.

| # | Story | Covers |
|---|---|---|
| 1 | [Scoring Engine](docs/stories/01-scoring-engine.md) | Bedrock/Nova 2 Lite call, prompt, structured output, threshold routing |
| 2 | [API Server](docs/stories/02-api-server.md) | Express server, `/api/gate` endpoint, request/response contract |
| 3 | [Web UI](docs/stories/03-web-ui.md) | Scenario picker, result panel, "run all" stretch view |
| 4 | [Demo Scenarios](docs/stories/04-demo-scenarios.md) | The 6 scenario definitions + rehearsal/recording notes |

## Open Questions

- Exact AWS region — use whatever your existing AWS CLI/SDK default profile already points at; not specified beyond that
- Credential-loading convention, server port/env convention, badge color values — left to the builder's judgment
- Final routing thresholds — tune once you see real scores against the 6 scenarios in Story 4
- Express vs. Hono — either is fine, default to Express
