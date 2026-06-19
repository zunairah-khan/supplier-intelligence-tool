import { React, useState, useMemo } from "react";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import { suppliers } from "../assets/data";
import { actions } from "../assets/data";
import { risks } from "../assets/data";
import { getInitials } from "../utils";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  MdBusinessCenter,
  MdLocationOn,
  MdAttachMoney,
  MdCalendarToday,
  MdGavel,
} from "react-icons/md";
import { FaEnvelope, FaSitemap } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { MdOutlineTask } from "react-icons/md";
import TierMap from "../components/TierMap";
import { buildSupplierHierarchy } from "../utils/buildSupplierHierarchy";
import Tabs from "../components/Tabs";
import SupplierRiskCard from "../components/supplier/SupplierRiskCard";
import Button from "../components/Button";
import { IoChevronBackCircle } from "react-icons/io5";
import { calculateSupplierStats } from "../utils/calculateSupplierStats";
import { generateSupplierIndicators } from "../utils/riskIndicators/generateSupplierIndicators";
import RiskIndicatorCard from "../components/RiskIndicatorCard";
import RiskIndicatorFilterBar from "../components/RiskIndicatorFilterBar";
import { getActionsForSupplier } from "../utils/getSupplierActions";
import TaskCard from "../components/TaskCard";
import FilterBar from "../components/FilterBar";
import { getRisksForSupplier } from "../utils/getRisksForSupplier";

const RISK_BORDER_STYLES = {
  High: "border-red-600",
  Medium: "border-yellow-500",
  Low: "border-green-600",
};

const TABS = [
  { title: "Details", icon: <TbListDetails /> },
  { title: "Dependency Map", icon: <FaSitemap /> },
  { title: "Actions", icon: <MdOutlineTask /> },
];

const RISK_LEVEL_BG = {
  High: "bg-red-600",
  Medium: "bg-yellow-500",
  Low: "bg-green-600",
};

const ACTION_STAGE_FILTERS = [
  { value: "todo", label: "To Do", colour: "bg-blue-600" },
  { value: "in progress", label: "In Progress", colour: "bg-yellow-500" },
  { value: "completed", label: "Completed", colour: "bg-green-600" },
];

const ACTION_PRIORITY_FILTERS = [
  { value: "High", label: "High Priority", colour: "bg-red-600" },
  { value: "Medium", label: "Medium Priority", colour: "bg-yellow-500" },
  { value: "Low", label: "Low Priority", colour: "bg-green-600" },
];

const SupplierDetails = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [activeFilter, setActiveFilter] = useState(null);
  const [actionStageFilter, setActionStageFilter] = useState(null);
  const [actionPriorityFilter, setActionPriorityFilter] = useState(null);
  const navigate = useNavigate();

  const supplier = suppliers.find((s) => s._id === id);

  if (!supplier) {
    return <div className="text-red-600">Error: Supplier not found</div>;
  }

  const hierarchyData = useMemo(
    () => buildSupplierHierarchy(suppliers, supplier._id),
    [supplier._id]
  );

  const { totalDownstreamSuppliers, highCriticalityRoutes } = useMemo(
    () => calculateSupplierStats(hierarchyData),
    [hierarchyData]
  );

  const supplierHasDependencies = hierarchyData?.children?.length > 0;

  const rawIndicators = useMemo(
    () => generateSupplierIndicators(supplier, suppliers),
    [supplier]
  );

  const supplierActions = useMemo(
    () => getActionsForSupplier(actions, supplier._id).map((a) => ({
      ...a,
      supplierName: supplier.name,
    })),
    [supplier._id]
  );

  const supplierRisks = useMemo(
    () => getRisksForSupplier(risks, supplier._id),
    [supplier._id]
  );

  const toggleFilter = (severity) => {
    setActiveFilter((prev) => (prev === severity ? null : severity));
  };

  const counts = {
    critical: rawIndicators.filter((i) => i.severity === "critical").length,
    warning: rawIndicators.filter((i) => i.severity === "warning").length,
    info: rawIndicators.filter((i) => i.severity === "info").length,
  };

  const filteredIndicators = activeFilter
    ? rawIndicators.filter((i) => i.severity === activeFilter)
    : rawIndicators;

  return (
    <div className="w-full flex flex-col gap-3 h-full overflow-hidden">

      {/* Page Header — never scrolls */}
      <div className="flex items-center shrink-0">
        <Button
          onClick={() => navigate(-1)}
          label=""
          icon={
            <IoChevronBackCircle className="text-4xl text-gray-700 hover:text-gray-500" />
          }
          className="flex rounded-full items-center text-white"
        />
        <h1 className="text-2xl font-semibold text-gray-600">
          Supplier Details
        </h1>
      </div>

      {/* Everything below header — fills remaining height, no page scroll */}
      <div className="flex-1 min-h-0 flex gap-5">

        {/* Left — Tabs fill full height */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col">
          <Tabs tabs={TABS} selected={selected} setSelected={setSelected}>
            <>
              {selected === 0 ? (

                /* Details tab — two columns, each scrolls independently */
                <div className={clsx(
                  "w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md rounded-md border-l-5 px-4 py-5 flex-1 min-h-0",
                  RISK_BORDER_STYLES[supplier.RiskLevel]
                )}>

                  {/* Supplier info — scrolls */}
                  <div className="w-full md:w-1/2 bg-white shadow rounded-lg p-4 flex flex-col min-h-0 overflow-y-auto">
                    <div className="flex items-center gap-3 flex-wrap pb-3 border-b border-gray-200 shrink-0">
                      <h2 className="text-2xl font-bold text-gray-600">
                        {supplier?.name}
                      </h2>
                      <span className="text-white text-sm font-bold px-2.5 py-1 rounded-md whitespace-nowrap bg-blue-600">
                        Tier {supplier?.tier}
                      </span>
                      <span className={clsx(
                        "text-white text-sm font-semibold px-2 py-1 rounded-md whitespace-nowrap",
                        RISK_LEVEL_BG[supplier.RiskLevel]
                      )}>
                        {supplier?.RiskLevel} Risk
                      </span>
                    </div>

                    <div className="space-y-1 bg-blue-50 p-2 rounded-lg mt-3">
                      <p className="font-semibold text-sm">REVENUE DEPENDENCY</p>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-blue-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${supplier?.capacity * 100}%` }}
                          />
                        </div>
                        <span className="text-blue-700 font-semibold">
                          {(supplier?.capacity * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                        <MdLocationOn className="text-blue-500 shrink-0" size={18} />
                        <p className="text-sm text-gray-500 font-semibold">
                          LOCATION: {supplier?.location}, {supplier?.address}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                        <MdBusinessCenter className="text-amber-500 shrink-0" size={18} />
                        <p className="text-sm text-gray-500 font-semibold">
                          OPERATION TYPE: {supplier?.operation_type}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                        <MdAttachMoney className="text-green-500 shrink-0" size={18} />
                        <p className="text-sm text-gray-500 font-semibold">
                          CONTRACT VALUE: £{supplier?.contract_value?.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                        <MdGavel className="text-purple-500 shrink-0" size={18} />
                        <p className="text-sm text-gray-500 font-semibold">
                          LEGAL STATUS: {supplier?.legal_status}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                        <MdCalendarToday className="text-indigo-500 shrink-0" size={18} />
                        <p className="text-sm text-gray-500 font-semibold">
                          INCORPORATED: {new Date(supplier?.incorporated_date).toDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <MdCalendarToday className="text-amber-500 shrink-0" size={18} />
                        <p className="text-sm text-gray-500 font-semibold">
                          CONTRACT EXPIRY: {new Date(supplier?.contract_expiry_date).toDateString()}
                        </p>
                      </div>
                    </div>

                    {supplier?.contacts && supplier?.contacts?.length > 0 && (
                      <div className="space-y-3 pt-4 mt-4 border-t border-gray-200">
                        <p className="font-semibold text-md">Contacts</p>
                        <div className="space-y-2">
                          {supplier?.contacts?.map((contact, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 py-1 px-4 border border-blue-200 rounded-md bg-blue-50"
                            >
                              <div className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-semibold bg-blue-600 shrink-0">
                                {getInitials(contact?.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-lg font-semibold text-gray-700">{contact?.name}</p>
                                <p className="text-sm text-gray-600">{contact?.title}</p>
                                <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                                  <FaEnvelope size={14} />
                                  <span className="truncate">{contact?.email}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Risks — header fixed, cards scroll */}
                  <div className="w-full md:w-1/2 bg-white shadow rounded-lg p-3 flex flex-col min-h-0">
                    <div className="justify-between items-center mb-2 flex border-b border-gray-200 pb-2 shrink-0">
                      <span className="font-semibold text-lg p-2">Risks</span>
                      <Button
                        onClick={() => setOpen(true)}
                        label="Add Risk"
                        icon={<IoMdAdd />}
                        className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-1 px-3 text-sm"
                      />
                    </div>

                    {supplierRisks && supplierRisks.length > 0 ? (
                      <div className="w-full grid grid-cols-2 gap-4 p-2 overflow-y-auto flex-1 min-h-0">
                        {supplierRisks.map((risk, index) => (
                          <div key={index} className="relative group">
                            <SupplierRiskCard risk={risk} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic flex justify-center items-center flex-1">
                        There are no risks associated with {supplier?.name}
                      </p>
                    )}
                  </div>
                </div>

              ) : selected === 1 ? (

                /* Dependency map tab */
                <div className="shadow rounded-lg p-2 bg-white flex flex-col flex-1 min-h-0">
                  <div className="flex justify-between items-center border-b border-gray-200 p-2 mb-2 shrink-0">
                    <p className="font-semibold text-lg">Supplier Dependencies</p>
                    <div className="flex gap-2">
                      <div className="bg-blue-50 px-3 py-1 rounded-md text-center">
                        <p className="text-xs">Downstream Suppliers</p>
                        <p className="font-semibold text-blue-700">{totalDownstreamSuppliers}</p>
                      </div>
                      <div className="bg-red-50 px-3 py-1 rounded-md text-center">
                        <p className="text-xs">High Criticality Routes</p>
                        <p className="font-semibold text-red-700">{highCriticalityRoutes}</p>
                      </div>
                    </div>
                  </div>

                  {!supplierHasDependencies ? (
                    <p className="text-gray-500 italic flex justify-center items-center flex-1">
                      {supplier?.name} has no dependencies
                    </p>
                  ) : (
                    <div className="flex-1 min-h-0">
                      <TierMap data={hierarchyData} />
                    </div>
                  )}
                </div>

              ) : (

                /* Actions tab */
                <div className="bg-white shadow rounded-lg p-4 flex flex-col flex-1 min-h-0">
                  <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-200 shrink-0">
                    <p className="font-semibold text-lg">Actions</p>
                    <Button
                      onClick={() => {}}
                      label="Add Action"
                      icon={<IoMdAdd />}
                      className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-1 px-3 text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-4 mb-4 flex-wrap shrink-0">
                    <FilterBar
                      filters={ACTION_STAGE_FILTERS}
                      activeFilter={actionStageFilter}
                      onToggle={(v) => setActionStageFilter((prev) => prev === v ? null : v)}
                    />
                    <div className="w-px h-5 bg-gray-200 shrink-0" />
                    <FilterBar
                      filters={ACTION_PRIORITY_FILTERS}
                      activeFilter={actionPriorityFilter}
                      onToggle={(v) => setActionPriorityFilter((prev) => prev === v ? null : v)}
                    />
                  </div>

                  {/* Scrollable action cards */}
                  <div className="overflow-y-auto flex-1 min-h-0">
                    {(() => {
                      const filtered = supplierActions.filter((a) => {
                        const matchesStage = !actionStageFilter || a.stage === actionStageFilter;
                        const matchesPriority = !actionPriorityFilter || a.priority === actionPriorityFilter;
                        return matchesStage && matchesPriority;
                      });

                      return filtered.length === 0 ? (
                        <p className="text-gray-500 italic flex justify-center items-center h-full">
                          {supplierActions.length === 0
                            ? `No actions logged for ${supplier?.name}.`
                            : "No actions match the selected filters."}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-2">
                          {filtered.map((action) => (
                            <TaskCard key={action._id} task={action} />
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </>
          </Tabs>
        </div>

        {/* Right — Risk Signals Panel, full height, scrolls internally */}
        <div className="w-96 shrink-0 bg-white shadow rounded-lg p-4 flex flex-col min-h-0">
          <h2 className="text-lg font-semibold mb-1 shrink-0">Risk Indicators</h2>

          <RiskIndicatorFilterBar
            activeFilter={activeFilter}
            toggleFilter={toggleFilter}
            counts={counts}
          />

          <div className="flex flex-col gap-3 overflow-y-auto flex-1 min-h-0">
            {filteredIndicators.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No risk indicators detected for {supplier?.name}.
              </p>
            ) : (
              filteredIndicators.map((indicator, index) => (
                <RiskIndicatorCard
                  key={`${indicator.supplierId}-${index}`}
                  indicator={indicator}
                  showNavigate={false}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;