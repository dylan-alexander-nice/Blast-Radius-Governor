import express from "express";
import path from "path";
import { getGovernedDecision } from "./scoring-engine";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// __dirname-relative, not cwd-relative — works whether launched via `tsx src/api-server.ts`
// (__dirname = .../src) or the built `node dist/api-server.js` (__dirname = .../dist),
// since "public" sits one level up from both, at the repo root.
const staticDir = path.join(__dirname, "..", "public");

app.use(express.static(staticDir));

app.post("/api/gate", async (req, res) => {
  console.log("Received request at /api/gate");
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
