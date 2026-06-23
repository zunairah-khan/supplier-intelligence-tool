import { describe, it, expect } from "vitest";
import { calculateSupplierStats } from "../utils/calculateSupplierStats";

describe("calculateSupplierStats", () => {
  it("correctly calculates supplier stats from a simple hierarchy", () => {
    const tree = {
      name: "org",
      children: [
        {
          name: "Supplier A",
          RiskLevel: "High",
          tier: 1,
          routeCriticality: "high",
          children: [
            {
              name: "Supplier B",
              RiskLevel: "Medium",
              tier: 2,
              routeCriticality: "low",
              children: [],
            },
          ],
        },
      ],
    };

    const result = calculateSupplierStats(tree);

    expect(result.totalSuppliers).toBe(2);
    expect(result.highRiskSuppliers).toBe(1);
    expect(result.mediumRiskSuppliers).toBe(1);
    expect(result.lowRiskSuppliers).toBe(0);

    expect(result.highCriticalityRoutes).toBe(1);

    expect(result.tierDistribution).toEqual({
      1: 1,
      2: 1,
    });
  });

  it("handles empty tree", () => {
    const tree = {
      name: "org",
      children: [],
    };

    const result = calculateSupplierStats(tree);

    expect(result.totalSuppliers).toBe(0);
    expect(result.highRiskSuppliers).toBe(0);
    expect(result.mediumRiskSuppliers).toBe(0);
    expect(result.lowRiskSuppliers).toBe(0);
    expect(result.highCriticalityRoutes).toBe(0);
    expect(result.tierDistribution).toEqual({});
  });

  it("ignores root org node in counts", () => {
    const tree = {
      name: "org",
      RiskLevel: "high",
      tier: 0,
      children: [
        {
          name: "Supplier A",
          RiskLevel: "low",
          tier: 1,
          children: [],
        },
      ],
    };

    const result = calculateSupplierStats(tree);

    expect(result.totalSuppliers).toBe(1);
    expect(result.highRiskSuppliers).toBe(0); // org ignored
  });
});