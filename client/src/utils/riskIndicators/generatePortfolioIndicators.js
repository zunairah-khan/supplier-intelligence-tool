import { buildSupplierHierarchy } from "../buildSupplierHierarchy";
import { checkTier1HighRisk } from "./checkTier1HighRisk";
import { checkCapacity } from "./checkCapacity";
import { checkContractExpiry } from "./checkContractExpiry";
import { checkDownstreamCount } from "./checkDownstreamCount";
import { checkSharedDependency } from "./checkSharedDependency";
import { checkRiskToleranceBreached } from "./checkRiskToleranceBreached";
import { checkRisksToImprove } from "./checkRisksToImprove";
import { SEVERITY } from "./createIndicator";

const SEVERITY_WEIGHT = {
  [SEVERITY.CRITICAL]: 3,
  [SEVERITY.WARNING]: 2,
  [SEVERITY.INFO]: 1,
};

const sortIndicators = (indicators) =>
  [...indicators].sort(
    (a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]
  );

// Generates risk indicators across all suppliers in the portfolio.
// Used by the executive dashboard and tier map indicator panels.
// Runs all applicable rules per supplier and includes portfolio-wide
// structural rules such as shared sub-tier dependency detection.
// Note: calls buildSupplierHierarchy once per supplier for subtree-based
// rules — O(n²) complexity. Acceptable for PoC scale; a production
// implementation would precompute subtree stats in a single O(n) traversal.
export const generatePortfolioIndicators = (suppliers) => {
  // Portfolio-wide structural rules that require the full suppliers array
  const sharedDependencyIndicators = checkSharedDependency(suppliers);

  // Per-supplier rules
  const supplierLevelIndicators = suppliers.flatMap((supplier) => {
    const supplierSubtree = buildSupplierHierarchy(suppliers, supplier._id);

    return [
      checkTier1HighRisk(supplier),
      checkCapacity(supplier),
      checkContractExpiry(supplier),
      ...checkDownstreamCount(supplier, supplierSubtree),
      ...checkRiskToleranceBreached(supplier),
      ...checkRisksToImprove(supplier),
    ].filter(Boolean);
  });

  return sortIndicators([
    ...sharedDependencyIndicators,
    ...supplierLevelIndicators,
  ]);
};