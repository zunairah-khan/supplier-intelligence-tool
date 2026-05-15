const SEVERITY = {
  CRITICAL: "critical",
  WARNING: "warning",
  INFO: "info",
};

const CATEGORY = {
  STRUCTURAL: "structural",
  CAPACITY: "capacity", 
  CONTRACT: "contract",
  RISK: "risk",
  ROUTE: "route",
};

// Factory function — all indicators created through this
const createIndicator = (supplierId, supplierName, severity, category, message) => ({
  supplierId,
  supplierName,
  severity,
  category,
  message,
});