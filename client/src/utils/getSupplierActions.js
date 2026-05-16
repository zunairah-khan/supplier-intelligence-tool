// Gets all actions, optionally attaching supplier name for display
export const getSupplierActions = (actions, suppliers) => {
  return actions.map((action) => {
    const supplier = suppliers.find((s) => s._id === action.FK_supplier_id);
    return {
      ...action,
      supplierName: supplier?.name || "Unknown Supplier",
    };
  });
};

export const getActionsForSupplier = (actions, supplierId) => {
  return actions.filter((a) => a.FK_supplier_id === supplierId);
};