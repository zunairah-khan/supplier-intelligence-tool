import { describe, it, expect } from "vitest";
import { getRisksForSupplier } from "../utils/getRisksForSupplier";

describe("getRisksForSupplier", () => {
  it("filters risks for a matching supplier ID", () => {
    const risks = [
      { id: 1, FK_supplier_id: "A", type: "financial" },
      { id: 2, FK_supplier_id: "B", type: "operational" },
      { id: 3, FK_supplier_id: "A", type: "compliance" },
    ];

    const result = getRisksForSupplier(risks, "A");

    expect(result).toEqual([
      { id: 1, FK_supplier_id: "A", type: "financial" },
      { id: 3, FK_supplier_id: "A", type: "compliance" },
    ]);
  });

  it("returns empty array when no risks match supplier ID", () => {
    const risks = [
      { id: 1, FK_supplier_id: "B" },
      { id: 2, FK_supplier_id: "C" },
    ];

    const result = getRisksForSupplier(risks, "A");

    expect(result).toEqual([]);
  });

  it("returns empty array when risks list is empty", () => {
    const result = getRisksForSupplier([], "A");

    expect(result).toEqual([]);
  });
});