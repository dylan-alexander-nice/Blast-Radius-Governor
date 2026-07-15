import express from "express";
import { getGovernedDecision } from "./scoring-engine";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/api/gate", async (req, res) => {
  const {
    sourceAgentClaim,
    claimBasis,
    downstreamAction,
    actionReversibility,
  } = req.body;

  if (
    !sourceAgentClaim ||
    !claimBasis ||
    !downstreamAction ||
    !actionReversibility
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const result = await getGovernedDecision(
      sourceAgentClaim,
      claimBasis,
      downstreamAction,
      actionReversibility
    );
    res.json(result);
  } catch (error) {
    console.error("Error in /api/gate:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Blast Radius Governor API server listening on port ${port}`);
});
