import { buildSupplierHierarchy } from "../buildSupplierHierarchy"; 
import { findSubtree } from "./findSubtree"; 
import { checkTier1HighRisk } from "./checkTier1HighRisk"; 
import { checkCapacity } from "./checkCapacity"; 
import { checkContractExpiry } from "./checkContractExpiry"; 
import { checkDownstreamCount } from "./checkDownstreamCount"; 
import { checkSharedDependency } from "./checkSharedDependency"; 
import { checkRiskToleranceBreached } from "./checkRiskToleranceBreached"; 
import { checkRisksToImprove } from "./checkRisksToImprove"; 
import { SEVERITY } from "./createIndicator"; 
import { risks } from "../../assets/data"; 
import { getRisksForSupplier } from "../getRisksForSupplier";

const SEVERITY_WEIGHT = {
  [SEVERITY.CRITICAL]: 3,
  [SEVERITY.WARNING]: 2,
  [SEVERITY.INFO]: 1,
};

// Orders indicators by severity so the most critical issues are surfaced first.
const sortIndicators = (indicators) =>
  [...indicators].sort(
    (a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]
  );

 /**
 * Generates all risk indicators for the entire supplier portfolio.
 * Used by the supplier tier map page indicator panel.
 *
 */
export const generatePortfolioIndicators = (suppliers) => {
  // Construct the supplier hierarchy once for reuse across all hierarchy-based rules.
  const hierarchy = buildSupplierHierarchy(suppliers);

  // Evaluate rules that require visibility of the complete supplier network.
  const sharedDependencyIndicators =
    checkSharedDependency(suppliers);

  // Evaluate supplier-specific rules for every supplier in the portfolio.
  const supplierLevelIndicators = suppliers.flatMap((supplier) => {

    // Retrieve the supplier's hierarchy and associated risks for rule evaluation.
    const supplierSubtree = findSubtree(hierarchy, supplier._id);
    const supplierRisks = getRisksForSupplier(risks, supplier._id);

    // Execute all applicable rule functions for the current supplier.
    return [
      checkTier1HighRisk(supplier),
      checkCapacity(supplier),
      checkContractExpiry(supplier),
      ...checkDownstreamCount(supplier, supplierSubtree),
      ...checkRiskToleranceBreached(supplier, supplierRisks),
      ...checkRisksToImprove(supplier, supplierRisks),
    ].filter(Boolean);
  });

  // Combine all generated indicators and return them ordered by severity.
  return sortIndicators([
    ...sharedDependencyIndicators,
    ...supplierLevelIndicators,
  ]);
};