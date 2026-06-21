export function findSubtree(node, supplierId) {
  if (!node) return null;

  if (node._id === supplierId) {
    return node;
  }

  for (const child of node.children || []) {
    const result = findSubtree(child, supplierId);
    if (result) return result;
  }

  return null;
}