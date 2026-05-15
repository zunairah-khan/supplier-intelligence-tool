const FILTER_STYLES = {
  critical: {
    active: "bg-red-500 text-white",
    inactive: "bg-red-50 text-red-800 hover:bg-red-100",
  },
  warning: {
    active: "bg-orange-400 text-white",
    inactive: "bg-orange-50 text-orange-800 hover:bg-orange-100",
  },
  info: {
    active: "bg-blue-400 text-white",
    inactive: "bg-blue-50 text-blue-800 hover:bg-blue-100",
  },
};

// activeFilter — currently selected severity or null
// toggleFilter — function to set/clear the active filter
// counts — object with critical, warning, info counts
const RiskIndicatorFilterBar = ({ activeFilter, toggleFilter, counts }) => {
  return (
    <div className="flex gap-2 mb-4 flex-wrap shrink-0">
      {Object.entries(FILTER_STYLES).map(([severity, styles]) => (
        counts[severity] > 0 && (
          <button
            key={severity}
            onClick={() => toggleFilter(severity)}
            className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide transition-colors
              ${activeFilter === severity ? styles.active : styles.inactive}
              ${activeFilter && activeFilter !== severity ? "opacity-40" : ""}
            `}
          >
            {counts[severity]} {severity}
          </button>
        )
      ))}

      
    </div>
  );
};

export default RiskIndicatorFilterBar;