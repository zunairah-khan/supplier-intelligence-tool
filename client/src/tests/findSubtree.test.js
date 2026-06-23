import { describe, it, expect } from 'vitest'
import { findSubtree } from '../utils/riskIndicators/findSubtree'
import { buildSupplierHierarchy } from '../utils/buildSupplierHierarchy'

const mockSuppliers = [
  { _id: "s1", name: "Supplier A", tier: 1, parentSuppliers: [] },
  { _id: "s2", name: "Supplier B", tier: 2, parentSuppliers: [{ _id: "s1", routeCriticality: "High" }] },
  { _id: "s3", name: "Supplier C", tier: 3, parentSuppliers: [{ _id: "s2", routeCriticality: "Low" }] },
]

describe('findSubtree', () => {
  const hierarchy = buildSupplierHierarchy(mockSuppliers)

  it('finds root-level node by id', () => {
    const result = findSubtree(hierarchy, "s1")
    expect(result).not.toBeNull()
    expect(result.name).toBe('Supplier A')
  })

  it('finds nested node by id', () => {
    const result = findSubtree(hierarchy, "s3")
    expect(result).not.toBeNull()
    expect(result.name).toBe('Supplier C')
  })

  it('returns null for non-existent id', () => {
    const result = findSubtree(hierarchy, "nonexistent")
    expect(result).toBeNull()
  })

  it('returns null for null node input', () => {
    expect(findSubtree(null, "s1")).toBeNull()
  })
})