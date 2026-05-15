import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { MdOutlineAccountTree } from "react-icons/md"; // structural
import { FiAlertTriangle } from "react-icons/fi";       // risk
import { TbFileInvoice } from "react-icons/tb";         // contract
import { MdOutlineSpeed } from "react-icons/md";        // capacity
import { MdAltRoute } from "react-icons/md";            // route

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

const CATEGORY_ICON = {
  structural: <MdOutlineAccountTree size={16} />,
  risk: <FiAlertTriangle size={16} />,
  contract: <TbFileInvoice size={16} />,
  capacity: <MdOutlineSpeed size={16} />,
  route: <MdAltRoute size={16} />,
};

const RiskIndicatorCard = ({ indicator, showNavigate = false }) => {
  const navigate = useNavigate();

  return (
    <div className={`p-3 rounded text-sm ${SEVERITY_STYLES[indicator.severity]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">

          {/* Severity label with category icon */}
          <div className="flex items-center gap-1.5">
            {CATEGORY_ICON[indicator.category]}
            <span className="font-semibold uppercase text-xs tracking-wide">
              {SEVERITY_LABEL[indicator.severity]}
            </span>
          </div>

          <p className="font-bold mt-0.5">{indicator.supplierName}</p>
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

export default RiskIndicatorCard;