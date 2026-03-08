import React from 'react'
import TierMap from "../components/TierMap";
import { suppliers } from "../assets/data";
import { buildSupplierHierarchy } from "../utils/buildSupplierHierarchy";

const SupplierTierMap = () => {
  const hierarchyData = buildSupplierHierarchy(suppliers);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-6">
        Supplier Tier Mapping
      </h1>

      <div className="overflow-auto">
        <TierMap data={hierarchyData} />
      </div>
    </div>
  );
}

export default SupplierTierMap;