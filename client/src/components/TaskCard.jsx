import clsx from "clsx";
import React, { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, PRIORITYSTYLES, TASK_TYPE, formatDate } from "../utils";
import TaskDialog from "./task/TaskDialog";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "./UserInfo";
import { IoMdAdd } from "react-icons/io";
import AddSubTask from "./task/AddSubTask";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false); // state to manage the open/close state of the task card details

  return (
    <>
      <div className="w-full h-fit bg-white shadow-sm hover:shadow-md transition-shadow duration-200 p-4 rounded-lg border border-gray-100">
        <div className="w-full flex justify-between items-start">
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIORITYSTYLES[task?.priority],
            )}
          >
            <span className="text-lg">{ICONS[task?.priority]}</span>
            <span className="uppercase">{task?.priority} Priority</span>
          
          {/*button to toggle task details, only visible to admin users. REPLACE TRUE WITH user?.isAdmin*/}
          </div>
          {true && <TaskDialog task={task} />}
        </div>
        <>
          <div className="flex items-center gap-2 mt-3">
            <div
              className={clsx("w-3 h-3 rounded-full shrink-0", TASK_TYPE[task.stage])}
            />
            <h4 className="line-clamp-1 text-gray-900 font-semibold"> 
              {task?.title}
            </h4>
          </div>
          <span className='text-xs text-gray-500 mt-1 block'>
            {formatDate(new Date(task?.date))}
          </span>
        </>
        <div className="w-full border-t border-gray-150 my-3"/>
        <div className="flex items-center justify-between mb-3">

          {/*section for team members assigned to the task*/}
          <div className='flex flex-row-reverse'>
            {task?.team?.map((m, index) => (
              <div
                key={index}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm mr-1",
                  BGS[index % BGS?.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4"> {/*section for task details like comments, attachments, subtasks*/}
            <div className="flex gap-1 items-center text-xs text-gray-500 hover:text-gray-700 transition-colors">
              <BiMessageAltDetail className="text-sm"/>
              <span>{task?.activities?.length}</span>
            </div>
            <div className='flex gap-1 items-center text-xs text-gray-500 hover:text-gray-700 transition-colors'>
              <MdAttachFile className="text-sm"/>
              <span>{task?.assets?.length}</span>
            </div>
            <div className='flex gap-1 items-center text-xs text-gray-500 hover:text-gray-700 transition-colors'>
              <FaList className="text-sm"/>
              <span>0/{task?.subTasks?.length}</span>
            </div>
          </div>
          
        </div>
        {/* sub tasks */}
        {task?.subTasks?.length > 0 ? (
          <div className='py-3 border-t border-gray-150'>
            <h5 className='text-sm line-clamp-1 text-gray-900 font-semibold'>
              {task?.subTasks[0].title}
            </h5>

            <div className='pt-2 space-x-3 flex items-center'>
              <span className='text-xs text-gray-500'>
                {formatDate(new Date(task?.subTasks[0]?.date))}
              </span>
              <span className='bg-blue-600/10 px-2 py-1 rounded-full text-blue-700 text-xs font-medium'>
                {task?.subTasks[0].tag}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className='py-3 border-t border-gray-150'>
              <span className='text-xs text-gray-400'>No Sub Tasks</span>
            </div>
          </>
        )}
        {/*add sub task button, only visible to admin users. REPLACE TRUE WITH user?.isAdmin*/}
        <div className='w-full pt-2'>
          <button
            onClick={() => setOpen(true)}
            disabled={true ? false : true}
            className='w-full flex gap-3 items-center text-xs text-blue-600 font-semibold hover:text-blue-700 hover:bg-blue-50 py-2 px-2 rounded transition-colors disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent'
          >
            <IoMdAdd className='text-base' />
            <span>ADD SUBTASK</span>
          </button>
        </div>
      
      </div>
      <AddSubTask open={open} setOpen={setOpen} id={task.id}/>
    </>
  );
};

export default TaskCard;
