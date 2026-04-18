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
import { tasks } from "../assets/data";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { MdOutlineSearch } from "react-icons/md";
const TABS = [
  { title: "Grid View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const status = params?.status || "";

  return loading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={"Actions"} />
        {/*Search bar*/}
                <div className='w-64 2xl:w-100 flex items-center py-2 px-3 gap-2 rounded-full bg-[#ffffff]'>
                  <MdOutlineSearch className='text-gray-500 text-xl' />
                {/*input field for search*/}
                  <input
                    type='text'
                    placeholder='Search....'
                    className='flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800'
                  />
                </div>

          <Button
            onClick={()=> setOpen(true)}
            label="Add Action"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
       
      </div>
      {/*Tabs for grid and list view*/}
      <div>
        <Tabs tabs={TABS} setSelected={setSelected}>
          {!status && (
            <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
              <TaskTitle label="To Do" className={TASK_TYPE.todo} />
              <TaskTitle
                label="In Progress"
                className={TASK_TYPE["in progress"]}
              />
              <TaskTitle label="Completed" className={TASK_TYPE.completed} />
            </div>
          )}
          {selected === 0 ? (
            <GridView tasks={tasks} />
          ) : (
            <div>
              <Table tasks={tasks} />
            </div>
          )}
        </Tabs>
        <AddTask open={open} setOpen={setOpen}/>
      </div>
      
    </div>
  );
};

export default Tasks;
