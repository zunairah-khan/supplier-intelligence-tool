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

const SEVERITY_WEIGHT = {
  [SEVERITY.CRITICAL]: 3,
  [SEVERITY.WARNING]: 2,
  [SEVERITY.INFO]: 1,
};

const sortIndicators = (indicators) =>
  [...indicators].sort(
    (a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]
  );

export const generateSupplierIndicators = (supplier, suppliers) => {
  // ✅ BUILD ONCE (or ideally pass in prebuilt hierarchy in future refactor)
  const hierarchy = buildSupplierHierarchy(suppliers);

  const supplierSubtree = findSubtree(hierarchy, supplier._id);
  const supplierRisks = getRisksForSupplier(risks, supplier._id);

  const sharedDependencyIndicators =
    checkSharedDependency(suppliers)
      .filter(indicator => indicator.supplierId === supplier._id);

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