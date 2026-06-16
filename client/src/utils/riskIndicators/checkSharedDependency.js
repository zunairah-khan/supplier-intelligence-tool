import { createIndicator, SEVERITY, CATEGORY } from "./createIndicator";
// --- SHARED SUB-TIER DEPENDENCY (false double sourcing) ---
// Detects suppliers with more than one parent — indicating a shared
// dependency that may undermine perceived supply chain diversification
export const checkSharedDependency = (suppliers) => {
  const indicators = [];

  suppliers.forEach(supplier => {
    if (supplier.parentSuppliers && supplier.parentSuppliers.length > 1) {
      const parentNames = supplier.parentSuppliers
        .map(p => suppliers.find(s => s._id === p._id)?.name)
        .filter(Boolean)
        .join(" and ");

      indicators.push(createIndicator(
        supplier._id,
        supplier.name,
        SEVERITY.CRITICAL,
        CATEGORY.STRUCTURAL,
        `${supplier.name} is a shared sub-tier dependency of ${parentNames} — monitor for potential supply chain fragility and false double sourcing.`
      ));
    }
  });

  return indicators;
};