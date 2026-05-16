// components/supplier/RiskDetailModal.jsx

import React from "react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import { Dialog } from "@headlessui/react";

const getRiskRating = (impact, likelihood) => {
  const rating = impact * likelihood;
  if (rating >= 20) return { label: "Very High", colour: "bg-red-600", textColour: "text-red-700", bgLight: "bg-red-50" };
  if (rating >= 12) return { label: "High", colour: "bg-orange-500", textColour: "text-orange-700", bgLight: "bg-orange-50" };
  if (rating >= 6) return { label: "Medium", colour: "bg-yellow-500", textColour: "text-yellow-700", bgLight: "bg-yellow-50" };
  return { label: "Low", colour: "bg-green-500", textColour: "text-green-700", bgLight: "bg-green-50" };
};

const getControlLabel = (score) => {
  if (score >= 4) return { label: "Strong", colour: "text-green-600", bgLight: "bg-green-50" };
  if (score >= 3) return { label: "Adequate", colour: "text-yellow-600", bgLight: "bg-yellow-50" };
  return { label: "Weak", colour: "text-red-600", bgLight: "bg-red-50" };
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
        <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="text-lg font-semibold text-gray-800">
              {risk.riskName}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="shrink-0 p-1 rounded hover:bg-gray-100 transition text-gray-500"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Risk Rating */}
          <div className={clsx("rounded-lg p-4 flex items-center justify-between", ratingCategory.bgLight)}>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">RISK RATING</p>
              <p className={clsx("text-3xl font-bold", ratingCategory.textColour)}>
                {riskRating}
              </p>
              <p className="text-xs text-gray-400">Impact × Likelihood</p>
            </div>
            <span className={clsx("text-white text-sm font-semibold px-3 py-1 rounded-full", ratingCategory.colour)}>
              {ratingCategory.label}
            </span>
          </div>

          {/* Impact + Likelihood */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 font-medium mb-1">IMPACT</p>
              <p className="text-2xl font-bold text-gray-700">{risk.impact}</p>
              <p className="text-xs text-gray-400">out of 5</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 font-medium mb-1">LIKELIHOOD</p>
              <p className="text-2xl font-bold text-gray-700">{risk.likelihood}</p>
              <p className="text-xs text-gray-400">out of 5</p>
            </div>
          </div>

          {/* Risk Tolerance */}
          <div className={clsx(
            "rounded-lg p-3 flex items-center justify-between",
            toleranceBreached ? "bg-red-50" : "bg-gray-50"
          )}>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">RISK TOLERANCE</p>
              <p className={clsx("text-xl font-bold", toleranceBreached ? "text-red-600" : "text-gray-700")}>
                {risk.riskTolerance}
              </p>
            </div>
            {toleranceBreached ? (
              <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                ⚠ Tolerance Breached
              </span>
            ) : (
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Within Tolerance
              </span>
            )}
          </div>

          {/* Control Confidence */}
          <div className={clsx("rounded-lg p-3", controlLabel.bgLight)}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-500 font-medium">CONTROL CONFIDENCE</p>
              <span className={clsx("text-xs font-semibold", controlLabel.colour)}>
                {controlLabel.label} · {risk.controlConfidence}/5
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={clsx("h-2 rounded-full",
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