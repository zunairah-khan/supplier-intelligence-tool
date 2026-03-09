
// Builds a hierarchical tree of suppliers for mapping.
// Can either build the full org tree or start from a specific supplier.
export function buildSupplierHierarchy(suppliers, rootSupplierId = null) {

// O(n + e) complexity:
// n = number of suppliers
// e = number of parent relationships (supply routes)
// suppliers and relationships are iterated but never nested

  // Map: supplierId -> supplier object
  const supplierMap = new Map();

  // Map: parentSupplierId -> array of child supplierIds
  const childrenMap = new Map();


  // First pass: build lookup maps
  suppliers.forEach((supplier) => {

    // Store supplier and initialise children array
    supplierMap.set(supplier._id, { ...supplier, children: [] });

  
    // iterate over each parent relationship in the parent suppliers array

    if (supplier.parentSuppliers && supplier.parentSuppliers.length > 0) {

      supplier.parentSuppliers.forEach((parent) => {

        const parentId = parent._id;

        // Ensure parent key exists in childrenMap
        if (!childrenMap.has(parentId)) {
          childrenMap.set(parentId, []);
        }


 //storing the child supplierId and route criticality for the link

        childrenMap.get(parentId).push({
          childId: supplier._id,
          routeCriticality: parent.routeCriticality
        });

      });

    } else {

      // Suppliers with NO parents are treated as root nodes
      if (!childrenMap.has(null)) {
        childrenMap.set(null, []);
      }

      childrenMap.get(null).push({
        childId: supplier._id,
        routeCriticality: null
      });
    }

  });


  // Recursive function to build a node and all its descendants
  function buildNode(supplierId) {

    const supplier = supplierMap.get(supplierId);

  
    // childrenMap stores objects so we retrieve childId + routeCriticality.
  
    const childrenLinks = childrenMap.get(supplierId) || [];

    // Recursively build child nodes
    supplier.children = childrenLinks.map((link) => {

      const childNode = buildNode(link.childId);


      // Attach route criticality to the child node so the TierMap component can colour the connection.

      childNode.routeCriticality = link.routeCriticality;

      return childNode;

    });

    return supplier;
  }


  // Case 1: Build full hierarchy from organisation root
  if (!rootSupplierId) {
    return {
      name: "org",
      children: (childrenMap.get(null) || []).map((link) => buildNode(link.childId))
    };
  }

  // Case 2: Build subtree starting from a specific supplier
  return buildNode(rootSupplierId);
}