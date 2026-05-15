import React from "react";
import TierMap from "../components/TierMap";
import { suppliers } from "../assets/data";
import { buildSupplierHierarchy } from "../utils/buildSupplierHierarchy";
import { generatePortfolioIndicators } from "../utils/riskIndicators/generatePortfolioIndicators";
import { calculateSupplierStats } from "../utils/calculateSupplierStats";
import DataCard from "../components/DataCard.jsx";
import { useMemo } from "react";
import RiskIndicatorCard from "../components/RiskIndicatorCard.jsx";
import { useState } from "react";
import RiskIndicatorFilterBar from "../components/RiskIndicatorFilterBar.jsx";




const SupplierTierMap = () => {

  const hierarchyData = useMemo(
    () => buildSupplierHierarchy(suppliers),
    []
  );

  const { totalSuppliers, highCriticalityRoutes, highRiskSuppliers, mediumRiskSuppliers, lowRiskSuppliers } =
    useMemo(() => calculateSupplierStats(hierarchyData), [hierarchyData]);

  const rawIndicators = useMemo(() => generatePortfolioIndicators(suppliers), []);
const [activeFilter, setActiveFilter] = useState(null);

const toggleFilter = (severity) => {
  setActiveFilter(prev => prev === severity ? null : severity);
};

const counts = {
  critical: rawIndicators.filter(i => i.severity === "critical").length,
  warning: rawIndicators.filter(i => i.severity === "warning").length,
  info: rawIndicators.filter(i => i.severity === "info").length,
};

const filteredIndicators = activeFilter
  ? rawIndicators.filter(i => i.severity === activeFilter)
  : rawIndicators;
  
  return (
    // h-full instead of min-h-screen — relies on parent layout
    // providing full height. overflow-hidden prevents page scroll.
    <div className="w-full h-full flex flex-col gap-6 overflow-hidden">

      {/* Page Header */}
      <h1 className="text-2xl font-semibold shrink-0">
        Supplier Tier Mapping
      </h1>

      {/* Statistics Cards — shrink-0 prevents these from being compressed */}
      <div className="grid grid-cols-5 gap-4 shrink-0">
        <DataCard header="Total Suppliers" statistic={totalSuppliers} />
        <DataCard header="High Risk" statistic={highRiskSuppliers} />
        <DataCard header="Medium Risk" statistic={mediumRiskSuppliers} />
        <DataCard header="Low Risk" statistic={lowRiskSuppliers} />
        <DataCard header="High Criticality Routes" statistic={highCriticalityRoutes} />
      </div>

      {/* Main Content Layout — flex-1 fills remaining height, min-h-0
          is critical here: without it flex-1 children can still overflow */}
      <div className="grid grid-cols-4 gap-6 flex-1 min-h-0">

        {/* Tier Map */}
        <div className="col-span-3 bg-white p-6 rounded-lg shadow flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <TierMap data={hierarchyData} />
          </div>
        </div>

        {/* Risk Signals Panel — flex column with overflow-hidden on
            the container and overflow-y-auto on the list only */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col min-h-0">
          <h2 className="text-lg font-semibold mb-1 shrink-0">Risk Indicators</h2>

          <RiskIndicatorFilterBar
    activeFilter={activeFilter}
    toggleFilter={toggleFilter}
    counts={counts}
  />

  <div className="flex flex-col gap-3 overflow-y-auto flex-1 min-h-0">
    {filteredIndicators.length === 0 ? (
      <p className="text-gray-500 text-sm">No indicators for this severity.</p>
    ) : (
      filteredIndicators.map((indicator, index) => (
        <RiskIndicatorCard
          key={`${indicator.supplierId}-${index}`}
          indicator={indicator}
          showNavigate={true}
        />
      ))
    )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SupplierTierMap;