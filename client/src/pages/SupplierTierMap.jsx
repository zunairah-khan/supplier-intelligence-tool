import React from "react";
import TierMap from "../components/TierMap";
import { suppliers } from "../assets/data";
import { buildSupplierHierarchy } from "../utils/buildSupplierHierarchy";

const SupplierTierMap = () => {

  const hierarchyData = buildSupplierHierarchy(suppliers);

  return (
    <div className="w-full min-h-screen flex flex-col gap-6">

      {/* Page Header */}
      <h1 className="text-2xl font-semibold">
        Supplier Tier Mapping
      </h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-5 gap-4">

        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Total Suppliers</p>
          <p className="text-xl font-semibold">--</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">High Risk</p>
          <p className="text-xl font-semibold">--</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Medium Risk</p>
          <p className="text-xl font-semibold">--</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Low Risk</p>
          <p className="text-xl font-semibold">--</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">High Criticality Routes</p>
          <p className="text-xl font-semibold">--</p>
        </div>

      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-4 gap-6 flex-1">

        {/* Tier Map */}
        <div className="col-span-3 bg-white p-6 rounded-lg shadow flex flex-col h-full">
          <div className="h-full">
            <TierMap data={hierarchyData} />
          </div>
        </div>

        {/* Risk Signals Panel */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col h-full">
          <h2 className="text-lg font-semibold mb-4">
            Risk Signals
          </h2>

          {/* Placeholder */}
          <p className="text-gray-500 text-sm">
            Risk monitoring indicators will appear here.
          </p>

        </div>

      </div>

    </div>
  );
};

export default SupplierTierMap;
