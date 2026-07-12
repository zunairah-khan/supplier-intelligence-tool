import { buildSupplierHierarchy } from "../buildSupplierHierarchy";
import { findSubtree } from "./findSubtree";
import { checkTier1HighRisk } from "./checkTier1HighRisk";
import { checkCapacity } from "./checkCapacity";
import { checkContractExpiry } from "./checkContractExpiry";
import { checkDownstreamCount } from "./checkDownstreamCount";
import { checkRiskToleranceBreached } from "./checkRiskToleranceBreached";
import { checkRisksToImprove } from "./checkRisksToImprove";
import { checkSharedDependency } from "./checkSharedDependency";
import { SEVERITY } from "./createIndicator";
import { risks } from "../../assets/data";
import { getRisksForSupplier } from "../getRisksForSupplier";

// Severity weights for sorting. Critical indicators always surface first
const SEVERITY_WEIGHT = {
  [SEVERITY.CRITICAL]: 3,
  [SEVERITY.WARNING]: 2,
  [SEVERITY.INFO]: 1,
};

// Spread before sort to avoid mutating the original array
const sortIndicators = (indicators) =>
  [...indicators].sort(
    (a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]
  );

/**
 * Generates all risk indicators for a single supplier.
 * Used by the supplier details page indicator panel.
 *
 * Hierarchy is built once and traversed via findSubtree — O(n + e) build,
 * O(n) traversal — avoiding the O(n²) cost of rebuilding per supplier.
 *
 */
export const generateSupplierIndicators = (supplier, suppliers) => {
  const hierarchy = buildSupplierHierarchy(suppliers);
  const supplierSubtree = findSubtree(hierarchy, supplier._id);
  const supplierRisks = getRisksForSupplier(risks, supplier._id);

  // checkSharedDependency runs across all suppliers — filter to current supplier only
  const sharedDependencyIndicators = checkSharedDependency(suppliers)
    .filter(indicator => indicator.supplierId === supplier._id);

  // filter(Boolean) removes null returns from rules whose conditions were not met
  const indicators = [
    checkTier1HighRisk(supplier),
    checkCapacity(supplier),
    checkContractExpiry(supplier),
    ...checkDownstreamCount(supplier, supplierSubtree),
    ...checkRiskToleranceBreached(supplier, supplierRisks),
    ...checkRisksToImprove(supplier, supplierRisks),
    ...sharedDependencyIndicators,
  ].filter(Boolean);

  return sortIndicators(indicators);
};