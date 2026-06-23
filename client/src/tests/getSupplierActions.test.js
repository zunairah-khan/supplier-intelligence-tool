import { describe, it, expect } from "vitest";
import { getSupplierActions } from "../utils/getSupplierActions";

describe("getSupplierActions", () => {
  it("attaches supplier names to actions", () => {
    const actions = [
      { id: 1, FK_supplier_id: "A", title: "Review contract" },
      { id: 2, FK_supplier_id: "B", title: "Audit supplier" },
    ];

    const suppliers = [
      { _id: "A", name: "Supplier Alpha" },
      { _id: "B", name: "Supplier Beta" },
    ];

    const result = getSupplierActions(actions, suppliers);

    expect(result).toEqual([
      {
        id: 1,
        FK_supplier_id: "A",
        title: "Review contract",
        supplierName: "Supplier Alpha",
      },
      {
        id: 2,
        FK_supplier_id: "B",
        title: "Audit supplier",
        supplierName: "Supplier Beta",
      },
    ]);
  });

  it("returns 'Unknown Supplier' when supplier is not found", () => {
    const actions = [
      { id: 1, FK_supplier_id: "X", title: "Check data" },
    ];

    const suppliers = [
      { _id: "A", name: "Supplier Alpha" },
    ];

    const result = getSupplierActions(actions, suppliers);

    expect(result[0].supplierName).toBe("Unknown Supplier");
  });
});