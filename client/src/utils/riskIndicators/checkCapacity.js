import { createIndicator, SEVERITY, CATEGORY } from "./createIndicator";

/**
 * Evaluates supplier capacity to identify capacity-related risks.
 * A high capacity ratio indicates that a significant proportion of the supplier's capacity is utilised by this organisation, which may create supply continuity risks.
 *
 */
export const checkCapacity = (supplier) => {
  if (supplier.capacity >= 0.75) {
    return createIndicator(
      supplier._id,
      supplier.name,
      SEVERITY.CRITICAL,
      CATEGORY.CAPACITY,
      `${supplier.name} utilises ${Math.round(supplier.capacity * 100)}% of its capacity from this organisation. High utilisation presents supply fragility risk.`
    );
  }

  if (supplier.capacity >= 0.5) {
    return createIndicator(
      supplier._id,
      supplier.name,
      SEVERITY.WARNING,
      CATEGORY.CAPACITY,
      `${supplier.name} utilises ${Math.round(supplier.capacity * 100)}% of its capacity from this organisation. Monitor for over-utilisation.`
    );
  }

  return null;
};