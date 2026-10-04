// Retrieves all actions and enriches each record with its associated supplier name.

export const getSupplierActions = (actions, suppliers) => {
  return actions.map((action) => {
    const supplier = suppliers.find((s) => s._id === action.FK_supplier_id);

    return {
      ...action,
      supplierName: supplier?.name || "Unknown Supplier",
    };
  });
};

// Retrieves only the actions associated with a specified supplier. Equivalent to filtering by a foreign key in a production API or database query.

export const getActionsForSupplier = (actions, supplierId) => {
  return actions.filter((a) => a.FK_supplier_id === supplierId);
};