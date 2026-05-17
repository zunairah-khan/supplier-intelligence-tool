
import { buildSupplierHierarchy } from "../buildSupplierHierarchy";
import { checkTier1HighRisk } from "./checkTier1HighRisk";
import { checkCapacity } from "./checkCapacity";
import { checkContractExpiry } from "./checkContractExpiry";
import { checkDownstreamCount } from "./checkDownstreamCount";
import { checkRiskToleranceBreached } from "./checkRiskToleranceBreached";
import { checkRisksToImprove } from "./checkRisksToImprove";
import { SEVERITY } from "./createIndicator";
import { checkSharedDependency } from "./checkSharedDependency";
import { risks } from "../../assets/data";
import { getRisksForSupplier } from "../getRisksForSupplier";

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
  const supplierRisks = getRisksForSupplier(risks, supplier._id);

  const sharedDependencyIndicators = checkSharedDependency(suppliers).filter(
    (indicator) => indicator.supplierId === supplier._id
  );

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