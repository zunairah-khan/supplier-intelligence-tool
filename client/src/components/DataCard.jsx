import React from "react"
import clsx from "clsx";
const STATISTIC_HEADERCOLOURS= {
  "High Risk": "border-red-600",
  "Medium Risk": "border-yellow-600",
  "Low Risk": "border-green-600",
  "Total Suppliers": "border-blue-600",
  "High Criticality Routes": "border-red-700"
};
const DataCard = ({ header, statistic }) => {
  const headerColourClass =
    STATISTIC_HEADERCOLOURS[header] || "border-gray-300"

  return (
    <div
      className={clsx(
        "bg-white rounded-lg shadow p-3 text-center border-t-8",
        headerColourClass
      )}
    >
      <p className="text-sm text-gray-500">{header}</p>
      <p className="text-xl font-semibold">{statistic}</p>
    </div>
  )
}

export default DataCard
