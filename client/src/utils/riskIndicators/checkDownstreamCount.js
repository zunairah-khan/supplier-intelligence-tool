import { createIndicator, SEVERITY, CATEGORY } from "./createIndicator";
import { calculateSupplierStats } from "../calculateSupplierStats";

/**
 * Evaluates structural dependency risks within the supplier network by
 * analysing downstream supplier relationships and critical supply routes.
 *
 */
export const checkDownstreamCount = (supplier, supplierSubtree) => {
  const { totalDownstreamSuppliers, highCriticalityRoutes } =
    calculateSupplierStats(supplierSubtree);

  const indicators = [];

  // Check for high number of downstream suppliers
  if (totalDownstreamSuppliers > 5) {
    indicators.push(
      createIndicator(
        supplier._id,
        supplier.name,
        SEVERITY.WARNING,
        CATEGORY.STRUCTURAL,
        `${supplier.name} has ${totalDownstreamSuppliers} downstream dependencies — disruption would have wide network impact.`
      )
    );
  }

  // Check for multiple high criticality supply routes
  if (highCriticalityRoutes > 1) {
    indicators.push(
      createIndicator(
        supplier._id,
        supplier.name,
        SEVERITY.CRITICAL,
        CATEGORY.ROUTE,
        `${supplier.name} has ${highCriticalityRoutes} high criticality supply routes — concentration of critical dependencies detected.`
      )
    );
  }

  return indicators;
};