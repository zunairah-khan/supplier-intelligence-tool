import { createIndicator, SEVERITY, CATEGORY } from "./createIndicator";
// --- INDIVIDUAL RISK RULE ---
// This operates on each risk object within a supplier's risks array
// Flags risks with a high risk rating AND low control confidence
// These are the risks most in need of active management
export const checkRisksToImprove = (supplier) => {
  if (!supplier.risks) return [];

  const HIGH_RATING_THRESHOLD = 15; // impact * likelihood >= 15 out of 25
  const LOW_CONTROL_THRESHOLD = 3;  // controlConfidence <= 3 out of 5

  return supplier.risks
    .filter(risk =>
      (risk.impact * risk.likelihood) >= HIGH_RATING_THRESHOLD &&
      risk.controlConfidence <= LOW_CONTROL_THRESHOLD
    )
    .map(risk =>
      createIndicator(
        supplier._id,
        supplier.name,
        SEVERITY.CRITICAL,
        CATEGORY.RISK,
        `"${risk.riskName}": high risk rating (${risk.impact * risk.likelihood}/25) with low control confidence (${risk.controlConfidence}/5) — immediate attention required.`
      )
    );
};