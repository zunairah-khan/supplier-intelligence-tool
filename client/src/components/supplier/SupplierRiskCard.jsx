import React from "react";
import clsx from "clsx";

const IMPACT_STYLES = {
  High: "border-l-4 border-red-600",
  Medium: "border-l-4 border-yellow-600",
  Low: "border-l-4 border-green-600",
};

const SupplierRiskCard = ({ risk }) => {
  return (
    <div className="w-full bg-white shadow-md hover:shadow-lg rounded-lg p-4 transition-all duration-200 ">
      {/* Risk Name */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-bold text-gray-900">
          {risk.riskName}
        </h3>
      </div>

      {/* Risk Info */}
      <div className="space-y-2 text-sm text-gray-700 mb-4">

        <div className="flex justify-between">
          <span className="font-semibold text-gray-800">
            Risk Tolerance
          </span>
          <span className="text-gray-600">
            {risk.riskTolerance} / 10
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-gray-800">
            Control Confidence
          </span>
          <span className="text-gray-600">
            {risk.controlConfidence} / 10
          </span>
        </div>

      </div>

      {/* Button */}
      <div className="flex justify-end">
        <button
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default SupplierRiskCard;