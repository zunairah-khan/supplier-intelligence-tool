export function buildSupplierHierarchy(suppliers) {

// algorithmic complexity is o(n) where n is the number of suppliers, since we loop through the list a few times but never nested loops

  // lookup map for quick access to suppliers by ID
  const supplierMap = {};
  suppliers.forEach(supplier => {
    supplierMap[supplier._id] = { ...supplier, children: [] };
  });

  // array for top-level suppliers
  const rootChildren = [];

  suppliers.forEach(supplier => {

    if (supplier.parentSupplierID === null) {
      // Tier 1 supplier
      rootChildren.push(supplierMap[supplier._id]);
    } 
    else {
      // Find parent supplier and nest suppliers under their parents
      const parent = supplierMap[supplier.parentSupplierID];

      if (parent) {
        parent.children.push(supplierMap[supplier._id]);
      }
    }

  });

  // Wrap everything in a virtual root node (this represents the client org)
  return {
    _id: "org",
    name: "Organisation",
    children: rootChildren
  };

}