import React, { useState } from "react";
import clsx from "clsx";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import SupplierRiskDetailModal from "./SupplierRiskDetailsModal";

const getRiskRating = (impact, likelihood) => {
  const rating = impact * likelihood;
  if (rating >= 20) return { label: "Very High", colour: "bg-red-600" };
  if (rating >= 12) return { label: "High", colour: "bg-orange-500" };
  if (rating >= 6) return { label: "Medium", colour: "bg-yellow-500" };
  return { label: "Low", colour: "bg-green-500" };
};

const SupplierRiskCard = ({ risk }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const riskRating = risk.impact * risk.likelihood;
  const ratingCategory = getRiskRating(risk.impact, risk.likelihood);
  const toleranceBreached = riskRating > risk.riskTolerance;

  return (
    <>
      <div className={clsx(
        "w-full bg-white rounded-md p-3 border text-sm flex flex-col gap-2",
        toleranceBreached ? "border-red-400" : "border-gray-200"
      )}>

        {/* Top row — Risk Name + View button */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-800 line-clamp-2 leading-tight">
            {risk.riskReference}: {risk.riskName}
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="shrink-0 p-1 rounded hover:bg-gray-100 transition border border-gray-200 text-gray-500 hover:text-gray-700"
          >
            <MdOutlineRemoveRedEye size={16} />
          </button>
        </div>

        {/* Rating badge + tolerance */}
        <div className="flex items-center justify-between">
          <span className={clsx("text-white text-xs font-semibold px-2 py-0.5 rounded", ratingCategory.colour)}>
            {ratingCategory.label} · {riskRating}
          </span>
          <span className={clsx("text-xs font-medium", toleranceBreached ? "text-red-600" : "text-gray-400")}>
            Tolerance: {risk.riskTolerance} {toleranceBreached && "⚠ Breached"}
          </span>
        </div>

        {/* Control Confidence bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Control Confidence</span>
            <span>{risk.controlConfidence}/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={clsx("h-1.5 rounded-full",
                risk.controlConfidence >= 4 ? "bg-green-500"
                : risk.controlConfidence >= 3 ? "bg-yellow-500"
                : "bg-red-500"
              )}
              style={{ width: `${(risk.controlConfidence / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <SupplierRiskDetailModal
        risk={risk}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default SupplierRiskCard;