import React from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { BGS } from "../utils";
import UserInfo from "./UserInfo";
import SupplierDialog from "./supplier/SupplierDialog";
import { useSelector } from "react-redux";

const RISK_STYLES = {
  High: "border-l-4 border-red-600",
  Medium: "border-l-4 border-yellow-600",
  Low: "border-l-4 border-green-600",
};

const RISK_BADGES = {
  High: "bg-red-600",
  Medium: "bg-yellow-600",
  Low: "bg-green-600",
};


const SupplierCard = ({ supplier }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  return (
    <div
     
      className={clsx(
        "w-full h-fit bg-white shadow-md hover:shadow-xl p-5 rounded-lg cursor-pointer transition-all duration-200 border-l-8",
        RISK_STYLES[supplier.RiskLevel]
      )}
    >
      <div className="flex items-start justify-between mb-1 gap-2">
        <h3 className="font-bold text-base text-gray-900 line-clamp-2 flex-1">{supplier.name}</h3>
        <SupplierDialog supplier={supplier} />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-white text-xs font-bold px-2.5 py-1 rounded-md whitespace-nowrap bg-blue-600">
          Tier {supplier.tier}
        </span>
        <span
          className={clsx(
            "text-white text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap",
            RISK_BADGES[supplier.RiskLevel]
          )}
        >
          {supplier.RiskLevel} Risk
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-700 mb-4">
        <div>
          <span className="font-semibold text-gray-800">Type:</span>
          <span className="ml-2 text-gray-600">{supplier.operation_type}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-800">Status:</span>
          <span className="ml-2 text-gray-600">{supplier.legal_status}</span>
        </div>
        
          <div>
            <span className="font-semibold text-gray-800">Location:</span>
            <span className="ml-2 text-gray-600 ">{supplier.location}</span>
          </div>

          <div className="flex flex-wrap gap-2 justify-start">
              {supplier.capacity && (
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Capacity: {(supplier.capacity * 100).toFixed(0)}%
                </span>
              )}
              {supplier.contract_value && (
                <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Contract Value: £{supplier.contract_value}
                </span>
              )}
            </div>
        
      </div>

      {supplier.contacts && supplier.contacts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-gray-800 text-sm">Contacts ({supplier.contacts.length})</p>
          </div>
          <div className='flex flex-row items-center justify-start gap-1'>
            {supplier.contacts?.map((contact, index) => (
              <div
                key={index}
                className={clsx(
                  "w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold transition-transform hover:scale-110",
                  BGS[index % BGS?.length]
                )}
                title={`${contact.name} - ${contact.title}`}
              >
                <UserInfo user={contact} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierCard;
