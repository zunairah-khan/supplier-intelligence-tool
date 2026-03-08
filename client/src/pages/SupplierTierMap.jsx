import React from 'react'
import TierMap from "../components/TierMap";
import { suppliers } from "../assets/data";
import { buildSupplierHierarchy } from "../utils/buildSupplierHierarchy";

const SupplierTierMap = () => {
  const hierarchyData = buildSupplierHierarchy(suppliers);
  
  return (
    <div className="w-full">
    <h1 className="text-2xl font-semibold text-gray-600 mb-4">
        Supplier Tier Mapping
      </h1>
    <div className="bg-white p-6 rounded-lg shadow">
      

      <div className="overflow-auto">
        <TierMap data={hierarchyData} />
      </div>
    </div>
    </div>
  );
}

export default SupplierTierMap;