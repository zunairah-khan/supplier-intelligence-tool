import React, { useState } from 'react';
import clsx from 'clsx';
import { BGS } from "../../utils";
import UserInfo from "../UserInfo";
import Button from "../Button";
import ConfirmationDialog from '../ConfirmationDialog';
import { useNavigate } from 'react-router-dom';

const RISK_STYLES = {
  High: "text-red-600",
  Medium: "text-yellow-600",
  Low: "text-green-600",
};

const RISK_BADGES = {
  High: "bg-red-600",
  Medium: "bg-yellow-600",
  Low: "bg-green-600",
};

const SupplierTable = ({ suppliers }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const deleteHandler = () => { };

  const TableHeader = () => (
    <thead className='w-full border-b border-gray-300'>
      <tr className='w-full text-black text-left'>
        <th className='py-2'>Supplier Name</th>
        <th className='py-2'>Tier</th>
        <th className='py-2'>Risk Level</th>
        <th className='py-2'>Location</th>
        <th className='py-2'>Capacity</th>
        <th className='py-2'>Contract Value</th>
        <th className='py-2'>Contacts</th>
      </tr>
    </thead>
  );

  const TableRow = ({ supplier }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10'>
      <td className='py-2'>
        <p className='line-clamp-2 text-base text-black font-medium'>
          {supplier?.name}
        </p>
      </td>

      <td className='py-2'>
        <span className="text-white text-xs font-bold px-2.5 py-1 rounded-md bg-blue-600 whitespace-nowrap">
          Tier {supplier?.tier}
        </span>
      </td>

      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <span
            className={clsx(
              "text-white text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap",
              RISK_BADGES[supplier?.RiskLevel]
            )}
          >
            {supplier?.RiskLevel} Risk
          </span>
        </div>
      </td>

      <td className='py-2'>
        <span className='text-sm text-gray-600'>
          {supplier?.location}
        </span>
      </td>

      <td className='py-2'>
        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
          {supplier?.capacity ? (supplier.capacity * 100).toFixed(0) : '0'}%
        </span>
      </td>

      <td className='py-2'>
        <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
          £{supplier?.contract_value || '0'}
        </span>
      </td>

      <td className='py-2'>
        <div className='flex flex-row items-center gap-1'>
          {supplier?.contacts?.length > 0 ? (
            supplier?.contacts?.slice(0, 5).map((contact, index) => (
              <div
                key={index}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm font-semibold",
                  BGS[index % BGS?.length]
                )}
                title={`${contact.name} - ${contact.title}`}
              >
                <UserInfo user={contact} />
              </div>
            ))
          ) : (
            <span className='text-sm text-gray-400'>No contacts</span>
          )}
        </div>
      </td>

      <td className='py-2 flex gap-2 md:gap-4 justify-end'>
        <Button
          className='text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base'
          label='View'
          type='button'
          onClick={ () => navigate(`/suppliers/${supplier._id}`)}
        />

        <Button
          className='text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base'
          label='Delete'
          type='button'
          onClick={() => deleteClicks(supplier._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className='bg-white px-2 md:px-4 pt-4 pb-9 shadow-md rounded'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <TableHeader />
            <tbody>
              {suppliers?.map((supplier, index) => (
                <TableRow key={index} supplier={supplier} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onYesClick={deleteHandler}
      />
    </>
  );
};

export default SupplierTable;