export const calculateDependencyStats = (node) => {
  let downstreamSuppliers = 0;
  let highCriticalityRoutes = 0;

  const traverse = (current) => {
    if (!current?.children) return;

    current.children.forEach((child) => {
      downstreamSuppliers++;

      const criticality = child?.routeCriticality;

      if (criticality && criticality.toLowerCase() === "high") {
        highCriticalityRoutes++;
      }

      traverse(child);
    });
  };

  traverse(node);

  return { downstreamSuppliers, highCriticalityRoutes };
};