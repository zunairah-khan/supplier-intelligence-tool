
// Builds a hierarchical tree of suppliers for mapping.
// Can either build the full org tree or start from a specific supplier.

export function buildSupplierHierarchy(suppliers, rootSupplierId = null) {
  // Map of supplierId -> supplier object with empty children array
  const supplierMap = new Map();

  // Map of parentSupplierId -> list of child supplierIds
  const childrenMap = new Map();

  // First pass: populate supplierMap and childrenMap
  suppliers.forEach((supplier) => {
    // Store supplier and prepare empty children array
    supplierMap.set(supplier._id, { ...supplier, children: [] });

    // Map parentSupplierId -> child IDs
    if (!childrenMap.has(supplier.parentSupplierID)) childrenMap.set(supplier.parentSupplierID, []);
    childrenMap.get(supplier.parentSupplierID).push(supplier._id);

    // Ensure every supplier ID exists as a key in childrenMap
    // This prevents undefined children when building subtrees
    if (!childrenMap.has(supplier._id)) childrenMap.set(supplier._id, []);
  });

  // Recursive function to build a node and its nested children
  function buildNode(supplierId) {
    const supplier = supplierMap.get(supplierId);             // Get supplier object
    const childrenIds = childrenMap.get(supplierId) || [];    // Get IDs of children
    supplier.children = childrenIds.map((id) => buildNode(id)); // Recursively build children
    return supplier;
  }

  // If no rootSupplierId is provided, create an "org" root node
  if (!rootSupplierId) {
    return {
      name: "org",
      children: (childrenMap.get(null) || []).map((id) => buildNode(id)), // Tier 1 suppliers
    };
  }

  // Otherwise, build tree starting from a specific supplier
  return buildNode(rootSupplierId);
}