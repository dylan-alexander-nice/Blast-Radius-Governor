# Video Walkthrough Script

**Target: ~2 minutes.** Recorded on Windows with Xbox Game Bar (`Win+Alt+R`), no other install needed. Narrate conversationally from these beats — don't read verbatim. Scores/rationales below are a real, current rehearsal run (not invented) — if you re-rehearse before recording and a number shifts slightly, that's normal LLM variance; the routing decisions should stay the same except Scenario 5, which is expected to be inconsistent (see below).

Every beat below is tagged with which Sparkathon judging criteria it's carrying, so the full 2 minutes covers all four without ever saying so out loud.

---

## 0:00–0:15 — Hook
**Carries: Creativity & Innovation, pillar alignment**

> "NiCE's own 2026 State of Agentic AI outlook says the next stage of enterprise CX is 'governance agents' — but it never says what one actually does. This is a working answer. It's built for the System Stability & Customer Resolution pillar: catching a bad multi-agent handoff before it becomes a customer problem."

## 0:15–0:35 — The model, in one breath
**Carries: Creativity & Innovation, Technical Grit (sets up the demo)**

> "Every hand-off between two AI agents gets scored on two things: how verified is the claim being passed — fact or guess — and how reversible is the action about to happen. One score, three routes: auto-execute, staged rollout, or human review. The model scores it; plain code decides the route — never the model."

## 0:35–1:35 — Live demo, both domains
**Carries: Technical Grit (real, not mocked), Creativity (genericity across domains)**

Run these four scenarios live, in order — they hit both domains and all three outcomes:

| Say this | Scenario | Live result |
|---|---|---|
| "Duplicate charge, confirmed against the transaction log — verified fact, easily reversible." | 1 (billing) | **Auto-Execute**, score 0 |
| "Complaint pattern suggests high churn risk — that's speculation, and the action is a contract change. Hard to undo." | 3 (billing) | **Human Review**, score 70 |
| "Same engine, completely different domain — fraud. Device mismatch plus an exact match to a known pattern." | 4 (fraud) | **Auto-Execute**, score 20 |
| "And here — unusual login, no corroborating signal at all." | 5 (fraud) | **Human Review**, score 100 |

For Scenario 5 specifically, say this out loud if it happens live (it's a known, documented model-reliability limit, not a bug):

> "And here's the model itself failing to return valid output — watch what the system does: it doesn't guess, it doesn't auto-execute. It fails closed, straight to human review. That's the fail-safe design working exactly as intended."

If Scenario 5 doesn't fail during this particular take, skip that line and just note its score/route normally — don't force the failure.

## 1:35–2:00 — Close
**Carries: Feasibility & Roadmap Fit, Business Impact**

> "Same unmodified scoring engine, two completely unrelated domains — billing and fraud — proving this isn't wired to one pipeline. It runs on one of the cheapest models available on Bedrock, needs no changes to either agent, and a team could pilot it on one real handoff in days. Every screenshot and every score in this project, including this recording, is real — nothing here is a mockup."

---

## Recording checklist
- [ ] Server running (`npm start`, built) or dev mode (`npm run dev`) — either is fine, built is closer to "real"
- [ ] Wait 2–3 seconds after startup before the first click (known cold-start warm-up)
- [ ] Xbox Game Bar mic indicator is on before you start talking
- [ ] Trim in Windows Photos app if you fumble a line — no other tool needed
- [ ] Covers at least one scenario per domain and per outcome — the four above satisfy that minimum; all six is stronger if you have time
