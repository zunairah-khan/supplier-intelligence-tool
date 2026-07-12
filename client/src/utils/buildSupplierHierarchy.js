// Constructs a hierarchical supplier tree from a flat supplier dataset.
// If rootSupplierId is omitted, the complete organisational hierarchy is returned.
// Otherwise, a subtree rooted at the specified supplier is generated.
export function buildSupplierHierarchy(suppliers, rootSupplierId = null) {

  /*
   * Time Complexity: O(n + e)
   * n = number of suppliers
   * e = number of parent-child relationships
   *
   * Lookup maps eliminate repeated searches, ensuring suppliers and
   * relationships are traversed only once during construction.
   */

  // Maps supplier identifiers to supplier objects.
  const supplierMap = new Map();

  // Maps parent supplier identifiers to their immediate child relationships.
  const childrenMap = new Map();


  // First pass: construct lookup maps for suppliers and parent-child relationships.
  suppliers.forEach((supplier) => {

    // Store supplier object and initialise its children collection.
    supplierMap.set(supplier._id, { ...supplier, children: [] });

    // Record each upstream supplier relationship.
    if (supplier.parentSuppliers && supplier.parentSuppliers.length > 0) {

      supplier.parentSuppliers.forEach((parent) => {

        const parentId = parent._id;

        // Initialise relationship collection for the parent if required.
        if (!childrenMap.has(parentId)) {
          childrenMap.set(parentId, []);
        }

        // Store child reference together with route criticality metadata.
        childrenMap.get(parentId).push({
          childId: supplier._id,
          routeCriticality: parent.routeCriticality
        });

      });

    } else {

      // Suppliers without parents are treated as organisational root nodes.
      if (!childrenMap.has(null)) {
        childrenMap.set(null, []);
      }

      childrenMap.get(null).push({
        childId: supplier._id,
        routeCriticality: null
      });
    }

  });


  // Recursively constructs a supplier node and all downstream descendants.
  function buildNode(supplierId) {

    const supplier = supplierMap.get(supplierId);

    // Retrieve immediate child relationships for the current supplier.
    const childrenLinks = childrenMap.get(supplierId) || [];

    // Construct child nodes recursively.
    supplier.children = childrenLinks.map((link) => {

      const childNode = buildNode(link.childId);

      // Preserve route metadata for visualisation within the Tier Map.
      childNode.routeCriticality = link.routeCriticality;

      return childNode;

    });

    return supplier;
  }


  // Build the complete organisational hierarchy.
  if (!rootSupplierId) {
    return {
      name: "org",
      children: (childrenMap.get(null) || []).map((link) => buildNode(link.childId))
    };
  }

  // Build a hierarchy rooted at the specified supplier.
  return buildNode(rootSupplierId);
}