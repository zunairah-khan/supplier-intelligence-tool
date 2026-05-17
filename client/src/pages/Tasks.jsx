import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView, MdOutlineSearch } from "react-icons/md";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import GridView from "../components/GridView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import Title from "../components/Title";
import { suppliers } from "../assets/data";
import { actions } from "../assets/data";
import { getSupplierActions } from "../utils/getSupplierActions";
import FilterBar from "../components/FilterBar";

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
  const [searchQuery, setSearchQuery] = useState("");
  const status = params?.status || "";
  const [stageFilter, setStageFilter] = useState(null);
const [priorityFilter, setPriorityFilter] = useState(null);

const STAGE_FILTERS = [
  { value: "todo", label: "To Do", colour: "bg-blue-600" },
  { value: "in progress", label: "In Progress", colour: "bg-yellow-500" },
  { value: "completed", label: "Completed", colour: "bg-green-600" },
];

const PRIORITY_FILTERS = [
  { value: "High", label: "High Priority", colour: "bg-red-600" },
  { value: "Medium", label: "Medium Priority", colour: "bg-yellow-500" },
  { value: "Low", label: "Low Priority", colour: "bg-green-600" },
];

  // Attach supplier names to all actions for display
  const allActions = getSupplierActions(actions, suppliers);

 const filteredActions = allActions.filter((action) => {
  const query = searchQuery.trim().toLowerCase();

  const matchesSearch = !query || [
    action?.title,
    action?.priority,
    action?.stage,
    action?.supplierName,
    action?.team?.map((m) => `${m.name} ${m.email} ${m.title}`).join(" "),
  ].filter(Boolean).some((v) => v.toLowerCase().includes(query));

  const matchesStage = !stageFilter || action.stage === stageFilter;
  const matchesPriority = !priorityFilter || action.priority === priorityFilter;

  return matchesSearch && matchesStage && matchesPriority;
});

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title="Actions" />


        <Button
          onClick={() => setOpen(true)}
          label="Add Action"
          icon={<IoMdAdd className="text-lg" />}
          className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
        />
      </div>
      {/*Filter bars for stage and priority*/}
      <div className="flex items-center gap-6 mb-4">
        <div className="w-64 2xl:w-100 flex items-center py-2 px-3 gap-2 rounded-full bg-white">
          <MdOutlineSearch className="text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
          />
        </div>
         <div className="w-px h-5 bg-gray-300 shrink-0" />
  <FilterBar
    filters={STAGE_FILTERS}
    activeFilter={stageFilter}
    onToggle={(v) => setStageFilter((prev) => prev === v ? null : v)}
  />
  <div className="w-px h-5 bg-gray-300 shrink-0" />
  <FilterBar
    filters={PRIORITY_FILTERS}
    activeFilter={priorityFilter}
    onToggle={(v) => setPriorityFilter((prev) => prev === v ? null : v)}
  />
</div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        

        {selected === 0 ? (
          <GridView tasks={filteredActions} />
        ) : (
          <Table tasks={filteredActions} />
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;