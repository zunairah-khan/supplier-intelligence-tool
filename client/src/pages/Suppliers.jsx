import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import GridView from "../components/GridView";
import { suppliers } from "../assets/data";
import SupplierTable from "../components/supplier/SupplierTable";
import AddTask from "../components/task/AddTask";
import { MdOutlineSearch } from "react-icons/md";
const TABS = [
  { title: "Grid View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const SUPPLIER_TYPE = {
  highRisk: "bg-blue-600",
  mediumRisk: "bg-yellow-600",
  lowRisk: "bg-green-600",
};

const Suppliers = () => {
  const params = useParams();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


// returns true for all suppliers if search query empty, else check specified fields for search query 
  const filteredSuppliers = suppliers.filter((supplier) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const tierValue = supplier?.tier?.toString() || "";
    const typeValue = supplier?.operation_type || supplier?.type || "";
    const statusValue = supplier?.status || supplier?.legal_status || "";
    const contactValues = supplier?.contacts
      ? supplier.contacts
          .map((contact) => `${contact.name} ${contact.title} ${contact.email}`)
          .join(" ")
      : "";

    return [
      supplier?.name,
      tierValue,
      typeValue,
      statusValue,
      supplier?.location,
      supplier?.RiskLevel,
      contactValues,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  return loading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full ">
      <div className="flex items-center justify-between mb-4">
        
        <Title title={"Suppliers"} />
        {/*Search bar*/}
        <div className='w-64 2xl:w-100 flex items-center py-2 px-3 gap-2 rounded-full bg-[#ffffff]'>
          <MdOutlineSearch className='text-gray-500 text-xl' />
          <input
            type='text'
            placeholder='Search supplier details and contacts...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800'
          />
        </div>
          <Button
            onClick={()=> setOpen(true)}
            label="Add Supplier"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
          
        
      </div>
      {/*Tabs for grid and list view*/}
      <div>
        <Tabs tabs={TABS} setSelected={setSelected}>
          
            
          
          {selected === 0 ? (
            <GridView suppliers={filteredSuppliers} />
          ) : (
            <div>
              <SupplierTable suppliers={filteredSuppliers} />
            </div>
          )}
        </Tabs>
        <AddTask open={open} setOpen={setOpen}/>
      </div>
      
    </div>
  );
};

export default Suppliers;