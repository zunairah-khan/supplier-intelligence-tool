import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";

const SEVERITY_STYLES = {
  critical: "bg-red-50 border-l-4 border-red-500 text-red-800",
  warning: "bg-orange-50 border-l-4 border-orange-400 text-orange-800",
  info: "bg-blue-50 border-l-4 border-blue-400 text-blue-800",
};

const SEVERITY_LABEL = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
};

// showNavigate — controls whether the arrow button to the supplier
// details page is rendered. Set to true on tier map and executive
// dashboard, false on the supplier details page where the user
// is already viewing that supplier.
const riskIndicatorCard = ({ indicator, showNavigate = false }) => {
  const navigate = useNavigate();

  return (
    <div className={`p-3 rounded text-sm ${SEVERITY_STYLES[indicator.severity]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <span className="font-semibold uppercase text-xs tracking-wide">
            {SEVERITY_LABEL[indicator.severity]}
          </span>
          <p className="font-medium mt-0.5">{indicator.supplierName}</p>
          <p className="mt-0.5 font-normal">{indicator.message}</p>
        </div>

        {showNavigate && (
          <button
            onClick={() => navigate(`/suppliers/${indicator.supplierId}`)}
            className="shrink-0 mt-1 p-1 rounded hover:bg-black/10 transition-colors"
            title={`View ${indicator.supplierName} details`}
          >
            <HiArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default riskIndicatorCard;