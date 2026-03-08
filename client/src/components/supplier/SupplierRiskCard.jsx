import React from "react";
import clsx from "clsx";
import { MdOutlineRemoveRedEye } from "react-icons/md";


const SupplierRiskCard = ({ risk }) => {
  return (
    <div className="w-full bg-gray-100 shadow rounded-md p-2 border border-gray-200 text-sm text-gray-700">
<div className="space-y-1 mb-2">

      {/* Risk Name */}
      <div className="flex gap-2">
      <span className="font-semibold text-gray-800">
            Risk:
          </span>
          <span className="text-gray-800 font-semibold line-clamp-1">
            {risk.riskName}
          </span>
      </div>

      {/* Risk Info */}
        <div className="flex gap-2 ">
          <span className="font-semibold text-gray-800 ">
            Risk Tolerance:
          </span>
          <span className="text-gray-600">
            {risk.riskTolerance} / 10
          </span>
        </div>

        <div className="flex gap-2">
          <span className="font-semibold text-gray-800">
            Control Confidence:
          </span>
          <span className="text-gray-600">
            {risk.controlConfidence} / 10
          </span>
        </div>

      </div>

      {/* Button */}
        <button className="flex justify-center text-sm bg-white hover:bg-gray-300  px-3 py-1.5 rounded-md transition gap-1 border border-gray-300">
        <span>
          <MdOutlineRemoveRedEye size={18} className="text-gray-600" />
        </span>
          View
        </button>
      
    </div>
  );
};

export default SupplierRiskCard;