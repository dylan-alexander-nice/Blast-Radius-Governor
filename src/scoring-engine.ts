import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

type ClaimBasis =
  | "verified-fact"
  | "corroborated-signal"
  | "single-weak-signal"
  | "speculative-inference";

type ActionReversibility =
  | "easily-reversible"
  | "hard-to-reverse"
  | "irreversible";

interface ScoreResponse {
  score: number;
  rationale: string;
}

export type Decision = "Auto-Execute" | "Staged/Canary" | "Human Review";

export interface GovernedResponse extends ScoreResponse {
  decision: Decision;
}

function getDecisionForScore(score: number): Decision {
  if (score <= 39) return "Auto-Execute";
  if (score <= 64) return "Staged/Canary";
  return "Human Review";
}

export async function getGovernedDecision(
  sourceAgentClaim: string,
  claimBasis: ClaimBasis,
  downstreamAction: string,
  actionReversibility: ActionReversibility
): Promise<GovernedResponse> {
  const { score, rationale } = await getRiskScore(
    sourceAgentClaim,
    claimBasis,
    downstreamAction,
    actionReversibility
  );

  return {
    decision: getDecisionForScore(score),
    score,
    rationale,
  };
}

async function getRiskScore(
  sourceAgentClaim: string,
  claimBasis: ClaimBasis,
  downstreamAction: string,
  actionReversibility: ActionReversibility
): Promise<ScoreResponse> {
  const MAX_ATTEMPTS = 2;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await callBedrock(
        sourceAgentClaim,
        claimBasis,
        downstreamAction,
        actionReversibility
      );

      const parsed = parseAndValidateResponse(response);
      console.log(`Attempt ${attempt}: Success`);
      return parsed;
    } catch (error) {
      console.error(`Attempt ${attempt}: Failed.`, error);
    }
  }

  return {
    score: 100,
    rationale:
      "Automated scoring failed after retries — escalated to human review as a safety default.",
  };
}

async function callBedrock(
  sourceAgentClaim: string,
  claimBasis: ClaimBasis,
  downstreamAction: string,
  actionReversibility: ActionReversibility
): Promise<string> {
  const client = new BedrockRuntimeClient({});

  const combinedPrompt = `Given the claim, its basis, the downstream action, and its reversibility, judge how much risk there is in letting this handoff execute without a human checking it — specifically, how much of the action rests on unverified inference rather than confirmed fact. 
Return ONLY a valid JSON object with the keys "score" (0-100) and "rationale" (a one-sentence string).

Input:
- Claim: "${sourceAgentClaim}" (Basis: ${claimBasis})
- Action: "${downstreamAction}" (Reversibility: ${actionReversibility})

JSON Response:`;

  const command = new ConverseCommand({
    modelId: "mistral.mistral-7b-instruct-v0:2",
    messages: [{ role: "user", content: [{ text: combinedPrompt }] }],
    inferenceConfig: {
      temperature: 0.0,
    },
  });

  const response = await client.send(command);

  const content = response.output?.message?.content;
  if (content?.length && content[0].text) {
    return content[0].text;
  }

  throw new Error("Received an empty response from the model.");
}

function parseAndValidateResponse(response: string): ScoreResponse {
  let parsed: any;

  try {
    // First, try to parse the whole string as JSON
    parsed = JSON.parse(response.trim());
  } catch {
    // If that fails, fall back to regex to find a JSON object
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Failed to parse JSON from model response.");
    }
  }

  // Validate the shape of the parsed object
  const { score, rationale } = parsed;
  const isScoreValid =
    typeof score === "number" &&
    isFinite(score) &&
    score >= 0 &&
    score <= 100;
  const isRationaleValid =
    typeof rationale === "string" && rationale.length > 0;

  if (isScoreValid && isRationaleValid) {
    return { score, rationale };
  }

  throw new Error("Parsed JSON has an invalid shape.");
}
