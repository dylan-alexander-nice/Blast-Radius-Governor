# Story 1 — Scoring Engine

**Goal:** a function that takes a handoff description and returns a risk score + rationale via Amazon Nova 2 Lite on Bedrock.

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
- 40–74 → Staged/Canary
- 75–100 → Human Review

**Demo reliability:** set `temperature` low. Rehearse all 6 scenarios (Story 4) ahead of recording — know the output before you're on camera.

**No separate validation phase.** This is a prototype — build the call, run it against a scenario or two as you go, adjust the prompt if output looks off. If Nova 2 Lite's reasoning quality turns out to be a real limitation, that's a legitimate finding for the deck, not a blocker to resolve first.

**Verify before starting:** Nova's exact tool-use/system-prompt support in Bedrock's Converse API docs. The call shape is meant to be provider-agnostic, but don't assume full parity with Anthropic models without checking.
