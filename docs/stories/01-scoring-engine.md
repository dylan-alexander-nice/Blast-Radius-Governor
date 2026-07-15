# Story 1 — Scoring Engine

**Goal:** a function that takes a handoff description and returns a risk score + rationale via Mistral 7B Instruct on Bedrock.

**Inputs:**
- `sourceAgentClaim: string` — what the upstream agent is asserting (e.g. "duplicate charge detected")
- `claimBasis: "verified-fact" | "corroborated-signal" | "single-weak-signal" | "speculative-inference"` — how grounded that claim is
- `downstreamAction: string` — what the receiving agent is about to do (e.g. "issue $22 refund")
- `actionReversibility: "easily-reversible" | "hard-to-reverse" | "irreversible"`

**Call shape:** `@aws-sdk/client-bedrock-runtime` → `BedrockRuntimeClient` + `ConverseCommand`, model `mistral.mistral-7b-instruct-v0:2`, `toolConfig` forcing a tool call that returns exactly:
```json
{ "score": 0-100, "rationale": "one sentence" }
```
Don't ask the model for a decision/tier — only a score and why. Routing is decided downstream, in plain code, from the score.

**System prompt intent:** given the claim, its basis, the downstream action, and its reversibility, judge how much risk there is in letting this handoff execute without a human checking it — specifically, how much of the action rests on unverified inference rather than confirmed fact.

**Routing thresholds (starting point — tune against Story 4's scenarios):**
- 0–39 → Auto-Execute
- 40–64 → Staged/Canary
- 65–100 → Human Review

*Note: The Human Review threshold was lowered from 75 to 65 to correctly capture Scenario 3, which was consistently scoring at 70.*

**Demo reliability:** set `temperature` low. Rehearse all 6 scenarios (Story 4) ahead of recording — know the output before you're on camera.

**No separate validation phase.** This is a prototype — build the call, run it against a scenario or two as you go, adjust the prompt if output looks off. If Mistral 7B Instruct's reasoning quality turns out to be a real limitation, that's a legitimate finding for the deck, not a blocker to resolve first.

**Confirmed approach — prompted JSON, not forced tool-calls.** Mistral 7B Instruct v0.2 doesn't support tool use on Bedrock's Converse API, so structured output comes from prompting for JSON and parsing the response, not `toolConfig`. That's accepted for this prototype — but plain prompted JSON from a small model is failure-prone, so the parsing path needs to be hardened rather than left as a single regex-match-then-`JSON.parse` with no fallback. Concretely:

1. **Parse defensively, in two steps.** Try `JSON.parse` on the trimmed raw response first; if that throws, fall back to extracting the outermost `{...}` block via regex and parsing that. Either path failing counts as a parse failure.
2. **Validate the shape before trusting it.** A syntactically valid JSON blob isn't necessarily the right shape — check `score` is a finite number between 0 and 100, and `rationale` is a non-empty string, before returning it. Anything else is treated as a failure.
3. **Retry once on any failure** (parse, validation, or API error) — 2 attempts total. Small instruct models occasionally produce a malformed response; a second roll often succeeds.
4. **Fail closed, not open, once retries are exhausted.** This is the important one: a governance gate that silently crashes or defaults to auto-execute on a scoring failure defeats the entire premise of the project. If both attempts fail, return `{ score: 100, rationale: "Automated scoring failed after retries — escalated to human review as a safety default." }` so the caller always gets a Human Review decision instead of an unhandled exception. This is standard fail-safe design for any risk-gating system — deny/escalate on uncertainty, never permit by default — and it's a good line in the pitch, not just a bug fix.
5. **Log every attempt**, success and failure, with enough detail to reconstruct what happened. This doubles as the audit trail NiCE's own governance framing names as a core capability the demo should visibly cover.

**Rehearsal script:** `src/test-story-1.ts` currently runs one hardcoded scenario. Expand it to loop over all 6 of Story 4's scenarios, print each decision/score/rationale, and flag whether each landed in its expected band — this is what actually operationalizes "rehearse all 6 scenarios before recording," which until now was written into the docs but not implemented anywhere.
