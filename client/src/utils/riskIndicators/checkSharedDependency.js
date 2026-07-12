import { createIndicator, SEVERITY, CATEGORY } from "./createIndicator";

// Detects suppliers with more than one parent — indicating a shared dependency 
export const checkSharedDependency = (suppliers) => {
  const indicators = [];
// for each supplier, check if it has more than one parent supplier
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