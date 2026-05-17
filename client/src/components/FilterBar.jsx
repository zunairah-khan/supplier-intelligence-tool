const FilterBar = ({ filters, activeFilter, onToggle }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map(({ value, label, colour }) => (
        <button
          key={value}
          onClick={() => onToggle(value)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors
            ${activeFilter === value
              ? `${colour} text-white`
              : "bg-white text-gray-600 hover:bg-gray-200"
            }
            ${activeFilter && activeFilter !== value ? "opacity-50" : ""}
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;