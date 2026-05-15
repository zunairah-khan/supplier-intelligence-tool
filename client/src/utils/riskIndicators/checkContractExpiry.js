import { createIndicator, SEVERITY, CATEGORY } from "./createIndicator";
// --- CONTRACT EXPIRY ---
// Requires contract_expiry_date field on supplier object (ISO date string)
export const checkContractExpiry = (supplier) => {
  if (!supplier.contract_expiry_date) return null;

  const daysUntilExpiry = Math.ceil(
    (new Date(supplier.contract_expiry_date) - new Date()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiry < 0) {
    return createIndicator(
      supplier._id,
      supplier.name,
      SEVERITY.CRITICAL,
      CATEGORY.CONTRACT,
      `Contract with ${supplier.name} has expired.`
    );
  }
  if (daysUntilExpiry <= 90) {
    return createIndicator(
      supplier._id,
      supplier.name,
      SEVERITY.INFO,
      CATEGORY.CONTRACT,
      `Contract with ${supplier.name} expires in ${daysUntilExpiry} days.`
    );
  }
  return null;
};