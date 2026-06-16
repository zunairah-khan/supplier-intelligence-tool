import { createIndicator, SEVERITY, CATEGORY } from "./createIndicator";

// --- SUPPLIER CAPACITY (revenue dependency) ---
// capacity represents the proportion of the supplier's total revenue
// derived from this client organisation. High values indicate dependency
// which can be leveraged in contract negotiations but also signals fragility.
export const checkCapacity = (supplier) => {
  if (supplier.capacity >= 0.75) {
    return createIndicator(
      supplier._id,
      supplier.name,
      SEVERITY.CRITICAL,
      CATEGORY.CAPACITY,
      `${supplier.name} derives ${Math.round(supplier.capacity * 100)}% of its revenue from this organisation. High dependency presents supply fragility risk.`
    );
  }
  if (supplier.capacity >= 0.5) {
    return createIndicator(
      supplier._id,
      supplier.name,
      SEVERITY.WARNING,
      CATEGORY.CAPACITY,
      `${supplier.name} derives ${Math.round(supplier.capacity * 100)}% of its revenue from this organisation. Monitor for over-dependency.`
    );
  }
  return null;
};