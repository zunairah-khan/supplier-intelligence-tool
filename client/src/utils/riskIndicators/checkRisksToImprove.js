import { createIndicator, SEVERITY, CATEGORY } from "./createIndicator";
// --- INDIVIDUAL RISK RULE ---
// This operates on each risk object within a supplier's risks array
// Flags risks with a high risk rating AND low control confidence
// These are the risks most in need of active management
export const checkRisksToImprove = (supplier, risks) => {
  if (!risks) return [];

  const HIGH_RATING_THRESHOLD = 15;
  const LOW_CONTROL_THRESHOLD = 3;

  return risks
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