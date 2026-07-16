# Slide Deck Talking Points

Presenter track for `NiceDeck.dc.html` (8 slides). Each slide already carries speaker notes inside the `.dc.html` file itself — this doc expands those into things you'd actually say out loud, and marks which Sparkathon judging criteria each slide is doing the work of, so you can adjust pacing on the fly if a judge's question pulls you toward one criterion over another.

**Target: ~3–4 minutes total**, leaving room for Q&A. Don't recite this verbatim — it's a scaffold, not a script.

---

### 1. Title
**Carries: pillar alignment (stated explicitly on-slide)**

> "Blast Radius Governor — a governance agent for multi-agent hand-offs. Submitting under System Stability & Customer Resolution. It's a working prototype, not a concept — built on Mistral 7B Instruct via Bedrock."

### 2. The gap
**Carries: Creativity & Innovation**

> "NiCE's own 2026 State of Agentic AI outlook lays out a four-stage maturity path ending in 'governance agents' — but that stage is named and never defined. The governance section that does exist only mentions static thresholds, no actual mechanism. That's the undefined stage this project builds."

### 3. The real risk
**Carries: Creativity & Innovation — this is the "why now" for an audience that knows nothing yet**

> "The danger was never the agent itself — both agents behave correctly in isolation. It's the hand-off: Agent A infers something, Agent B silently treats that inference as settled fact and acts on it. Nobody's checking how much of that premise was ever actually verified. That gap is invisible today."

### 4. The solution
**Carries: Creativity & Innovation, sets up Technical Grit**

> "One gate, two axes: how grounded is the claim — fact versus speculation — and how reversible is the action it triggers. Combine those and you get one of three routes: auto-execute, staged rollout, or human review. Critically, the model only produces the score — the routing decision is deterministic code, not another LLM guess."

### 5. Demo
**Carries: Technical Grit — this is the "not smoke and mirrors" slide**

> "This isn't mocked — every screenshot here is a real, captured run against live AWS Bedrock. Left: a single scored hand-off. Right: all six scenarios through the same gate. And this callout here" *(point to the fail-safe note)* "is the most important line on this slide: one of the six scenarios triggers a real model failure during scoring, live — and instead of guessing or defaulting to auto-execute, the system fails closed to human review. That's the actual engineering discipline a governance layer needs before anyone trusts it with real actions."

### 6. Genericity
**Carries: Creativity & Innovation, Technical Grit (the footnote reinforces the fail-safe point again)**

> "Same scoring engine, zero modifications, across two domains that have nothing to do with each other — an intent classifier feeding a billing agent, and a fraud signal feeding an account-action agent. Same three outcomes both times. Nothing in this engine knows what 'billing' or 'fraud' even means — that's the proof this generalizes."

### 7. Business value
**Carries: Business Impact, Feasibility & Roadmap Fit, Technical Grit — the three cards map directly to three of the four judging criteria**

> "Three things this actually gets you. One: it catches the mistake before it reaches a customer — every hard-to-reverse action taken on unverified inference is a support escalation, a wrongly frozen account, or a promise the business can't take back, and this scores that risk before it executes, not after. Two: it drops in without a rebuild — no changes to either agent, runs on one of the cheapest models on Bedrock, pilotable on a real hand-off in days. Three: it's proven, not promised — real Bedrock calls, defensive parsing, bounded retry, and a fail-closed default we already watched fire during this same demo."

### 8. Close
**Carries: Business Impact, Feasibility & Roadmap Fit — the recap**

> "A governance agent that gates every hand-off by how much of it rests on verified fact, proven across two unrelated domains with one unmodified engine — built solo, in a two-day sprint, with an AI coding agent. Every number and every screenshot in this deck is real."

---

## If a judge pushes on one criterion specifically

- **"How is this creative / different?"** → back to slide 3 — the insight is that the *hand-off* is the risk, not either agent, which is why point solutions per-agent miss it.
- **"Is this actually built, or just a deck?"** → slide 5's fail-safe callout — a mocked demo wouldn't have a real failure mode to show.
- **"Could this actually ship?"** → slide 7, card 2 — no agent changes, cheap model, days not quarters to pilot.
- **"Why should the business care?"** → slide 7, card 1 — frame it as: today, nothing is scoring this risk at all; every unverified hand-off into a hard-to-reverse action is a live, unmeasured liability.
