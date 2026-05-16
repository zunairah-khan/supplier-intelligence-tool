import clsx from "clsx";
import React, { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, TASK_TYPE, formatDate } from "../utils";
import TaskDialog from "./task/TaskDialog";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "./UserInfo";
import { IoMdAdd } from "react-icons/io";
import AddSubTask from "./task/AddSubTask";
import { useNavigate } from "react-router-dom";

const ICONS = {
  High: <MdKeyboardDoubleArrowUp size={12} />,
  Medium: <MdKeyboardArrowUp size={12} />,
  Low: <MdKeyboardArrowDown size={12} />,
};

const PRIORITY_COLOUR = {
  High: "bg-red-600",
  Medium: "bg-yellow-600",
  Low: "bg-blue-400",
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div
  className="w-full bg-white rounded-lg border border-gray-100 shadow-md hover:shadow-xl flex flex-row cursor-pointer transition-all duration-200"
  
>
  {/* Left coloured bar — use rounded corners manually instead of overflow-hidden */}
  <div className={clsx("w-2 shrink-0 rounded-l-lg", TASK_TYPE[task.stage])} />

        <div className="p-5 flex flex-col gap-3 flex-1 min-w-0">

          {/* Top row — priority + supplier + meta counts + dialog */}
          <div className="flex items-start justify-between gap-2">

            {/* Left — priority + supplier */}
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
              {task?.supplierName && (
                <span className="text-white text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap bg-blue-600">
                  {task.supplierName}
                </span>
              )}
              <span className={clsx(
                "flex items-center gap-1 text-white text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap",
                PRIORITY_COLOUR[task?.priority]
              )}>
                {ICONS[task?.priority]}
                {task?.priority?.charAt(0).toUpperCase() + task?.priority?.slice(1)} Priority
              </span>

              
            </div>

            {/* Right — meta counts + dialog */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-3 text-gray-400">
                <div className="flex items-center gap-1 text-xs">
                  <BiMessageAltDetail size={13} />
                  <span>{task?.activities?.length}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <MdAttachFile size={13} />
                  <span>{task?.assets?.length}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <FaList size={11} />
                  <span>0/{task?.subTasks?.length}</span>
                </div>
              </div>

              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                {true && <TaskDialog task={task} />}
              </div>
            </div>
          </div>

          {/* Title + team row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-base text-gray-900 line-clamp-2 leading-snug">
                {task?.title}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(new Date(task?.date))}
              </p>
            </div>

            {/* Team avatars beside title */}
            <div className="flex -space-x-2 shrink-0">
              {task?.team?.map((m, index) => (
                <div
                  key={index}
                  className={clsx(
                    "w-7 h-7 rounded-full text-white flex items-center justify-center text-xs border-2 border-white font-semibold",
                    BGS[index % BGS?.length]
                  )}
                >
                  <UserInfo user={m} />
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {task?.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Sub task preview */}
          {task?.subTasks?.length > 0 ? (
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
              <p className="text-xs font-semibold text-gray-700 line-clamp-1">
                {task?.subTasks[0].title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">
                  {formatDate(new Date(task?.subTasks[0]?.date))}
                </span>
                <span className="bg-blue-600/10 text-blue-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
                  {task?.subTasks[0].tag}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No sub-tasks</p>
          )}

          {/* Add subtask button */}
          <div onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(true)}
              className="w-full flex gap-2 items-center justify-center text-xs text-blue-600 font-semibold hover:text-blue-700 hover:bg-blue-50 py-2 px-2 rounded-lg transition-colors border border-dashed border-blue-200 hover:border-blue-400"
            >
              <IoMdAdd className="text-base" />
              ADD SUBTASK
            </button>
          </div>

        </div>
      </div>

      <AddSubTask open={open} setOpen={setOpen} id={task.id} />
    </>
  );
};

export default TaskCard;