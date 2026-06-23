import { describe, it, expect } from 'vitest'
import { checkContractExpiry } from '../utils/riskIndicators/checkContractExpiry'
import { checkCapacity } from '../utils/riskIndicators/checkCapacity'
import { checkTier1HighRisk } from '../utils/riskIndicators/checkTier1HighRisk'
import { checkRiskToleranceBreached } from '../utils/riskIndicators/checkRiskToleranceBreached'
import { checkRisksToImprove } from '../utils/riskIndicators/checkRisksToImprove'
import { checkSharedDependency } from '../utils/riskIndicators/checkSharedDependency'

const mockSupplier = {
  _id: "s1",
  name: "Supplier A",
  tier: 1,
  RiskLevel: "High",
  capacity: 0.4,
}

// --- checkContractExpiry ---
describe('checkContractExpiry', () => {
  it('returns null when no contract expiry date exists', () => {
    expect(checkContractExpiry({ ...mockSupplier })).toBeNull()
  })

  it('returns critical indicator when contract has already expired', () => {
    const supplier = { ...mockSupplier, contract_expiry_date: "2020-01-01" }
    const result = checkContractExpiry(supplier)
    expect(result).not.toBeNull()
    expect(result.severity).toBe('critical')
    expect(result.category).toBe('contract')
  })

  it('returns info indicator when contract expires within 90 days', () => {
    const soon = new Date()
    soon.setDate(soon.getDate() + 45)
    const supplier = { ...mockSupplier, contract_expiry_date: soon.toISOString().split('T')[0] }
    const result = checkContractExpiry(supplier)
    expect(result).not.toBeNull()
    expect(result.severity).toBe('info')
  })

  it('returns null when contract expiry is more than 90 days away', () => {
    const future = new Date()
    future.setDate(future.getDate() + 200)
    const supplier = { ...mockSupplier, contract_expiry_date: future.toISOString().split('T')[0] }
    expect(checkContractExpiry(supplier)).toBeNull()
  })
})

// --- checkCapacity ---
describe('checkCapacity', () => {
  it('returns critical indicator when capacity is 0.75 or above', () => {
    const result = checkCapacity({ ...mockSupplier, capacity: 0.8 })
    expect(result.severity).toBe('critical')
    expect(result.category).toBe('capacity')
  })

  it('returns warning indicator when capacity is between 0.5 and 0.75', () => {
    const result = checkCapacity({ ...mockSupplier, capacity: 0.6 })
    expect(result.severity).toBe('warning')
  })

  it('returns null when capacity is below 0.5', () => {
    expect(checkCapacity({ ...mockSupplier, capacity: 0.3 })).toBeNull()
  })
})

// --- checkTier1HighRisk ---
describe('checkTier1HighRisk', () => {
  it('returns critical indicator for Tier 1 High Risk supplier', () => {
    const result = checkTier1HighRisk(mockSupplier)
    expect(result).not.toBeNull()
    expect(result.severity).toBe('critical')
  })

  it('returns null for Tier 1 non-High Risk supplier', () => {
    expect(checkTier1HighRisk({ ...mockSupplier, RiskLevel: 'Low' })).toBeNull()
  })

  it('returns null for High Risk supplier that is not Tier 1', () => {
    expect(checkTier1HighRisk({ ...mockSupplier, tier: 2 })).toBeNull()
  })
})

// --- checkRiskToleranceBreached ---
describe('checkRiskToleranceBreached', () => {
  it('returns indicator when risk rating exceeds tolerance', () => {
    const risks = [{ riskName: "Test Risk", impact: 5, likelihood: 5, riskTolerance: 10, controlConfidence: 3 }]
    const result = checkRiskToleranceBreached(mockSupplier, risks)
    expect(result).toHaveLength(1)
    expect(result[0].severity).toBe('critical')
  })

  it('returns empty array when risk rating does not exceed tolerance', () => {
    const risks = [{ riskName: "Test Risk", impact: 1, likelihood: 1, riskTolerance: 10, controlConfidence: 3 }]
    expect(checkRiskToleranceBreached(mockSupplier, risks)).toHaveLength(0)
  })

  it('returns empty array when risks array is empty', () => {
    expect(checkRiskToleranceBreached(mockSupplier, [])).toHaveLength(0)
  })

  it('returns multiple indicators when multiple risks breach tolerance', () => {
    const risks = [
      { riskName: "Risk A", impact: 5, likelihood: 5, riskTolerance: 10, controlConfidence: 3 },
      { riskName: "Risk B", impact: 4, likelihood: 4, riskTolerance: 10, controlConfidence: 2 },
    ]
    expect(checkRiskToleranceBreached(mockSupplier, risks)).toHaveLength(2)
  })
})

// --- checkRisksToImprove ---
describe('checkRisksToImprove', () => {
  it('returns indicator for high rating and low control confidence', () => {
    const risks = [{ riskName: "Test Risk", impact: 5, likelihood: 4, riskTolerance: 20, controlConfidence: 2 }]
    const result = checkRisksToImprove(mockSupplier, risks)
    expect(result).toHaveLength(1)
    expect(result[0].severity).toBe('critical')
  })

  it('returns empty array when rating is below threshold', () => {
    const risks = [{ riskName: "Test Risk", impact: 2, likelihood: 2, riskTolerance: 20, controlConfidence: 2 }]
    expect(checkRisksToImprove(mockSupplier, risks)).toHaveLength(0)
  })

  it('returns empty array when control confidence is adequate despite high rating', () => {
    const risks = [{ riskName: "Test Risk", impact: 5, likelihood: 4, riskTolerance: 20, controlConfidence: 4 }]
    expect(checkRisksToImprove(mockSupplier, risks)).toHaveLength(0)
  })
})

// --- checkSharedDependency ---
describe('checkSharedDependency', () => {
  it('flags suppliers with more than one parent as shared dependencies', () => {
    const suppliers = [
      { _id: "s1", name: "Parent A", parentSuppliers: [] },
      { _id: "s2", name: "Parent B", parentSuppliers: [] },
      { _id: "s3", name: "Shared Child", parentSuppliers: [{ _id: "s1" }, { _id: "s2" }] },
    ]
    const result = checkSharedDependency(suppliers)
    expect(result).toHaveLength(1)
    expect(result[0].supplierId).toBe("s3")
    expect(result[0].severity).toBe('critical')
  })

  it('returns empty array when no shared dependencies exist', () => {
    const suppliers = [
      { _id: "s1", name: "Supplier A", parentSuppliers: [] },
      { _id: "s2", name: "Supplier B", parentSuppliers: [{ _id: "s1" }] },
    ]
    expect(checkSharedDependency(suppliers)).toHaveLength(0)
  })

  it('returns empty array for empty supplier input', () => {
    expect(checkSharedDependency([])).toHaveLength(0)
  })
})