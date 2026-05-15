// exports everything from risk indicator functions so they can be easily imported from a single file
export { createIndicator, SEVERITY, CATEGORY } from "./createIndicator";
export { checkTier1HighRisk } from "./checkTier1HighRisk";
export { checkCapacity } from "./checkCapacity";
export { checkContractExpiry } from "./checkContractExpiry";
export { checkDownstreamCount } from "./checkDownstreamCount";
export { checkSharedDependency } from "./checkSharedDependency";
export { checkRiskToleranceBreached } from "./checkRiskToleranceBreached";
export { checkHighRatingLowControl } from "./checkHighRatingLowControl";
export { generateSupplierIndicators } from "./generateSupplierIndicators";
export { generatePortfolioIndicators } from "./generatePortfolioIndicators";