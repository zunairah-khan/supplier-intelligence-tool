
 // Recursively searches the supplier hierarchy to locate the subtree associated with a given supplier identifier.
 
export function findSubtree(node, supplierId) {
  if (!node) return null;

  // Return the current node when the target supplier is located.
  if (node._id === supplierId) {
    return node;
  }

  // Depth-first traversal through child supplier relationships.
  for (const child of node.children || []) {
    const result = findSubtree(child, supplierId);
    if (result) return result;
  }

  return null;
}