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
  const tier = params?.tier || "";

  return loading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={tier ? ` Tier ${tier} Suppliers` : "Suppliers"} />

        {/*render create task button when no status*/}
        {!tier && (
          <Button
            onClick={()=> setOpen(true)}
            label="Add Action"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>
      {/*Tabs for grid and list view*/}
      <div>
        <Tabs tabs={TABS} setSelected={setSelected}>
          {!tier && (
            <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
              <TaskTitle label="High Risk" className={SUPPLIER_TYPE.highRisk} />
              <TaskTitle
                label="Medium Risk"
                className={SUPPLIER_TYPE.mediumRisk}
              />
              <TaskTitle label="Low Risk" className={SUPPLIER_TYPE.lowRisk} />
            </div>
          )}
          {selected === 0 ? (
            <GridView suppliers={suppliers} />
          ) : (
            <div>
              <SupplierTable suppliers={suppliers} />
            </div>
          )}
        </Tabs>
        <AddTask open={open} setOpen={setOpen}/>
      </div>
      
    </div>
  );
};

export default Suppliers;