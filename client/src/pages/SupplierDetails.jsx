import React from "react";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import { suppliers } from "../assets/data";
import { getInitials } from "../utils";
import { 
  MdBusinessCenter, 
  MdLocationOn, 
  MdAttachMoney, 
  MdCalendarToday,
  MdGavel
} from "react-icons/md";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import Breadcrumb from "../components/Breadcrumb";
import SupplierRiskCard from "../components/supplier/SupplierRiskCard";

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

  if (!supplier) {
    return <div className="text-red-600">Error: Supplier not found</div>;
  }

  return (

    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
      <Breadcrumb/>
      <h1 className="text-2xl text-gray-600 font-bold">Supplier Overview</h1>
      
      <div 
      className={clsx(
              "w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md  p-5 rounded-md border-l-5 px-8 py-8 overflow-y-auto",
              RISK_BORDER_STYLES[supplier.RiskLevel]
            )}>
        {/* LEFT SECTION */}
        <div className="w-full md:w-1/2 space-y-5 bg-white shadow rounded-lg p-6">
          {/* Supplier Name with Risk Level & Tier */}
          <div className="flex items-center gap-5 flex-wrap">
            <h2 className="text-3xl font-bold text-gray-600">{supplier?.name}</h2>
            <span className="text-white text-sm font-bold px-2.5 py-1 rounded-md whitespace-nowrap bg-blue-600">Tier {supplier?.tier}</span>
            
              <span className={clsx(
                          "text-white text-sm font-semibold px-2 py-1 rounded-md whitespace-nowrap",
                          RISK_LEVEL_BG[supplier.RiskLevel]
                        )}>{supplier?.RiskLevel} Risk</span>
            
              
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
              <span className="text-blue-700 font-semibold">{(supplier?.capacity * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <MdLocationOn className="text-blue-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500 font-semibold">LOCATION</p>
                <p className="text-gray-700">{supplier?.location}</p>
                <p className="text-sm text-gray-600 mt-1">{supplier?.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <MdBusinessCenter className="text-amber-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500 font-semibold">OPERATION TYPE</p>
                <p className="text-gray-700">{supplier?.operation_type}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <MdAttachMoney className="text-green-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500 font-semibold">CONTRACT VALUE</p>
                <p className="text-gray-700 text-lg font-semibold">£{supplier?.contract_value?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          

          {/* Legal & Date Information */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
              <MdGavel className="text-purple-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500 font-semibold">LEGAL STATUS</p>
                <p className="text-gray-700">{supplier?.legal_status}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MdCalendarToday className="text-indigo-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500 font-semibold">INCORPORATED DATE</p>
                <p className="text-gray-700">
                  {new Date(supplier?.incorporated_date).toDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Contacts */}
          {supplier?.contacts && supplier?.contacts?.length > 0 && (
            <div className="space-y-3 py-4 border-t border-gray-200">
              <p className=" font-semibold text-sm">CONTACTS</p>
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
                      <span className="text-center">{getInitials(contact?.name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-700">{contact?.name}</p>
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

        {/* RIGHT SECTION - ASSETS */}
        <div className="w-full md:w-1/2 space-y-8">
        <div> {/*Risk gallery section*/}
          <p className=" font-semibold  mb-6">RISK GALLERY</p>
          <div className="w-full grid grid-cols-2 gap-4">
            {supplier?.risks?.map((risk, index) => (
              <div
                key={index}
                className="relative group overflow-hidden"
              >
                <SupplierRiskCard/>
              </div>
            ))}
          </div>
        </div>
          <div>
            <p className=" font-semibold  mb-6">ASSETS</p>

            {supplier?.assets && supplier?.assets?.length > 0 ? (
              <div className="w-full grid grid-cols-4 gap-4">
                {supplier?.assets?.map((asset, index) => (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-lg shadow-md"
                  >
                    <img
                      src={asset}
                      alt={`${supplier?.name} asset ${index + 1}`}
                      className="w-full rounded h-28 md:h-36 2xl:h-52 object-cover cursor-pointer transition-all duration-700 group-hover:scale-125 group-hover:z-50"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-500">No assets available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;