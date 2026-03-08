import { React, useState } from "react";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import { suppliers } from "../assets/data";
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
import { FaPhone, FaEnvelope } from "react-icons/fa";
import TierMap from "../components/TierMap";
import { buildSupplierHierarchy } from "../utils/buildSupplierHierarchy";

import SupplierRiskCard from "../components/supplier/SupplierRiskCard";
import Button from "../components/Button";
import { IoChevronBackCircle } from "react-icons/io5";

const RISK_BORDER_STYLES = {
  High: "border-red-600",
  Medium: "border-yellow-600",
  Low: "border-green-600",
};

const RISK_LEVEL_BG = {
  High: "bg-red-600",
  Medium: "bg-yellow-600",
  Low: "bg-green-600",
};

const SupplierDetails = () => {
  const { id } = useParams();
  const supplier = suppliers[0]; // Using first supplier as default
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const supplierId = supplier._id;
  // Build supplier hierarchy for tier mapping from current supplier id
  const hierarchyData = buildSupplierHierarchy(suppliers, supplierId);

  if (!supplier) {
    return <div className="text-red-600">Error: Supplier not found</div>;
  }

  return (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
      <div className="flex items-center ">
        <Button
          onClick={() => navigate(-1)}
          label=""
          icon={
            <IoChevronBackCircle className="text-4xl text-gray-700 hover:text-gray-500" />
          }
          className="flex  rounded-full items-center  text-white  "
        />

        <span>
          <h1 className="text-2xl font-semibold text-gray-600">
            Supplier Overview
          </h1>
        </span>
      </div>

      <div
        className={clsx(
          "w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md  p-5 rounded-md border-l-5 px-4 py-5 overflow-y-auto",
          RISK_BORDER_STYLES[supplier.RiskLevel],
        )}
      >
        {/* LEFT SECTION */}
        <div className="w-full md:w-1/2 space-y-5 bg-white shadow rounded-lg p-6">
          {/* Supplier Name with Risk Level & Tier */}
          <div className="flex items-center gap-5 flex-wrap">
            <h2 className="text-3xl font-bold text-gray-600">
              {supplier?.name}
            </h2>
            <span className="text-white text-sm font-bold px-2.5 py-1 rounded-md whitespace-nowrap bg-blue-600">
              Tier {supplier?.tier}
            </span>

            <span
              className={clsx(
                "text-white text-sm font-semibold px-2 py-1 rounded-md whitespace-nowrap",
                RISK_LEVEL_BG[supplier.RiskLevel],
              )}
            >
              {supplier?.RiskLevel} Risk
            </span>
          </div>

          {/* Capacity */}
          <div className="space-y-1 bg-blue-50 p-2 rounded-lg">
            <p className=" font-semibold text-sm">PRODUCTION CAPACITY</p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-blue-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${supplier?.capacity * 100}%` }}
                ></div>
              </div>
              <span className="text-blue-700 font-semibold">
                {(supplier?.capacity * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <MdLocationOn className="text-blue-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500 font-semibold">LOCATION</p>
                <p className="text-gray-700">{supplier?.location}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {supplier?.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <MdBusinessCenter className="text-amber-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500 font-semibold">
                  OPERATION TYPE
                </p>
                <p className="text-gray-700">{supplier?.operation_type}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <MdAttachMoney className="text-green-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500 font-semibold">
                  CONTRACT VALUE
                </p>
                <p className="text-gray-700 text-lg font-semibold">
                  £{supplier?.contract_value?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Legal & Date Information */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <MdGavel className="text-purple-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500 font-semibold">
                  LEGAL STATUS
                </p>
                <p className="text-gray-700">{supplier?.legal_status}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MdCalendarToday className="text-indigo-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500 font-semibold">
                  INCORPORATED DATE
                </p>
                <p className="text-gray-700">
                  {new Date(supplier?.incorporated_date).toDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Contacts */}
          {supplier?.contacts && supplier?.contacts?.length > 0 && (
            <div className="space-y-3 py-4 border-t border-gray-200">
              <p className=" font-semibold text-md">Contacts</p>
              <div className="space-y-2">
                {supplier?.contacts?.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-1 px-4 border border-blue-200 rounded-md bg-blue-50"
                  >
                    <div
                      className={
                        "w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-semibold bg-blue-600 shrink-0"
                      }
                    >
                      <span className="text-center">
                        {getInitials(contact?.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-700">
                        {contact?.name}
                      </p>
                      <p className="text-sm text-gray-600">{contact?.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm flex-wrap">
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

        {/* RIGHT SECTION*/}
        <div className="w-full md:w-1/2 space-y-5 bg-white pb-6">
          {/* Risk Section */}
          <div className="shadow rounded-lg bg-white p-3 flex flex-col h-1/2">
            <div className="justify-between items-center mb-2 flex border-b border-gray-200">
              <span className="font-semibold text-lg mb-2 p-2">Risks</span>

              <Button
                onClick={() => setOpen(true)}
                label="Add Risk"
                icon={<IoMdAdd className="text-" />}
                className="flex flex-row-reverse  gap-1 items-center bg-gray-200 hover:bg-gray-300 rounded-md py-1 2xl:py-2.5"
              />
            </div>

            <div className="overflow-y-auto flex-1">
              {supplier?.risks && supplier?.risks?.length > 0 ? (
                <div className="w-full grid grid-cols-2 gap-4 p-2">
                  {supplier?.risks?.map((risk, index) => (
                    <div key={index} className="relative group overflow-hidden">
                      <SupplierRiskCard risk={risk} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic justify-center items-center flex h-full">
                  There are no risks associated with {supplier?.name}
                </p>
              )}
            </div>
          </div>

          {/* Supplier Tier Mapping Section */}
          <div className="shadow rounded-lg p-2 bg-white h-1/2">
            <p className="font-semibold text-lg border-b border-gray-200 p-2 mb-2">
              Supplier Dependencies
            </p>
            <div className="w-full h-flex justify-start  flex">
              <TierMap data={hierarchyData} width={500} height={400} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;
