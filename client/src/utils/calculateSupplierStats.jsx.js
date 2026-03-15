export const calculateSupplierStats = (node) => {
  const stats = {
    totalSuppliers: 0,
    highRiskSuppliers: 0,
    mediumRiskSuppliers: 0,
    lowRiskSuppliers: 0,
    highCriticalityRoutes: 0,
    tierDistribution: {}, // dynamic tier counts
  };

  const traverse = (current) => {
    if (!current) return;

    // Skip the root organisation node
    if (current.name !== "org") {
      stats.totalSuppliers++;

      // Risk counts
      const risk = current.RiskLevel?.toLowerCase();
      if (risk === "high") stats.highRiskSuppliers++;
      else if (risk === "medium") stats.mediumRiskSuppliers++;
      else if (risk === "low") stats.lowRiskSuppliers++;

      // Tier distribution
      const tier = current.tier;
      if (tier) {
        stats.tierDistribution[tier] =
          (stats.tierDistribution[tier] || 0) + 1;
      }
    }

    if (!current.children) return;

    current.children.forEach((child) => {

      // Route criticality
      const criticality = child?.routeCriticality;
      if (criticality?.toLowerCase() === "high") {
        stats.highCriticalityRoutes++;
      }

      traverse(child);
    });
  };

  traverse(node);

  return stats;
};