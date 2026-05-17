export const getRisksForSupplier = (risks, supplierId) => {
  return risks.filter((r) => r.FK_supplier_id === supplierId);
};