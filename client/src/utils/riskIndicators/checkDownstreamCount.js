// --- DOWNSTREAM DEPENDENCY COUNT ---
// Uses calculateSupplierStats to get downstream count for a supplier subtree.
// Requires the full suppliers array and buildSupplierHierarchy to build the subtree.
export const checkDownstreamCount = (supplier, supplierSubtree) => {
  const { totalDownstreamSuppliers, highCriticalityRoutes } = calculateSupplierStats(supplierSubtree);

  const indicators = [];

  if (totalDownstreamSuppliers > 5) {
    indicators.push(createIndicator(
      supplier._id,
      supplier.name,
      SEVERITY.WARNING,
      CATEGORY.STRUCTURAL,
      `${supplier.name} has ${totalDownstreamSuppliers} downstream dependencies — disruption would have wide network impact.`
    ));
  }

   // --- HIGH CRITICALITY ROUTES ---
  // Flags when more than one high criticality route feeds into this supplier
  if (highCriticalityRoutes > 1) {
    indicators.push(createIndicator(
      supplier._id,
      supplier.name,
      SEVERITY.CRITICAL,
      CATEGORY.ROUTE,
      `${supplier.name} has ${highCriticalityRoutes} high criticality supply routes — concentration of critical dependencies detected.`
    ));
  }

  return indicators;
};