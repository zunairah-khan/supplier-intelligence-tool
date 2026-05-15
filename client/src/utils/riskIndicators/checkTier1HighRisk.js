
import { createIndicator, SEVERITY, CATEGORY } from "./createIndicator";

// --- TIER 1 HIGH RISK ---
// Flags Tier 1 suppliers with a High RiskLevel as these sit directly with the client and carry the most immediate risk exposure
export const checkTier1HighRisk = (supplier) => {
  if (supplier.tier === 1 && supplier.RiskLevel === "High") {
    return createIndicator(
      supplier._id,
      supplier.name,
      SEVERITY.CRITICAL,
      CATEGORY.STRUCTURAL,
      `${supplier.name} is a Tier 1 supplier rated High Risk — immediate review recommended.`
    );
  }
  return null;
};