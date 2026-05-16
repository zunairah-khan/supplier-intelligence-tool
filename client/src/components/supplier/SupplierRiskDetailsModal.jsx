import React from "react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import { Dialog } from "@headlessui/react";
import { FaUser } from "react-icons/fa";
import { MdOutlineSpeed, MdOutlineTrendingUp, MdOutlineShield } from "react-icons/md";

const getRiskRating = (impact, likelihood) => {
  const rating = impact * likelihood;
  if (rating >= 20) return { label: "Very High", colour: "bg-red-600" };
  if (rating >= 12) return { label: "High", colour: "bg-orange-500" };
  if (rating >= 6) return { label: "Medium", colour: "bg-yellow-500" };
  return { label: "Low", colour: "bg-green-500" };
};

const getControlLabel = (score) => {
  if (score >= 4) return { label: "Strong", colour: "text-green-600" };
  if (score >= 3) return { label: "Adequate", colour: "text-yellow-600" };
  return { label: "Weak", colour: "text-red-600" };
};

const SupplierRiskDetailModal = ({ risk, isOpen, onClose }) => {
  if (!risk) return null;

  const riskRating = risk.impact * risk.likelihood;
  const ratingCategory = getRiskRating(risk.impact, risk.likelihood);
  const controlLabel = getControlLabel(risk.controlConfidence);
  const toleranceBreached = riskRating > risk.riskTolerance;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 flex flex-col gap-5">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-400 font-medium">{risk.riskReference}</p>
              <Dialog.Title className="text-xl font-bold text-gray-800">
                {risk.riskName}
              </Dialog.Title>

              {/* Rating badge + tolerance inline */}
              <div className="flex items-center gap-2 mt-1">
                <span className={clsx(
                  "text-white text-xs font-semibold px-2.5 py-0.5 rounded-full",
                  ratingCategory.colour
                )}>
                  {ratingCategory.label} · {riskRating}
                </span>
                <span className={clsx(
                  "text-xs font-medium",
                  toleranceBreached ? "text-red-600" : "text-gray-400"
                )}>
                  Tolerance: {risk.riskTolerance} {toleranceBreached && "⚠ Breached"}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="shrink-0 p-1 rounded hover:bg-gray-100 transition text-gray-500"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {risk.riskDescription || "No description provided."}
            </p>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">

            {/* Risk Owner */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <FaUser size={14} className="text-gray-400 shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Risk Owner</p>
                <p className="text-sm font-semibold text-gray-700">
                  {risk.riskOwner || "Unassigned"}
                </p>
              </div>
            </div>

            {/* Impact */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <MdOutlineTrendingUp size={16} className="text-gray-400 shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Impact</p>
                <p className="text-sm font-semibold text-gray-700">{risk.impact} / 5</p>
              </div>
            </div>

            {/* Likelihood */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <MdOutlineSpeed size={16} className="text-gray-400 shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Likelihood</p>
                <p className="text-sm font-semibold text-gray-700">{risk.likelihood} / 5</p>
              </div>
            </div>

            {/* Risk Tolerance */}
            <div className={clsx(
              "flex items-center gap-3 rounded-lg px-4 py-3",
              toleranceBreached ? "bg-red-50" : "bg-gray-50"
            )}>
              <MdOutlineShield size={16} className={clsx("shrink-0", toleranceBreached ? "text-red-400" : "text-gray-400")} />
              <div className="flex-1 flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Risk Tolerance</p>
                <p className={clsx("text-sm font-semibold", toleranceBreached ? "text-red-600" : "text-gray-700")}>
                  {risk.riskTolerance} / 25
                </p>
              </div>
            </div>
          </div>

          {/* Control Confidence */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Control Confidence</p>
              <span className={clsx("text-xs font-semibold", controlLabel.colour)}>
                {controlLabel.label} · {risk.controlConfidence}/5
              </span>
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

        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SupplierRiskDetailModal;