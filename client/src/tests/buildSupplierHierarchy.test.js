import { describe, it, expect } from 'vitest'
import { buildSupplierHierarchy } from '../utils/buildSupplierHierarchy'

const mockSuppliers = [
  { _id: "s1", name: "Supplier A", tier: 1, parentSuppliers: [] },
  { _id: "s2", name: "Supplier B", tier: 2, parentSuppliers: [{ _id: "s1", routeCriticality: "High" }] },
  { _id: "s3", name: "Supplier C", tier: 2, parentSuppliers: [{ _id: "s1", routeCriticality: "Low" }] },
  { _id: "s4", name: "Supplier D", tier: 3, parentSuppliers: [{ _id: "s2", routeCriticality: "Medium" }] },
]

describe('buildSupplierHierarchy', () => {
  it('builds full hierarchy from org root when no id provided', () => {
    const result = buildSupplierHierarchy(mockSuppliers)
    expect(result.name).toBe('org')
    expect(result.children).toHaveLength(1)
  })

  it('root node children are tier 1 suppliers', () => {
    const result = buildSupplierHierarchy(mockSuppliers)
    expect(result.children[0].name).toBe('Supplier A')
  })

  it('builds correct subtree from specific supplier id', () => {
    const result = buildSupplierHierarchy(mockSuppliers, "s1")
    expect(result.name).toBe('Supplier A')
    expect(result.children).toHaveLength(2)
  })

  it('attaches routeCriticality to child nodes', () => {
    const result = buildSupplierHierarchy(mockSuppliers)
    const supplierB = result.children[0].children.find(c => c.name === 'Supplier B')
    expect(supplierB.routeCriticality).toBe('High')
  })

  it('returns empty children array for leaf nodes', () => {
    const result = buildSupplierHierarchy(mockSuppliers, "s4")
    expect(result.children).toHaveLength(0)
  })

  it('returns org root with empty children for empty supplier array', () => {
    const result = buildSupplierHierarchy([])
    expect(result.name).toBe('org')
    expect(result.children).toHaveLength(0)
  })
})