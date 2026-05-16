
import { buildSupplierHierarchy } from "../buildSupplierHierarchy";
import { checkTier1HighRisk } from "./checkTier1HighRisk";
import { checkCapacity } from "./checkCapacity";
import { checkContractExpiry } from "./checkContractExpiry";
import { checkDownstreamCount } from "./checkDownstreamCount";
import { checkRiskToleranceBreached } from "./checkRiskToleranceBreached";
import { checkRisksToImprove } from "./checkRisksToImprove";
import { SEVERITY } from "./createIndicator";
import { checkSharedDependency } from "./checkSharedDependency";

// Severity weights for sorting — critical indicators always surface first
const SEVERITY_WEIGHT = {
  [SEVERITY.CRITICAL]: 3,
  [SEVERITY.WARNING]: 2,
  [SEVERITY.INFO]: 1,
};

const sortIndicators = (indicators) =>
  [...indicators].sort(
    (a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]
  );

// Generates all risk indicators for a single supplier.
// Used by the supplier details page indicator panel.
// Includes hierarchy-based rules (downstream count, criticality routes)
// and supplier-level risk rules (tolerance breached, low control confidence).
export const generateSupplierIndicators = (supplier, suppliers) => {
  const supplierSubtree = buildSupplierHierarchy(suppliers, supplier._id);

  // checkSharedDependency needs the full array to detect shared dependencies,
  // but we filter results to only surface indicators for the current supplier
  const sharedDependencyIndicators = checkSharedDependency(suppliers).filter(
    (indicator) => indicator.supplierId === supplier._id
  );

  const indicators = [
    checkTier1HighRisk(supplier),
    checkCapacity(supplier),
    checkContractExpiry(supplier),
    ...checkDownstreamCount(supplier, supplierSubtree),
    ...checkRiskToleranceBreached(supplier),
    ...checkRisksToImprove(supplier),
    ...sharedDependencyIndicators,
  ].filter(Boolean);

  return sortIndicators(indicators);
};