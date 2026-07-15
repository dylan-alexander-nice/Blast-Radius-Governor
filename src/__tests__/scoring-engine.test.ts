import { getGovernedDecision } from "./scoring-engine";

async function runTest() {
  console.log("Running Story 1 validation test...");

  try {
    const result = await getGovernedDecision(
      "Duplicate charge — confirmed against transaction log",
      "verified-fact",
      "Issue $22 refund for the duplicate charge",
      "easily-reversible"
    );

    console.log("\n--- Test Scenario Result ---");
    console.log(`Decision:  ${result.decision}`);
    console.log(`Score:     ${result.score}`);
    console.log(`Rationale: ${result.rationale}`);
    console.log("--------------------------\n");

    if (result.decision === "Auto-Execute") {
      console.log("✅ Test PASSED: Decision was 'Auto-Execute' as expected.");
    } else {
      console.error(`❌ Test FAILED: Expected 'Auto-Execute', but got '${result.decision}'.`);
    }

  } catch (error) {
    console.error("❌ Test FAILED with error:", error);
  }
}

runTest();
