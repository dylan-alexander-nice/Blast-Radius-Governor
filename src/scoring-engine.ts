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
  if (score <= 74) return "Staged/Canary";
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
    }
  });

  try {
    const response = await client.send(command);
    
    if (response.output?.message?.content.length) {
        const textResponse = response.output.message.content[0].text;
        if (textResponse) {
            // Extract JSON from the response, which might be wrapped in markdown
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
    }

    throw new Error("Failed to get a valid JSON response from the model.");

  } catch (error) {
    console.error("Error calling Bedrock or parsing response:", error);
    throw error;
  }
}
