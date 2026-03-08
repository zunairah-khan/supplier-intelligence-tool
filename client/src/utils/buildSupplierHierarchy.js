
// Builds a hierarchical tree of suppliers for mapping.
// Can either build the full org tree or start from a specific supplier.
export function buildSupplierHierarchy(suppliers, rootSupplierId = null) {

  // O(n) complexity: suppliers are iterated a few times but never nested

  // Map: supplierId -> supplier object
  const supplierMap = new Map();

  // Map: parentSupplierId -> array of child supplierIds
  const childrenMap = new Map();


  // First pass: build lookup maps
  suppliers.forEach((supplier) => {

    // Store supplier and initialise children array
    supplierMap.set(supplier._id, { ...supplier, children: [] });

    // Ensure parent key exists in childrenMap
    if (!childrenMap.has(supplier.parentSupplierID)) {
      childrenMap.set(supplier.parentSupplierID, []);
    }

    // Add supplier to its parent's children list
    childrenMap.get(supplier.parentSupplierID).push(supplier._id);
  });


  // Recursive function to build a node and all its descendants
  function buildNode(supplierId) {

    const supplier = supplierMap.get(supplierId);

    // Get children of this supplier
    const childrenIds = childrenMap.get(supplierId) || [];

    // Recursively build child nodes
    supplier.children = childrenIds.map((childId) => buildNode(childId));

    return supplier;
  }


  // Case 1: Build full hierarchy from organisation root
  if (!rootSupplierId) {
    return {
      name: "org",
      children: (childrenMap.get(null) || []).map((id) => buildNode(id))
    };
  }

  // Case 2: Build subtree starting from a specific supplier
  return buildNode(rootSupplierId);
}