# Story 4 — Demo Scenarios

**Can be authored in parallel with Stories 1–3** — this is content, not code.

Six scenarios across two domains, one per routing outcome per domain, proving the same engine handles both.

## Domain A: Intent-Classifier → Billing Agent

| # | Source agent claim | Claim basis | Downstream action | Reversibility | Expected route |
|---|---|---|---|---|---|
| 1 | "Duplicate charge — confirmed against transaction log" | Verified-fact | Issue $22 refund for the duplicate charge | Easily-reversible | Auto-Execute |
| 2 | "Customer tone suggests frustration with a recurring billing issue" | Single-weak-signal | Apply a modest goodwill credit | Easily-reversible | Staged/Canary |
| 3 | "Complaint pattern suggests high churn risk" | Speculative-inference | Apply a large retention credit + change contract terms | Hard-to-reverse | Human Review |

## Domain B: Fraud-Signal → Account-Action Agent

| # | Source agent claim | Claim basis | Downstream action | Reversibility | Expected route |
|---|---|---|---|---|---|
| 4 | "Device mismatch + exact match to a known fraud pattern" | Verified-fact | Hold the single flagged transaction | Easily-reversible | Auto-Execute |
| 5 | "Unusual login location, no other corroborating signal" | Single-weak-signal | Apply a temporary account restriction | Hard-to-reverse | Staged/Canary |
| 6 | "Behavior loosely resembles a fraud pattern from an unrelated case" | Speculative-inference | Freeze the account entirely | Irreversible | Human Review |

**Rehearsal:** run all 6 through the real Bedrock call before recording anything. Know each one's actual score and rationale in advance — this is the agreed mitigation for LLM non-determinism breaking a recorded demo. If a result doesn't land in its expected band, adjust the prompt or the threshold bands in Story 1 — don't change the scenario to fit. The scenarios are the point.

**Recording:** cover at least one example per domain and per outcome (minimum 4 of the 6, ideally all 6) in the video walkthrough.
