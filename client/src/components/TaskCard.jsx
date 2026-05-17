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

const STAGE_LABEL = {
  todo: "To Do",
  "in progress": "In Progress",
  completed: "Completed",
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
        {/* Left coloured bar */}
        <div className={clsx("w-2 shrink-0 rounded-l-lg", TASK_TYPE[task.stage])} />

        <div className="p-5 flex flex-col gap-3 flex-1 min-w-0">

          {/* Top row — priority + supplier + meta counts + dialog */}
          <div className="flex items-start justify-between gap-2">

            {/* Left — supplier + priority + status */}
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">

              {/* Status tag */}
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap border border-gray-200 text-gray-600 bg-white">
                <div className={clsx("w-2 h-2 rounded-full shrink-0", TASK_TYPE[task?.stage])} />
                {STAGE_LABEL[task?.stage] || task?.stage}
              </span>
              
              {task?.supplierName && (
                <span className="text-white text-xs font-bold px-2.5 py-1 rounded-md whitespace-nowrap bg-blue-600">
                  {task.supplierName}
                </span>
              )}

              <span className={clsx(
                "flex items-center gap-1 text-white text-xs font-bold px-2.5 py-1 rounded-md whitespace-nowrap",
                PRIORITY_COLOUR[task?.priority]
              )}>
                {ICONS[task?.priority]}
                {task?.priority} Priority
              </span>

              
            </div>

            {/* Right — meta counts + dialog */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-3 text-gray-400">
                <div className="flex items-center gap-1 text-xs">
                  <BiMessageAltDetail size={13} />
                  <span>{task?.comments?.length}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <MdAttachFile size={13} />
                  <span>{task?.assets?.length}</span>
                </div>
              </div>

              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                {true && <TaskDialog task={task} />}
              </div>
            </div>
          </div>

          {/* Title + date */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base text-gray-900 line-clamp-2 leading-snug">
              {task?.title}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDate(new Date(task?.date))}
            </p>
          </div>

          {/* Description */}
          {task?.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Team avatars */}
          <div className="flex -space-x-2 shrink-0 justify-end">
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
      </div>

      <AddSubTask open={open} setOpen={setOpen} id={task.id} />
    </>
  );
};

export default TaskCard;