import { createIndicator, SEVERITY, CATEGORY } from "./createIndicator";
// --- INDIVIDUAL RISK RULE ---
// This operates on each risk object within a supplier's risks array
// Flags risks where the calculated risk rating (impact * likelihood)
// exceeds the defined risk tolerance for that risk
export const checkRiskToleranceBreached = (supplier, risks) => {
  if (!risks) return [];

  return risks
    .filter(risk => (risk.impact * risk.likelihood) > risk.riskTolerance)
    .map(risk =>
      createIndicator(
        supplier._id,
        supplier.name,
        SEVERITY.CRITICAL,
        CATEGORY.RISK,
        `"${risk.riskName}": risk rating of ${risk.impact * risk.likelihood} exceeds tolerance threshold of ${risk.riskTolerance}.`
      )
    );
};