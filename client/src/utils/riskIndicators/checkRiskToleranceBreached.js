import { createIndicator, SEVERITY, CATEGORY } from "./createIndicator";

//This operates on each risk object within a supplier's risks array
//Identifies supplier risks where the calculated risk exposure exceeds the defined tolerance threshold.

export const checkRiskToleranceBreached = (supplier, risks) => {
  if (!risks) return [];

  return risks
    .filter((risk) => (risk.impact * risk.likelihood) > risk.riskTolerance)
    .map((risk) =>
      createIndicator(
        supplier._id,
        supplier.name,
        SEVERITY.CRITICAL,
        CATEGORY.RISK,
        `"${risk.riskName}": risk rating of ${risk.impact * risk.likelihood} exceeds tolerance threshold of ${risk.riskTolerance}.`
      )
    );
};