# Blast Radius Governor

A prototype Governance Agent for multi-agent AI pipelines. NiCE's own 2026 State of Agentic AI outlook names a coming shift to orchestrated, multi-agent CX operations — *"conversational AI → reasoning agents → orchestration agents → **governance agents**"* — but never defines what that governance agent actually does. This project is a first answer: at every handoff between two agents, it scores how much of the downstream action rests on verified fact versus inferred judgment, and routes it to auto-execute, a staged/canary trial, or a human reviewer.

Demoed across two different agent-handoff pairs — an intent-classifier handing off to a billing agent, and a fraud-signal agent handing off to an account-action agent — with the same scoring engine, to prove it's a general governance layer, not a point solution wired to one pipeline.

Built solo with an AI coding agent, for NiCE's internal Sparkathon hackathon. Deliverables are a video walkthrough and a slide deck — no live pitch.

## Start here

Read **`REQUIREMENTS.md`** — it's short by design: goals, requirements, acceptance criteria, and a map to the 4 implementation stories in `docs/stories/`. Skim it in under 2 minutes before opening any story file.

## Deadline

Submission due 5pm on the day after this spec was written. See `REQUIREMENTS.md`'s acceptance criteria for what "done" means.
