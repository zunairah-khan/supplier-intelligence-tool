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

const sortIndicators = (indicators) =>
  [...indicators].sort(
    (a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]
  );

export const generatePortfolioIndicators = (suppliers) => {
  // ✅ BUILD ONCE (fixes O(n²))
  const hierarchy = buildSupplierHierarchy(suppliers);

  const sharedDependencyIndicators =
    checkSharedDependency(suppliers);

  const supplierLevelIndicators = suppliers.flatMap((supplier) => {
    // ✅ REUSE TREE INSTEAD OF REBUILDING
    const supplierSubtree = findSubtree(hierarchy, supplier._id);

    const supplierRisks = getRisksForSupplier(risks, supplier._id);

    return [
      checkTier1HighRisk(supplier),
      checkCapacity(supplier),
      checkContractExpiry(supplier),
      ...checkDownstreamCount(supplier, supplierSubtree),
      ...checkRiskToleranceBreached(supplier, supplierRisks),
      ...checkRisksToImprove(supplier, supplierRisks),
    ].filter(Boolean);
  });

  return sortIndicators([
    ...sharedDependencyIndicators,
    ...supplierLevelIndicators,
  ]);
};