// Utility function to filter risks for a specific supplier based on the supplier ID.

export const getRisksForSupplier = (risks, supplierId) => {
  return risks.filter((r) => r.FK_supplier_id === supplierId);
};